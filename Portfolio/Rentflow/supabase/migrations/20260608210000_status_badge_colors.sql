-- ERP/CRM semantic status badge colors (editable via branding settings)

ALTER TABLE public.agency_settings
  ADD COLUMN IF NOT EXISTS color_status_success TEXT NOT NULL DEFAULT '#059669',
  ADD COLUMN IF NOT EXISTS color_status_warning TEXT NOT NULL DEFAULT '#D97706',
  ADD COLUMN IF NOT EXISTS color_status_info TEXT NOT NULL DEFAULT '#2563EB',
  ADD COLUMN IF NOT EXISTS color_status_danger TEXT NOT NULL DEFAULT '#DC2626',
  ADD COLUMN IF NOT EXISTS color_status_neutral TEXT NOT NULL DEFAULT '#64748B';

COMMENT ON COLUMN public.agency_settings.color_status_success IS 'Approved, paid, active, completed, resolved';
COMMENT ON COLUMN public.agency_settings.color_status_warning IS 'Pending, scheduled, awaiting, notice';
COMMENT ON COLUMN public.agency_settings.color_status_info IS 'In progress, open, submitted, upcoming';
COMMENT ON COLUMN public.agency_settings.color_status_danger IS 'Rejected, bounced, cancelled, urgent';
COMMENT ON COLUMN public.agency_settings.color_status_neutral IS 'Draft, closed, ended, withdrawn';

DROP VIEW IF EXISTS public.agency_branding;

CREATE OR REPLACE VIEW public.agency_branding
WITH (security_invoker = true) AS
SELECT
  id,
  agency_name,
  logo_url,
  logo_url_dark,
  favicon_url,
  brand_color,
  color_prussian,
  color_charcoal,
  color_mint_cream,
  color_royal_gold,
  color_watermelon,
  color_status_success,
  color_status_warning,
  color_status_info,
  color_status_danger,
  color_status_neutral,
  currency
FROM public.agency_settings;

GRANT SELECT ON public.agency_branding TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
