export async function getAppBaseUrlFromSettings(): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("agency_settings").select("app_url").eq("id", 1).maybeSingle();
  const configured = data?.app_url?.replace(/\/$/, "");
  if (configured) return configured;
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:8080";
}
