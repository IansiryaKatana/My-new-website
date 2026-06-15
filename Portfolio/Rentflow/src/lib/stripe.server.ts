import Stripe from "stripe";
import { getRequest } from "@tanstack/react-start/server";

export type StripePlatformConfig = {
  secretKey: string | null;
  webhookSecret: string | null;
  publishableKey: string | null;
  appUrl: string | null;
};

let stripeClientCache: { key: string; client: Stripe } | undefined;

export function resetStripeClientCache() {
  stripeClientCache = undefined;
}

export async function getStripePlatformConfig(): Promise<StripePlatformConfig> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("agency_settings")
    .select("stripe_secret_key, stripe_publishable_key, stripe_webhook_secret, app_url")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return {
    secretKey: data?.stripe_secret_key?.trim() || process.env.STRIPE_SECRET_KEY?.trim() || null,
    webhookSecret: data?.stripe_webhook_secret?.trim() || process.env.STRIPE_WEBHOOK_SECRET?.trim() || null,
    publishableKey: data?.stripe_publishable_key?.trim() || process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() || null,
    appUrl: data?.app_url?.trim() || process.env.APP_URL?.trim() || null,
  };
}

export async function getStripe(): Promise<Stripe> {
  const { secretKey } = await getStripePlatformConfig();
  if (!secretKey) {
    throw new Error(
      "Stripe secret key is not configured. Add it in Settings → Stripe → Platform credentials.",
    );
  }
  if (!stripeClientCache || stripeClientCache.key !== secretKey) {
    stripeClientCache = { key: secretKey, client: new Stripe(secretKey) };
  }
  return stripeClientCache.client;
}

export async function getStripeWebhookSecret(): Promise<string> {
  const { webhookSecret } = await getStripePlatformConfig();
  if (!webhookSecret) {
    throw new Error(
      "Stripe webhook secret is not configured. Add it in Settings → Stripe → Platform credentials.",
    );
  }
  return webhookSecret;
}

export async function isStripeConfigured(): Promise<boolean> {
  const { secretKey } = await getStripePlatformConfig();
  return Boolean(secretKey);
}

export async function getAppBaseUrl(): Promise<string> {
  const { appUrl } = await getStripePlatformConfig();
  const configured = appUrl?.replace(/\/$/, "");
  if (configured) return configured;

  const request = getRequest();
  if (request) {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
  }

  return "http://localhost:8080";
}

export async function syncStripeAccountToDatabase(accountId: string) {
  const stripe = await getStripe();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const account = await stripe.accounts.retrieve(accountId);

  const { error } = await supabaseAdmin
    .from("agency_settings")
    .update({
      stripe_charges_enabled: account.charges_enabled ?? false,
      stripe_payouts_enabled: account.payouts_enabled ?? false,
      stripe_country: account.country ?? "AE",
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  return {
    stripe_account_id: account.id,
    stripe_charges_enabled: account.charges_enabled ?? false,
    stripe_payouts_enabled: account.payouts_enabled ?? false,
    details_submitted: account.details_submitted ?? false,
    stripe_country: account.country ?? "AE",
  };
}

export function toStripeAmount(amount: number, currency: string): number {
  const zeroDecimal = new Set([
    "bif",
    "clp",
    "djf",
    "gnf",
    "jpy",
    "kmf",
    "krw",
    "mga",
    "pyg",
    "rwf",
    "ugx",
    "vnd",
    "vuv",
    "xaf",
    "xof",
    "xpf",
  ]);
  const factor = zeroDecimal.has(currency.toLowerCase()) ? 1 : 100;
  return Math.round(amount * factor);
}

export function maskStripeCredential(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length <= 12) return "••••••••";
  return `${value.slice(0, 7)}…${value.slice(-4)}`;
}
