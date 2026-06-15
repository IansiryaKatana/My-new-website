-- Extended branding palette + favicon, public branding bucket

ALTER TABLE public.agency_settings
  ADD COLUMN IF NOT EXISTS color_prussian TEXT NOT NULL DEFAULT '#011936',
  ADD COLUMN IF NOT EXISTS color_charcoal TEXT NOT NULL DEFAULT '#465362',
  ADD COLUMN IF NOT EXISTS color_mint_cream TEXT NOT NULL DEFAULT '#F4FFFD',
  ADD COLUMN IF NOT EXISTS color_royal_gold TEXT NOT NULL DEFAULT '#F9DC5C',
  ADD COLUMN IF NOT EXISTS color_watermelon TEXT NOT NULL DEFAULT '#ED254E',
  ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Keep legacy brand_color aligned with accent CTA color
UPDATE public.agency_settings
SET
  color_prussian = COALESCE(color_prussian, '#011936'),
  color_charcoal = COALESCE(color_charcoal, '#465362'),
  color_mint_cream = COALESCE(color_mint_cream, '#F4FFFD'),
  color_royal_gold = COALESCE(color_royal_gold, '#F9DC5C'),
  color_watermelon = COALESCE(color_watermelon, COALESCE(brand_color, '#ED254E')),
  brand_color = COALESCE(brand_color, color_watermelon, '#ED254E')
WHERE id = 1;

DROP VIEW IF EXISTS public.agency_branding;

CREATE OR REPLACE VIEW public.agency_branding
WITH (security_invoker = true) AS
SELECT
  id,
  agency_name,
  logo_url,
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

-- Public branding assets bucket (logo, favicon)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'branding',
  'branding',
  true,
  2097152,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read branding assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'branding');

CREATE POLICY "Staff upload branding assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'branding' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update branding assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'branding' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'branding' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete branding assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'branding' AND public.is_staff(auth.uid()));

NOTIFY pgrst, 'reload schema';
