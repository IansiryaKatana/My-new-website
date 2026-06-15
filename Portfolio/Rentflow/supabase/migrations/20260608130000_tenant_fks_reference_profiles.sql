-- PostgREST embeds (profiles!*_tenant_id_fkey) require a FK from tenant_id → profiles.
-- These columns previously referenced auth.users, which is not exposed to the API schema cache.

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_tenant_id_fkey;
ALTER TABLE public.applications
  ADD CONSTRAINT applications_tenant_id_fkey
  FOREIGN KEY (tenant_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_agent_id_fkey;
ALTER TABLE public.applications
  ADD CONSTRAINT applications_agent_id_fkey
  FOREIGN KEY (agent_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.tenancies
  DROP CONSTRAINT IF EXISTS tenancies_tenant_id_fkey;
ALTER TABLE public.tenancies
  ADD CONSTRAINT tenancies_tenant_id_fkey
  FOREIGN KEY (tenant_id) REFERENCES public.profiles(id);

ALTER TABLE public.viewings
  DROP CONSTRAINT IF EXISTS viewings_tenant_id_fkey;
ALTER TABLE public.viewings
  ADD CONSTRAINT viewings_tenant_id_fkey
  FOREIGN KEY (tenant_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.viewings
  DROP CONSTRAINT IF EXISTS viewings_agent_id_fkey;
ALTER TABLE public.viewings
  ADD CONSTRAINT viewings_agent_id_fkey
  FOREIGN KEY (agent_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Reload PostgREST schema cache after FK changes
NOTIFY pgrst, 'reload schema';
