-- Resend credentials, email/contract templates, generated document tracking

ALTER TABLE public.agency_settings
  ADD COLUMN IF NOT EXISTS resend_api_key TEXT,
  ADD COLUMN IF NOT EXISTS resend_from_email TEXT,
  ADD COLUMN IF NOT EXISTS resend_from_name TEXT,
  ADD COLUMN IF NOT EXISTS resend_reply_to TEXT;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS contract_url TEXT;

CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  body_html TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  provider_id TEXT,
  error_message TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view email templates" ON public.email_templates FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Owners update email templates" ON public.email_templates FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

GRANT SELECT, UPDATE ON public.contract_templates TO authenticated;
GRANT ALL ON public.contract_templates TO service_role;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view contract templates" ON public.contract_templates FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Owners update contract templates" ON public.contract_templates FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

GRANT SELECT, INSERT ON public.email_log TO authenticated;
GRANT ALL ON public.email_log TO service_role;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view email log" ON public.email_log FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Service insert email log" ON public.email_log FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_contract_templates_updated BEFORE UPDATE ON public.contract_templates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agency-documents',
  'agency-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'text/html']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Staff manage agency documents"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'agency-documents' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'agency-documents' AND public.is_staff(auth.uid()));

CREATE POLICY "Tenants read own agency documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'agency-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Default email templates (merge fields: {{agency_name}}, {{tenant_name}}, {{tenant_email}}, {{property_title}}, {{property_community}}, {{offer_amount}}, {{portal_url}}, {{status}}, {{due_date}}, {{amount}}, {{viewing_date}})
INSERT INTO public.email_templates (template_key, name, description, subject, body_html) VALUES
(
  'application_received',
  'Application received',
  'Sent to tenant when they submit an application',
  'We received your application for {{property_title}}',
  '<p>Hi {{tenant_name}},</p><p>Thank you for applying for <strong>{{property_title}}</strong> in {{property_community}}.</p><p>Our team will review your application and documents shortly. Track progress in your <a href="{{portal_url}}">tenant portal</a>.</p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'application_status',
  'Application status update',
  'Sent when application status changes',
  'Application update: {{status}} — {{property_title}}',
  '<p>Hi {{tenant_name}},</p><p>Your application for <strong>{{property_title}}</strong> is now: <strong>{{status}}</strong>.</p><p><a href="{{portal_url}}">View your portal</a></p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'viewing_confirmed',
  'Viewing confirmed',
  'Sent when a viewing is confirmed',
  'Viewing confirmed — {{property_title}} on {{viewing_date}}',
  '<p>Hi {{tenant_name}},</p><p>Your viewing for <strong>{{property_title}}</strong> is confirmed for <strong>{{viewing_date}}</strong>.</p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'contract_sent',
  'Contract sent',
  'Sent with tenancy contract PDF attached',
  'Your tenancy contract — {{property_title}}',
  '<p>Hi {{tenant_name}},</p><p>Please find your tenancy contract for <strong>{{property_title}}</strong> attached.</p><p>Review the terms and upload your signed copy via your <a href="{{portal_url}}">tenant portal</a>, or reply to this email if you have questions.</p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'payment_reminder',
  'Payment reminder',
  'Sent before a payment is due',
  'Payment reminder: {{amount}} due {{due_date}}',
  '<p>Hi {{tenant_name}},</p><p>This is a reminder that <strong>{{amount}}</strong> is due on <strong>{{due_date}}</strong> for {{property_title}}.</p><p><a href="{{portal_url}}">Pay online or upload proof</a></p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'payment_received',
  'Payment received',
  'Sent when a payment is marked paid/cleared',
  'Payment received — {{amount}}',
  '<p>Hi {{tenant_name}},</p><p>We have received your payment of <strong>{{amount}}</strong>. Thank you.</p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'documents_requested',
  'Documents requested',
  'Sent when staff need more documents',
  'Documents needed for your application',
  '<p>Hi {{tenant_name}},</p><p>We need additional documents for your application on <strong>{{property_title}}</strong>. Please upload them in your <a href="{{portal_url}}">tenant portal</a>.</p><p>Regards,<br>{{agency_name}}</p>'
),
(
  'renewal_offered',
  'Renewal offer',
  'Sent when a renewal offer is made',
  'Renewal offer for {{property_title}}',
  '<p>Hi {{tenant_name}},</p><p>We would like to offer you a lease renewal for <strong>{{property_title}}</strong>.</p><p>Please review and respond in your <a href="{{portal_url}}">tenant portal</a>.</p><p>Regards,<br>{{agency_name}}</p>'
)
ON CONFLICT (template_key) DO NOTHING;

INSERT INTO public.contract_templates (slug, name, description, body_html, is_default) VALUES
(
  'tenancy_agreement',
  'Standard tenancy agreement',
  'Default UAE residential tenancy contract template',
  '<h1>Tenancy Agreement</h1>
<p><strong>Agency:</strong> {{agency_name}}<br>
<strong>Legal name:</strong> {{legal_name}}<br>
<strong>RERA:</strong> {{rera_number}}</p>
<p><strong>Tenant:</strong> {{tenant_name}}<br>
<strong>Email:</strong> {{tenant_email}}<br>
<strong>Emirates ID:</strong> {{tenant_emirates_id}}</p>
<p><strong>Property:</strong> {{property_title}}<br>
<strong>Community:</strong> {{property_community}}<br>
<strong>Unit:</strong> {{property_unit}}</p>
<p><strong>Annual rent:</strong> {{offer_amount}}<br>
<strong>Security deposit:</strong> {{security_deposit}}<br>
<strong>Cheques:</strong> {{cheques}}<br>
<strong>Lease start:</strong> {{lease_start}}<br>
<strong>Lease end:</strong> {{lease_end}}</p>
<p>The tenant agrees to pay rent as per the payment schedule issued by the agency. The property shall be used for residential purposes only, in accordance with UAE law and community rules.</p>
<p>Both parties agree to register the tenancy with Ejari where applicable.</p>
<p>Signed for {{agency_name}}: _______________________</p>
<p>Signed by tenant: _______________________</p>
<p>Date: {{today}}</p>',
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

NOTIFY pgrst, 'reload schema';
