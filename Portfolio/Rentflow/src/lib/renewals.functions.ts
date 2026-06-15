import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type RenewalListRow = {
  id: string;
  tenancy_id: string;
  current_rent: number;
  proposed_rent: number;
  proposed_cheques: number;
  status: string;
  offered_at: string | null;
  responded_at: string | null;
  notes: string | null;
  created_at: string;
  tenancies: {
    id: string;
    end_date: string;
    properties: { id: string; title: string; community: string } | null;
    profiles: { full_name: string | null; phone: string | null } | null;
  } | null;
};

export const listRenewals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<RenewalListRow[]> => {
    const { data, error } = await context.supabase
      .from("renewals")
      .select("id, tenancy_id, current_rent, proposed_rent, proposed_cheques, status, offered_at, responded_at, notes, created_at, tenancies(id, end_date, properties(id,title,community), profiles!tenancies_tenant_id_fkey(full_name,phone))")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as RenewalListRow[];
  });

export const listExpiringTenancies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("tenancies")
      .select("id, end_date, annual_rent, cheques, tenant_id, properties(id,title,community), profiles!tenancies_tenant_id_fkey(full_name)")
      .eq("status", "active")
      .order("end_date", { ascending: true })
      .limit(60);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const CreateRenewalInput = z.object({
  tenancy_id: z.string().uuid(),
  current_rent: z.number().positive(),
  proposed_rent: z.number().positive(),
  proposed_cheques: z.number().int().min(1).max(12),
  notes: z.string().max(500).nullable().optional(),
});

export const offerRenewal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => CreateRenewalInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase.from("renewals").insert({
      ...data,
      status: "offered",
      offered_at: new Date().toISOString(),
    }).select("id").single();
    if (error) throw new Error(error.message);

    try {
      const { data: tenancy } = await context.supabase
        .from("tenancies")
        .select("tenant_id, properties(title), profiles!tenancies_tenant_id_fkey(full_name, email)")
        .eq("id", data.tenancy_id)
        .single();
      if (tenancy?.tenant_id) {
        const { notifyUser } = await import("@/lib/activity.server");
        await notifyUser({
          user_id: tenancy.tenant_id,
          title: "Renewal offer received",
          body: `Proposed rent: AED ${data.proposed_rent}`,
          entity_type: "renewal",
          entity_id: row.id,
        });

        const tenant = tenancy.profiles as { full_name?: string | null; email?: string | null } | null;
        const property = tenancy.properties as { title?: string | null } | null;
        if (tenant?.email) {
          const { isResendConfigured, sendEmail } = await import("@/lib/resend.server");
          const { mergeTemplate } = await import("@/lib/templates.server");
          if (await isResendConfigured()) {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data: template } = await supabaseAdmin
              .from("email_templates")
              .select("subject, body_html")
              .eq("template_key", "renewal_offered")
              .eq("enabled", true)
              .maybeSingle();
            if (template) {
              const vars = {
                tenant_name: tenant.full_name ?? "Tenant",
                property_title: property?.title ?? "",
                proposed_rent: String(data.proposed_rent),
                proposed_cheques: String(data.proposed_cheques),
                notes: data.notes ?? "",
              };
              await sendEmail({
                to: tenant.email,
                subject: mergeTemplate(template.subject, vars),
                html: mergeTemplate(template.body_html, vars),
                templateKey: "renewal_offered",
                meta: { renewal_id: row.id },
              });
            }
          }
        }
      }
    } catch {
      // notifications are best-effort
    }

    return { id: row.id };
  });

export const respondRenewal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: "accepted" | "declined"; notes?: string | null }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["accepted", "declined"]),
      notes: z.string().max(500).nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("renewals")
      .update({ status: data.status as never, responded_at: new Date().toISOString(), notes: data.notes ?? null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const confirmRenewal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: renewal, error: fetchErr } = await context.supabase
      .from("renewals")
      .select("id, status, tenancy_id, proposed_rent, proposed_cheques, tenancies(end_date, tenant_id)")
      .eq("id", data.id)
      .single();
    if (fetchErr || !renewal) throw new Error(fetchErr?.message ?? "Renewal not found");
    if (renewal.status !== "accepted") throw new Error("Tenant must accept the offer before confirming.");

    const tenancy = renewal.tenancies as { end_date: string; tenant_id: string } | null;
    if (!tenancy) throw new Error("Tenancy not found");

    const end = new Date(tenancy.end_date);
    end.setFullYear(end.getFullYear() + 1);
    const newEndDate = end.toISOString().slice(0, 10);

    const { error: tenancyErr } = await context.supabase.from("tenancies").update({
      annual_rent: renewal.proposed_rent,
      cheques: renewal.proposed_cheques,
      end_date: newEndDate,
    }).eq("id", renewal.tenancy_id);
    if (tenancyErr) throw new Error(tenancyErr.message);

    try {
      const { logActivity } = await import("@/lib/activity.server");
      await logActivity({
        action: "renewal_confirmed",
        entity_type: "renewal",
        entity_id: renewal.id,
        meta: { new_end_date: newEndDate },
      });
      const { notifyUser } = await import("@/lib/activity.server");
      await notifyUser({
        user_id: tenancy.tenant_id,
        title: "Renewal confirmed",
        body: `Your lease has been extended to ${newEndDate}.`,
        entity_type: "renewal",
        entity_id: renewal.id,
      });
    } catch {
      // best-effort
    }

    return { ok: true, new_end_date: newEndDate };
  });
