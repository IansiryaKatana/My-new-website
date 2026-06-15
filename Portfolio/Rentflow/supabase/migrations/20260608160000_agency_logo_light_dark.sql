-- Separate logos for light vs dark backgrounds (sidebar, auth panels, public headers)

ALTER TABLE public.agency_settings
  ADD COLUMN IF NOT EXISTS logo_url_dark TEXT;

COMMENT ON COLUMN public.agency_settings.logo_url IS 'Logo for light backgrounds (headers, cards, public pages).';
COMMENT ON COLUMN public.agency_settings.logo_url_dark IS 'Logo for dark backgrounds (sidebar, auth hero, dark sections).';

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
  currency
FROM public.agency_settings;

GRANT SELECT ON public.agency_branding TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
