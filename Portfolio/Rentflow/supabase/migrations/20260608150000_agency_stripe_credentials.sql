-- Store Stripe platform credentials per agency (white-label / duplicate-deploy workflow)

ALTER TABLE public.agency_settings
  ADD COLUMN IF NOT EXISTS stripe_secret_key TEXT,
  ADD COLUMN IF NOT EXISTS stripe_publishable_key TEXT,
  ADD COLUMN IF NOT EXISTS stripe_webhook_secret TEXT,
  ADD COLUMN IF NOT EXISTS app_url TEXT;

COMMENT ON COLUMN public.agency_settings.stripe_secret_key IS 'Platform Stripe secret key (sk_…). Owner-only via RLS; prefer server reads.';
COMMENT ON COLUMN public.agency_settings.stripe_publishable_key IS 'Stripe publishable key (pk_…) for Checkout / Elements on public sites.';
COMMENT ON COLUMN public.agency_settings.stripe_webhook_secret IS 'Stripe webhook signing secret (whsec_…).';
COMMENT ON COLUMN public.agency_settings.app_url IS 'Public app URL for Connect return URLs and Checkout redirects.';

-- Secrets must not be readable by anon or non-owners via PostgREST
DROP POLICY IF EXISTS "Public can view agency settings" ON public.agency_settings;

CREATE POLICY "Owners view agency settings" ON public.agency_settings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));
