import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertOwner } from "@/lib/auth.server";
import { mergeTemplate, type TemplateVars } from "@/lib/templates.server";
import { buildPdfFromHtml } from "@/lib/pdf.server";
import { isResendConfigured, maskResendApiKey, resetResendClientCache, sendEmail } from "@/lib/resend.server";
import { getAppBaseUrlFromSettings } from "@/lib/app-url.server";

async function getPortalUrl(): Promise<string> {
  const base = await getAppBaseUrlFromSettings();
  return `${base}/portal`;
}

async function loadAgencyVars(): Promise<TemplateVars> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("agency_settings")
    .select("agency_name, legal_name, rera_number, contact_email, contact_phone, address, currency")
    .eq("id", 1)
    .single();
  return {
    agency_name: data?.agency_name ?? "Agency",
    legal_name: data?.legal_name ?? data?.agency_name ?? "",
    rera_number: data?.rera_number ?? "",
    contact_email: data?.contact_email ?? "",
    contact_phone: data?.contact_phone ?? "",
    agency_address: data?.address ?? "",
    currency: data?.currency ?? "AED",
    portal_url: await getPortalUrl(),
    today: new Date().toLocaleDateString("en-AE", { dateStyle: "long" }),
  };
}

function formatMoney(amount: number | string | null | undefined, currency = "AED") {
  const n = Number(amount ?? 0);
  return `${currency} ${n.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const getCommunicationsSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: agency, error } = await supabaseAdmin
      .from("agency_settings")
      .select("resend_api_key, resend_from_email, resend_from_name, resend_reply_to, contact_email")
      .eq("id", 1)
      .single();
    if (error) throw new Error(error.message);

    const { data: emailTemplates } = await supabaseAdmin
      .from("email_templates")
      .select("id, template_key, name, description, subject, body_html, enabled, updated_at")
      .order("name");

    const { data: contractTemplates } = await supabaseAdmin
      .from("contract_templates")
      .select("id, slug, name, description, body_html, is_default, updated_at")
      .order("name");

    const configured = await isResendConfigured();

    return {
      resend_api_key_configured: Boolean(agency.resend_api_key || process.env.RESEND_API_KEY),
      resend_api_key_preview: maskResendApiKey(agency.resend_api_key),
      resend_from_email: agency.resend_from_email ?? agency.contact_email ?? "",
      resend_from_name: agency.resend_from_name ?? "",
      resend_reply_to: agency.resend_reply_to ?? "",
      resend_configured: configured,
      email_templates: emailTemplates ?? [],
      contract_templates: contractTemplates ?? [],
    };
  });

const ResendCredentialsInput = z.object({
  resend_api_key: z.string().max(255).optional(),
  resend_from_email: z.string().email().nullable().optional(),
  resend_from_name: z.string().max(120).nullable().optional(),
  resend_reply_to: z.string().email().nullable().optional(),
});

export const updateResendCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ResendCredentialsInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: current, error: readError } = await supabaseAdmin
      .from("agency_settings")
      .select("resend_api_key")
      .eq("id", 1)
      .single();
    if (readError) throw new Error(readError.message);

    const patch: Record<string, string | null> = {};
    if (data.resend_api_key !== undefined && data.resend_api_key.trim()) {
      patch.resend_api_key = data.resend_api_key.trim();
    }
    if (data.resend_from_email !== undefined) patch.resend_from_email = data.resend_from_email?.trim() || null;
    if (data.resend_from_name !== undefined) patch.resend_from_name = data.resend_from_name?.trim() || null;
    if (data.resend_reply_to !== undefined) patch.resend_reply_to = data.resend_reply_to?.trim() || null;

    if (Object.keys(patch).length === 0) return { ok: true as const };

    const { error } = await supabaseAdmin.from("agency_settings").update(patch).eq("id", 1);
    if (error) throw new Error(error.message);
    resetResendClientCache();
    return { ok: true as const, resend_api_key_configured: Boolean(patch.resend_api_key ?? current.resend_api_key) };
  });

const EmailTemplateInput = z.object({
  id: z.string().uuid(),
  subject: z.string().min(1).max(300),
  body_html: z.string().min(1).max(50000),
  enabled: z.boolean(),
});

export const updateEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => EmailTemplateInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("email_templates")
      .update({ subject: data.subject, body_html: data.body_html, enabled: data.enabled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const ContractTemplateInput = z.object({
  id: z.string().uuid(),
  body_html: z.string().min(1).max(100000),
  name: z.string().min(1).max(200).optional(),
});

export const updateContractTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ContractTemplateInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { body_html: string; name?: string } = { body_html: data.body_html };
    if (data.name) patch.name = data.name;
    const { error } = await supabaseAdmin.from("contract_templates").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ to: z.string().email() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const agency = await loadAgencyVars();
    const html = mergeTemplate(
      `<p>This is a test email from <strong>{{agency_name}}</strong>.</p><p>Your Resend integration is working.</p>`,
      agency,
    );
    await sendEmail({
      to: data.to,
      subject: `Test email from ${agency.agency_name}`,
      html,
      templateKey: "test",
      meta: { test: true },
    });
    return { ok: true };
  });

async function getEmailTemplate(templateKey: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("email_templates")
    .select("*")
    .eq("template_key", templateKey)
    .eq("enabled", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function getDefaultContractTemplate() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("contract_templates")
    .select("*")
    .eq("is_default", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data;
  const { data: fallback } = await supabaseAdmin.from("contract_templates").select("*").limit(1).maybeSingle();
  return fallback;
}

async function buildApplicationVars(applicationId: string): Promise<TemplateVars> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: app, error } = await supabaseAdmin
    .from("applications")
    .select(
      "*, properties(title, community, building, unit_no, rent_yearly), profiles!applications_tenant_id_fkey(full_name, email, emirates_id)",
    )
    .eq("id", applicationId)
    .single();
  if (error || !app) throw new Error("Application not found");

  const property = app.properties as {
    title: string;
    community: string;
    building: string | null;
    unit_no: string | null;
    rent_yearly: number;
  } | null;
  const tenant = app.profiles as { full_name: string | null; email: string | null; emirates_id: string | null } | null;
  const agency = await loadAgencyVars();

  return {
    ...agency,
    tenant_name: tenant?.full_name ?? "Tenant",
    tenant_email: tenant?.email ?? "",
    tenant_emirates_id: tenant?.emirates_id ?? "",
    property_title: property?.title ?? "",
    property_community: property?.community ?? "",
    property_unit: [property?.building, property?.unit_no].filter(Boolean).join(" · "),
    offer_amount: formatMoney(app.offer_amount, String(agency.currency)),
    security_deposit: formatMoney(Number(app.offer_amount) * 0.05, String(agency.currency)),
    cheques: String(app.cheques_offered),
    lease_start: app.move_in_date ?? "",
    lease_end: "",
    status: String(app.status).replace(/_/g, " "),
  };
}

export async function sendTemplatedEmailForApplication(
  templateKey: string,
  applicationId: string,
  extraVars?: Record<string, string>,
) {
  if (!(await isResendConfigured())) return { sent: false as const, message: "Resend is not configured." };

  const template = await getEmailTemplate(templateKey);
  if (!template) return { sent: false as const, message: "Template not found or disabled." };

  let vars: TemplateVars = await loadAgencyVars();
  vars = { ...vars, ...(await buildApplicationVars(applicationId)), ...extraVars };

  const to = String(vars.tenant_email ?? "");
  if (!to) return { sent: false as const, message: "No tenant email." };

  await sendEmail({
    to,
    subject: mergeTemplate(template.subject, vars),
    html: mergeTemplate(template.body_html, vars),
    templateKey: template.template_key,
    meta: { application_id: applicationId },
  });

  return { sent: true as const };
}

export const sendTemplatedEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        template_key: z.string().min(1),
        to: z.string().email().optional(),
        application_id: z.string().uuid().optional(),
        extra_vars: z.record(z.string()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (!(await isResendConfigured())) {
      return { sent: false as const, message: "Resend is not configured." };
    }

    const template = await getEmailTemplate(data.template_key);
    if (!template) return { sent: false as const, message: "Template not found or disabled." };

    let vars: TemplateVars = await loadAgencyVars();
    if (data.application_id) {
      vars = { ...vars, ...(await buildApplicationVars(data.application_id)) };
    }
    if (data.extra_vars) vars = { ...vars, ...data.extra_vars };

    const to = data.to ?? String(vars.tenant_email ?? "");
    if (!to) throw new Error("No recipient email address.");

    await sendEmail({
      to,
      subject: mergeTemplate(template.subject, vars),
      html: mergeTemplate(template.body_html, vars),
      templateKey: template.template_key,
      meta: { application_id: data.application_id },
    });

    return { sent: true as const };
  });

async function generateAndStoreContractPdf(applicationId: string, contractTemplateId?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  let template = null;
  if (contractTemplateId) {
    const { data: t } = await supabaseAdmin.from("contract_templates").select("*").eq("id", contractTemplateId).single();
    template = t;
  } else {
    template = await getDefaultContractTemplate();
  }
  if (!template) throw new Error("No contract template found.");

  const vars = await buildApplicationVars(applicationId);
  const html = mergeTemplate(template.body_html, vars);
  const pdfBytes = await buildPdfFromHtml(`${template.name} — ${vars.property_title}`, html);

  const { data: app } = await supabaseAdmin.from("applications").select("tenant_id").eq("id", applicationId).single();
  const tenantId = app?.tenant_id;
  if (!tenantId) throw new Error("Application tenant not found.");

  const path = `${tenantId}/contracts/${applicationId}/${Date.now()}_tenancy_agreement.pdf`;
  const { error: uploadError } = await supabaseAdmin.storage.from("agency-documents").upload(path, pdfBytes, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (uploadError) throw new Error(uploadError.message);

  await supabaseAdmin.from("applications").update({ contract_url: path }).eq("id", applicationId);

  return { path, html, pdfBytes, vars, templateName: template.name };
}

export const generateApplicationContractPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ application_id: z.string().uuid(), contract_template_id: z.string().uuid().optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const result = await generateAndStoreContractPdf(data.application_id, data.contract_template_id);
    return {
      ok: true,
      storage_path: result.path,
      html_preview: result.html,
    };
  });

export const sendApplicationContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ application_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const result = await generateAndStoreContractPdf(data.application_id);

    if (!(await isResendConfigured())) {
      return {
        ok: true,
        storage_path: result.path,
        emailed: false as const,
        message: "Contract PDF generated. Configure Resend to email the tenant.",
      };
    }

    const emailTemplate = await getEmailTemplate("contract_sent");
    if (!emailTemplate) throw new Error("contract_sent email template is missing or disabled.");

    await sendEmail({
      to: String(result.vars.tenant_email),
      subject: mergeTemplate(emailTemplate.subject, result.vars),
      html: mergeTemplate(emailTemplate.body_html, result.vars),
      templateKey: "contract_sent",
      attachments: [{ filename: "tenancy-agreement.pdf", content: result.pdfBytes }],
      meta: { application_id: data.application_id },
    });

    await context.supabase
      .from("applications")
      .update({ status: "contract_sent" as never })
      .eq("id", data.application_id);

    return { ok: true, storage_path: result.path, emailed: true as const };
  });

export const downloadApplicationContractPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ application_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const vars = await buildApplicationVars(data.application_id);
    const template = await getDefaultContractTemplate();
    if (!template) throw new Error("No contract template.");
    const html = mergeTemplate(template.body_html, vars);
    const pdfBytes = await buildPdfFromHtml(`${template.name}`, html);
    const base64 = Buffer.from(pdfBytes).toString("base64");
    return {
      filename: `contract-${data.application_id.slice(0, 8)}.pdf`,
      content_base64: base64,
      content_type: "application/pdf",
    };
  });

export const downloadApplicationSummaryPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ application_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const vars = await buildApplicationVars(data.application_id);
    const html = `<h1>Application Summary</h1>
<p><strong>Tenant:</strong> {{tenant_name}} ({{tenant_email}})</p>
<p><strong>Property:</strong> {{property_title}}, {{property_community}}</p>
<p><strong>Offer:</strong> {{offer_amount}} · {{cheques}} cheques</p>
<p><strong>Status:</strong> {{status}}</p>
<p><strong>Move-in:</strong> {{lease_start}}</p>
<p>Generated by {{agency_name}} on {{today}}</p>`;
    const merged = mergeTemplate(html, vars);
    const pdfBytes = await buildPdfFromHtml("Application Summary", merged);
    return {
      filename: `application-${data.application_id.slice(0, 8)}.pdf`,
      content_base64: Buffer.from(pdfBytes).toString("base64"),
      content_type: "application/pdf",
    };
  });

export const downloadPaymentReceiptPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ payment_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: payment, error } = await context.supabase
      .from("payments")
      .select("id, amount, due_date, paid_at, status, payment_type, method, reference, tenancies(properties(title, community), profiles!tenancies_tenant_id_fkey(full_name, email))")
      .eq("id", data.payment_id)
      .single();
    if (error) throw new Error(error.message);

    const agency = await loadAgencyVars();
    const tenancy = payment.tenancies as {
      properties: { title: string; community: string } | null;
      profiles: { full_name: string | null; email: string | null } | null;
    } | null;

    const vars: TemplateVars = {
      ...agency,
      tenant_name: tenancy?.profiles?.full_name ?? "",
      tenant_email: tenancy?.profiles?.email ?? "",
      property_title: tenancy?.properties?.title ?? "",
      property_community: tenancy?.properties?.community ?? "",
      amount: formatMoney(payment.amount, String(agency.currency)),
      due_date: payment.due_date,
      status: payment.status,
      payment_type: String(payment.payment_type).replace(/_/g, " "),
      payment_method: payment.method ?? "",
      reference: payment.reference ?? payment.id.slice(0, 8),
      paid_at: payment.paid_at ? new Date(payment.paid_at).toLocaleDateString("en-AE") : "",
    };

    const html = `<h1>Payment Receipt</h1>
<p><strong>{{agency_name}}</strong></p>
<p>Receipt for {{tenant_name}} — {{property_title}}</p>
<p><strong>Amount:</strong> {{amount}}<br>
<strong>Type:</strong> {{payment_type}}<br>
<strong>Due date:</strong> {{due_date}}<br>
<strong>Status:</strong> {{status}}<br>
<strong>Method:</strong> {{payment_method}}<br>
<strong>Reference:</strong> {{reference}}<br>
<strong>Paid at:</strong> {{paid_at}}</p>
<p>Issued {{today}}</p>`;

    const pdfBytes = await buildPdfFromHtml("Payment Receipt", mergeTemplate(html, vars));
    return {
      filename: `receipt-${data.payment_id.slice(0, 8)}.pdf`,
      content_base64: Buffer.from(pdfBytes).toString("base64"),
      content_type: "application/pdf",
    };
  });

export const getTenantApplicationContractUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ application_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("applications")
      .select("contract_url, tenant_id")
      .eq("id", data.application_id)
      .single();
    if (error) throw new Error(error.message);
    if (app.tenant_id !== context.userId) throw new Error("Forbidden");
    if (!app.contract_url) return { url: null as string | null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("agency-documents")
      .createSignedUrl(app.contract_url, 300);
    if (signError) throw new Error(signError.message);
    return { url: signed.signedUrl };
  });

export const uploadTenantSignedContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ application_id: z.string().uuid(), storage_path: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("applications")
      .update({ contract_url: data.storage_path })
      .eq("id", data.application_id)
      .eq("tenant_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
