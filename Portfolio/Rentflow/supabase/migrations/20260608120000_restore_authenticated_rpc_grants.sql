-- Restore EXECUTE for RPCs invoked by authenticated users through TanStack Start server
-- functions (user JWT → authenticated role). Migration 20260606064724 revoked these
-- from authenticated, which breaks bootstrap_first_owner and payment schedule generation.

GRANT EXECUTE ON FUNCTION public.bootstrap_first_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_payment_schedule(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_rental_funnel() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_action_queue() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_payment_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_listing_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tenant_home() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_tenant_journey(uuid) TO authenticated;
