import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isValidHexColor } from "@/lib/branding";
import { maskResendApiKey } from "@/lib/resend.server";
import { maskStripeCredential } from "@/lib/stripe.server";

const hexColor = z.string().refine(isValidHexColor, "Invalid hex color (use #RRGGBB)");

export const getAgencySettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("agency_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return data;

    const {
      stripe_secret_key,
      stripe_webhook_secret,
      resend_api_key,
      ...safe
    } = data;

    return {
      ...safe,
      stripe_secret_key_configured: Boolean(stripe_secret_key),
      stripe_webhook_secret_configured: Boolean(stripe_webhook_secret),
      stripe_secret_key_preview: maskStripeCredential(stripe_secret_key),
      stripe_webhook_secret_preview: maskStripeCredential(stripe_webhook_secret),
      resend_api_key_configured: Boolean(resend_api_key),
      resend_api_key_preview: maskResendApiKey(resend_api_key),
    };
  });

export const getPublicBranding = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("agency_branding")
    .select(
      "agency_name, logo_url, logo_url_dark, favicon_url, color_prussian, color_charcoal, color_mint_cream, color_royal_gold, color_watermelon, color_status_success, color_status_warning, color_status_info, color_status_danger, color_status_neutral",
    )
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

const SettingsInput = z.object({
  agency_name: z.string().min(1).max(120),
  legal_name: z.string().max(200).nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().max(40).nullable().optional(),
  whatsapp_number: z.string().max(40).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  vat_number: z.string().max(40).nullable().optional(),
  trade_license: z.string().max(80).nullable().optional(),
  rera_number: z.string().max(80).nullable().optional(),
  ejari_contact: z.string().max(200).nullable().optional(),
  currency: z.string().length(3),
  default_agency_fee_pct: z.number().min(0).max(100),
  default_security_deposit_pct: z.number().min(0).max(100),
});

export const updateAgencySettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SettingsInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("agency_settings").update(data).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const BrandingInput = z.object({
  logo_url: z.string().max(500).nullable().optional(),
  logo_url_dark: z.string().max(500).nullable().optional(),
  favicon_url: z.string().max(500).nullable().optional(),
  color_prussian: hexColor,
  color_charcoal: hexColor,
  color_mint_cream: hexColor,
  color_royal_gold: hexColor,
  color_watermelon: hexColor,
  color_status_success: hexColor,
  color_status_warning: hexColor,
  color_status_info: hexColor,
  color_status_danger: hexColor,
  color_status_neutral: hexColor,
});

export const updateAgencyBranding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => BrandingInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("agency_settings")
      .update({ ...data, brand_color: data.color_watermelon })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

