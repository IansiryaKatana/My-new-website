/**
 * Updates agency branding to match the Rentflow color palette.
 * Run: bun scripts/update-branding.ts
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BRAND = {
  agency_name: "Rentflow",
  legal_name: "Rentflow Property Management LLC",
  brand_color: "#ED254E",
  color_prussian: "#011936",
  color_charcoal: "#465362",
  color_mint_cream: "#F4FFFD",
  color_royal_gold: "#F9DC5C",
  color_watermelon: "#ED254E",
  contact_email: "hello@rentflow.ae",
  contact_phone: "+97144332211",
  whatsapp_number: "+971501112233",
  address: "Office 1204, Marina Plaza, Dubai Marina, UAE",
  vat_number: "100123456700003",
  trade_license: "1234567",
  rera_number: "12345",
  ejari_contact: "ejari@rentflow.ae",
  currency: "AED",
};

async function main() {
  const { error } = await supabase.from("agency_settings").update(BRAND).eq("id", 1);
  if (error) throw error;
  console.log("Agency branding updated:", BRAND.agency_name, BRAND.brand_color);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
