import type Stripe from "stripe";
import {
  getStripe,
  getStripeWebhookSecret,
  isStripeConfigured,
  syncStripeAccountToDatabase,
} from "@/lib/stripe.server";

async function markPaymentPaid(session: Stripe.Checkout.Session) {
  const paymentId = session.metadata?.payment_id;
  if (!paymentId) return;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const { error } = await supabaseAdmin
    .from("payments")
    .update({
      status: "paid",
      method: "stripe",
      paid_at: new Date().toISOString(),
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      reference: paymentIntentId,
    })
    .eq("id", paymentId);

  if (error) console.error("[stripe webhook] failed to mark payment paid", error.message);
}

export async function handleStripeWebhook(request: Request): Promise<Response> {
  const configured = await isStripeConfigured();
  if (!configured) {
    return new Response("Stripe is not configured", { status: 503 });
  }

  const stripe = await getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, await getStripeWebhookSecret());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    console.error("[stripe webhook]", message);
    return new Response(message, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await markPaymentPaid(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        await markPaymentPaid(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("agency_settings")
          .select("stripe_account_id")
          .eq("stripe_account_id", account.id)
          .maybeSingle();
        if (data?.stripe_account_id) {
          await syncStripeAccountToDatabase(account.id);
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("[stripe webhook] handler error", error);
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
