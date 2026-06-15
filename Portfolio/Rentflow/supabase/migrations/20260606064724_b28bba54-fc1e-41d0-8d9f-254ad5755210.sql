
-- 1) agency_settings: restrict full row to authenticated staff; expose branding-only public view
DROP POLICY IF EXISTS "Public can view agency settings" ON public.agency_settings;

CREATE POLICY "Staff view agency settings"
  ON public.agency_settings FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE OR REPLACE VIEW public.agency_branding
WITH (security_invoker = true) AS
SELECT id, agency_name, logo_url, brand_color, currency
FROM public.agency_settings;

GRANT SELECT ON public.agency_branding TO anon, authenticated;

-- 2) property-images: restrict storage SELECT to staff (tenants use signed URLs from server)
DROP POLICY IF EXISTS "authed read property images" ON storage.objects;

CREATE POLICY "Staff read property images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'property-images' AND public.is_staff(auth.uid()));

-- 3) renewals: limit tenant UPDATE to non-financial columns via column-level privileges
REVOKE UPDATE ON public.renewals FROM authenticated;
GRANT UPDATE (status, responded_at, notes) ON public.renewals TO authenticated;
GRANT ALL ON public.renewals TO service_role;

-- 4) Revoke public/anon execute on SECURITY DEFINER functions; keep authenticated only where needed
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_owner() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_payment_schedule(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_action_queue() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_dashboard_overview() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_listing_analytics() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_payment_summary() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_rental_funnel() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_tenant_home() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_tenant_journey(uuid) FROM PUBLIC, anon;
