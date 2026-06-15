/** Replace {{var}} placeholders in template body */
export function fillTemplate(body: string, vars: Record<string, string>) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

/** E.164-ish: digits only for wa.me */
export function normalizePhoneForWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "971" + digits.slice(1);
  if (!digits.startsWith("971") && digits.length <= 10) return "971" + digits;
  return digits;
}

export function whatsAppClickUrl(phone: string, message: string) {
  const to = normalizePhoneForWhatsApp(phone);
  return `https://wa.me/${to}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string) {
  window.open(whatsAppClickUrl(phone, message), "_blank", "noopener,noreferrer");
}

type WhatsAppApiConfig = {
  phoneNumberId: string;
  accessToken: string;
};

export function getWhatsAppConfig(): WhatsAppApiConfig | null {
  const phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID as string | undefined;
  const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN as string | undefined;
  if (!phoneNumberId || !accessToken) return null;
  return { phoneNumberId, accessToken };
}

/** Meta WhatsApp Cloud API — requires VITE_WHATSAPP_* env vars */
export async function sendWhatsAppCloudMessage(toPhone: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const cfg = getWhatsAppConfig();
  if (!cfg) {
    openWhatsApp(toPhone, body);
    return { ok: true };
  }
  const to = normalizePhoneForWhatsApp(toPhone);
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
