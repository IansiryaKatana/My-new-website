import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PaymentListRow = {
  id: string;
  due_date: string;
  amount: number;
  payment_type: string;
  method: string | null;
  status: string;
  cheque_no: string | null;
  bank_name: string | null;
  reference: string | null;
  paid_at: string | null;
  proof_url: string | null;
  tenancy_id: string;
  tenancies: {
    id: string;
    property_id: string;
    tenant_id: string;
    properties: { id: string; title: string; community: string } | null;
    profiles: { full_name: string | null } | null;
  } | null;
};

export const getPayment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: payment, error } = await context.supabase
      .from("payments")
      .select("*, tenancies(id, start_date, end_date, properties(id,title,community,building,unit_no), profiles!tenancies_tenant_id_fkey(full_name,email,phone))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!payment) throw new Error("Payment not found");
    return payment;
  });

export const listPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { status?: string } | undefined) => d ?? {})
  .handler(async ({ data, context }): Promise<PaymentListRow[]> => {
    let q = context.supabase
      .from("payments")
      .select("id, due_date, amount, payment_type, method, status, cheque_no, bank_name, reference, paid_at, proof_url, tenancy_id, tenancies(id, property_id, tenant_id, properties(id,title,community), profiles!tenancies_tenant_id_fkey(full_name))")
      .order("due_date", { ascending: true });
    if (data.status) q = q.eq("status", data.status as never);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as PaymentListRow[];
  });

export const uploadTenantPaymentProof = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ payment_id: z.string().uuid(), proof_path: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: payment, error: readError } = await context.supabase
      .from("payments")
      .select("id, status, tenancies!inner(tenant_id)")
      .eq("id", data.payment_id)
      .single();
    if (readError) throw new Error(readError.message);

    const tenancy = payment.tenancies as { tenant_id: string };
    if (tenancy.tenant_id !== context.userId) throw new Error("Forbidden");

    const { error } = await context.supabase
      .from("payments")
      .update({ proof_url: data.proof_path, status: "pending" as never })
      .eq("id", data.payment_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updatePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string;
    status?: string;
    method?: string | null;
    cheque_no?: string | null;
    bank_name?: string | null;
    reference?: string | null;
    proof_url?: string | null;
    paid_at?: string | null;
  }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["scheduled", "pending", "cleared", "bounced", "paid", "refunded", "cancelled"]).optional(),
      method: z.enum(["cheque", "bank_transfer", "card", "cash", "stripe"]).nullable().optional(),
      cheque_no: z.string().max(40).nullable().optional(),
      bank_name: z.string().max(120).nullable().optional(),
      reference: z.string().max(200).nullable().optional(),
      proof_url: z.string().max(500).nullable().optional(),
      paid_at: z.string().nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("payments").update(patch as never).eq("id", id);
    if (error) throw new Error(error.message);

    if (patch.status === "cleared" || patch.status === "paid") {
      try {
        const { data: payment } = await context.supabase
          .from("payments")
          .select("amount, tenancies(tenant_id, properties(title))")
          .eq("id", id)
          .single();
        const tenancy = payment?.tenancies as { tenant_id?: string; properties?: { title?: string } } | null;
        if (tenancy?.tenant_id) {
          const { notifyUser } = await import("@/lib/activity.server");
          await notifyUser({
            user_id: tenancy.tenant_id,
            title: "Payment received",
            body: tenancy.properties?.title ?? "",
            entity_type: "payment",
            entity_id: id,
          });
        }
      } catch {
        // best-effort
      }
    }

    return { ok: true };
  });

export const createTenantCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { payment_id: string; success_url?: string; cancel_url?: string }) =>
    z
      .object({
        payment_id: z.string().uuid(),
        success_url: z.string().url().optional(),
        cancel_url: z.string().url().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { getStripe, getAppBaseUrl, isStripeConfigured, toStripeAmount } = await import("@/lib/stripe.server");
    if (!(await isStripeConfigured())) {
      return {
        ready: false as const,
        message: "Online payments are not configured on this platform yet.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("agency_settings")
      .select("stripe_account_id, stripe_charges_enabled, currency, agency_name")
      .eq("id", 1)
      .single();
    if (settingsError) throw new Error(settingsError.message);

    if (!settings.stripe_account_id || !settings.stripe_charges_enabled) {
      return {
        ready: false as const,
        message: "Online payments aren't enabled yet. Please use bank transfer or cheque, or contact the agency.",
      };
    }

    const { data: payment, error: paymentError } = await context.supabase
      .from("payments")
      .select(
        "id, amount, payment_type, status, due_date, stripe_checkout_session_id, tenancies!inner(tenant_id, properties(title, community))",
      )
      .eq("id", data.payment_id)
      .single();
    if (paymentError) throw new Error(paymentError.message);

    const tenancy = payment.tenancies as {
      tenant_id: string;
      properties: { title: string; community: string } | null;
    };
    if (tenancy.tenant_id !== context.userId) {
      throw new Error("You can only pay your own invoices.");
    }
    if (!["scheduled", "pending"].includes(payment.status)) {
      return { ready: false as const, message: "This payment is no longer due online." };
    }

    const stripe = await getStripe();
    const currency = (settings.currency ?? "AED").toLowerCase();
    const baseUrl = await getAppBaseUrl();
    const propertyLabel = tenancy.properties
      ? `${tenancy.properties.title} · ${tenancy.properties.community}`
      : "Rent payment";

    const successUrl = data.success_url ?? `${baseUrl}/portal?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = data.cancel_url ?? `${baseUrl}/portal?payment=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: payment.id,
      metadata: {
        payment_id: payment.id,
        tenant_id: context.userId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: toStripeAmount(Number(payment.amount), currency),
            product_data: {
              name: `${payment.payment_type.replace(/_/g, " ")} — ${settings.agency_name}`,
              description: `${propertyLabel} · due ${payment.due_date}`,
            },
          },
        },
      ],
      payment_intent_data: {
        transfer_data: {
          destination: settings.stripe_account_id,
        },
        metadata: {
          payment_id: payment.id,
          tenant_id: context.userId,
        },
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("payments")
      .update({
        method: "stripe",
        status: "pending",
        stripe_checkout_session_id: session.id,
      })
      .eq("id", payment.id);
    if (updateError) throw new Error(updateError.message);

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return {
      ready: true as const,
      checkout_url: session.url,
      session_id: session.id,
      payment_id: payment.id,
      currency: settings.currency,
    };
  });
