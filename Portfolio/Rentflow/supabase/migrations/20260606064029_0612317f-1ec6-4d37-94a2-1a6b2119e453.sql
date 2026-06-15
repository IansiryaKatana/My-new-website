
REVOKE EXECUTE ON FUNCTION public.get_dashboard_overview() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_rental_funnel() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_action_queue() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_payment_summary() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_listing_analytics() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_tenant_journey(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_tenant_home() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_payment_schedule(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_owner() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_staff(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC;
