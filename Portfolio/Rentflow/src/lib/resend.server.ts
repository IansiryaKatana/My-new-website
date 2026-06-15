import { Resend } from "resend";

export type ResendConfig = {
  apiKey: string | null;
  fromEmail: string | null;
  fromName: string | null;
  replyTo: string | null;
};

let resendClientCache: { key: string; client: Resend } | undefined;

export function resetResendClientCache() {
  resendClientCache = undefined;
}

export function maskResendApiKey(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length <= 12) return "••••••••";
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

export async function getResendConfig(): Promise<ResendConfig> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("agency_settings")
    .select("resend_api_key, resend_from_email, resend_from_name, resend_reply_to, contact_email, agency_name")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);

  return {
    apiKey: data?.resend_api_key?.trim() || process.env.RESEND_API_KEY?.trim() || null,
    fromEmail: data?.resend_from_email?.trim() || data?.contact_email?.trim() || null,
    fromName: data?.resend_from_name?.trim() || data?.agency_name?.trim() || null,
    replyTo: data?.resend_reply_to?.trim() || data?.contact_email?.trim() || null,
  };
}

export async function isResendConfigured(): Promise<boolean> {
  const config = await getResendConfig();
  return Boolean(config.apiKey && config.fromEmail);
}

async function getResendClient(): Promise<Resend> {
  const { apiKey } = await getResendConfig();
  if (!apiKey) {
    throw new Error("Resend is not configured. Add your API key in Settings → Communications.");
  }
  if (!resendClientCache || resendClientCache.key !== apiKey) {
    resendClientCache = { key: apiKey, client: new Resend(apiKey) };
  }
  return resendClientCache.client;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  templateKey?: string;
  attachments?: { filename: string; content: Buffer | Uint8Array }[];
  meta?: Record<string, unknown>;
};

export async function sendEmail(input: SendEmailInput): Promise<{ id: string | null }> {
  const config = await getResendConfig();
  if (!config.fromEmail) {
    throw new Error("Resend from email is not configured.");
  }

  const resend = await getResendClient();
  const from = config.fromName ? `${config.fromName} <${config.fromEmail}>` : config.fromEmail;

  const { data, error } = await resend.emails.send({
    from,
    to: input.to,
    replyTo: config.replyTo ?? undefined,
    subject: input.subject,
    html: input.html,
    attachments: input.attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content),
    })),
  });

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("email_log").insert({
    template_key: input.templateKey ?? null,
    to_email: input.to,
    subject: input.subject,
    status: error ? "failed" : "sent",
    provider_id: data?.id ?? null,
    error_message: error?.message ?? null,
    meta: input.meta ?? {},
  });

  if (error) throw new Error(error.message);
  return { id: data?.id ?? null };
}
