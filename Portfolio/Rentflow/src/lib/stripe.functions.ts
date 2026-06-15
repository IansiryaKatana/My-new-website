import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertOwner } from "@/lib/auth.server";
import {
  getAppBaseUrl,
  getStripe,
  getStripePlatformConfig,
  isStripeConfigured,
  resetStripeClientCache,
  syncStripeAccountToDatabase,
} from "@/lib/stripe.server";

export const getPublicPaymentsConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("agency_settings")
    .select("stripe_charges_enabled, stripe_account_id, currency, stripe_publishable_key")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);

  const platform = await getStripePlatformConfig();
  const online =
    Boolean(platform.secretKey) && Boolean(data?.stripe_account_id) && Boolean(data?.stripe_charges_enabled);

  return {
    online_payments_enabled: online,
    currency: data?.currency ?? "AED",
    publishable_key: platform.publishableKey,
  };
});

const StripeCredentialsInput = z.object({
  stripe_secret_key: z.string().max(255).optional(),
  stripe_publishable_key: z.string().max(255).nullable().optional(),
  stripe_webhook_secret: z.string().max(255).optional(),
  app_url: z.string().url().max(500).nullable().optional(),
  stripe_country: z.string().length(2).optional(),
});

export const updateStripeCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => StripeCredentialsInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: current, error: readError } = await supabaseAdmin
      .from("agency_settings")
      .select("stripe_secret_key, stripe_publishable_key, stripe_webhook_secret, app_url, stripe_country")
      .eq("id", 1)
      .single();
    if (readError) throw new Error(readError.message);

    const patch: Record<string, string | null> = {};

    if (data.stripe_secret_key !== undefined && data.stripe_secret_key.trim()) {
      patch.stripe_secret_key = data.stripe_secret_key.trim();
    }
    if (data.stripe_publishable_key !== undefined) {
      patch.stripe_publishable_key = data.stripe_publishable_key?.trim() || null;
    }
    if (data.stripe_webhook_secret !== undefined && data.stripe_webhook_secret.trim()) {
      patch.stripe_webhook_secret = data.stripe_webhook_secret.trim();
    }
    if (data.app_url !== undefined) {
      patch.app_url = data.app_url?.trim().replace(/\/$/, "") || null;
    }
    if (data.stripe_country !== undefined) {
      patch.stripe_country = data.stripe_country.toUpperCase();
    }

    if (Object.keys(patch).length === 0) {
      return { ok: true as const, unchanged: true as const };
    }

    const { error } = await supabaseAdmin.from("agency_settings").update(patch).eq("id", 1);
    if (error) throw new Error(error.message);

    resetStripeClientCache();

    return {
      ok: true as const,
      stripe_secret_key_configured: Boolean(patch.stripe_secret_key ?? current.stripe_secret_key),
      stripe_webhook_secret_configured: Boolean(patch.stripe_webhook_secret ?? current.stripe_webhook_secret),
      stripe_publishable_key: patch.stripe_publishable_key ?? current.stripe_publishable_key,
      app_url: patch.app_url ?? current.app_url,
      stripe_country: patch.stripe_country ?? current.stripe_country,
    };
  });

export const beginStripeConnectOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context.supabase, context.userId);
    const stripe = await getStripe();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("agency_settings")
      .select("stripe_account_id, stripe_country, contact_email")
      .eq("id", 1)
      .single();
    if (settingsError) throw new Error(settingsError.message);

    let accountId = settings.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: settings.stripe_country ?? "AE",
        email: settings.contact_email ?? undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;

      const { error: updateError } = await supabaseAdmin
        .from("agency_settings")
        .update({
          stripe_account_id: accountId,
          stripe_country: account.country ?? settings.stripe_country ?? "AE",
        })
        .eq("id", 1);
      if (updateError) throw new Error(updateError.message);
    }

    const baseUrl = await getAppBaseUrl();
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/settings?stripe=refresh`,
      return_url: `${baseUrl}/settings?stripe=return`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  });

export const createStripeDashboardLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context.supabase, context.userId);
    const stripe = await getStripe();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: settings, error } = await supabaseAdmin
      .from("agency_settings")
      .select("stripe_account_id")
      .eq("id", 1)
      .single();
    if (error) throw new Error(error.message);
    if (!settings.stripe_account_id) {
      throw new Error("Connect Stripe before opening the dashboard.");
    }

    const baseUrl = await getAppBaseUrl();
    const link = await stripe.accountLinks.create({
      account: settings.stripe_account_id,
      refresh_url: `${baseUrl}/settings?stripe=refresh`,
      return_url: `${baseUrl}/settings?stripe=return`,
      type: "account_onboarding",
    });

    return { url: link.url };
  });

export const refreshStripeConnectStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: settings, error } = await supabaseAdmin
      .from("agency_settings")
      .select("stripe_account_id")
      .eq("id", 1)
      .single();
    if (error) throw new Error(error.message);
    if (!settings.stripe_account_id) {
      return {
        connected: false as const,
        stripe_account_id: null,
        stripe_charges_enabled: false,
        stripe_payouts_enabled: false,
        details_submitted: false,
      };
    }

    const status = await syncStripeAccountToDatabase(settings.stripe_account_id);
    return { connected: true as const, ...status };
  });
