-- Break workers <-> placements RLS recursion (causes REST 500 on SELECT/HEAD).
-- Replace cross-table policy subqueries with SECURITY DEFINER helpers.

CREATE OR REPLACE FUNCTION public.is_own_worker(_worker_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workers WHERE id = _worker_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.worker_belongs_to_my_client(_worker_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.placements p
    INNER JOIN public.profiles pr ON pr.id = auth.uid() AND pr.client_id IS NOT NULL
    WHERE p.worker_id = _worker_id AND p.client_id = pr.client_id
  );
$$;

CREATE OR REPLACE FUNCTION public.placement_belongs_to_my_client(_placement_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.placements p
    INNER JOIN public.profiles pr ON pr.id = auth.uid() AND pr.client_id IS NOT NULL
    WHERE p.id = _placement_id AND p.client_id = pr.client_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_own_worker(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.worker_belongs_to_my_client(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.placement_belongs_to_my_client(uuid) TO authenticated;

-- Workers
DROP POLICY IF EXISTS workers_select_client ON public.workers;
CREATE POLICY workers_select_client ON public.workers FOR SELECT TO authenticated
  USING (public.worker_belongs_to_my_client(id));

-- Placements
DROP POLICY IF EXISTS pl_select_self ON public.placements;
CREATE POLICY pl_select_self ON public.placements FOR SELECT TO authenticated
  USING (public.is_own_worker(worker_id));

-- Timesheets (portal)
DROP POLICY IF EXISTS ts_select_portal ON public.timesheets;
CREATE POLICY ts_select_portal ON public.timesheets FOR SELECT TO authenticated
  USING (public.placement_belongs_to_my_client(placement_id));

DROP POLICY IF EXISTS ts_update_portal ON public.timesheets;
CREATE POLICY ts_update_portal ON public.timesheets FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'client')
    AND public.placement_belongs_to_my_client(placement_id)
  )
  WITH CHECK (status IN ('approved', 'rejected'));

-- Timesheets (self)
DROP POLICY IF EXISTS ts_select_self ON public.timesheets;
CREATE POLICY ts_select_self ON public.timesheets FOR SELECT TO authenticated
  USING (public.is_own_worker(worker_id));

-- Leave requests
DROP POLICY IF EXISTS lr_select_self ON public.leave_requests;
CREATE POLICY lr_select_self ON public.leave_requests FOR SELECT TO authenticated
  USING (public.is_own_worker(worker_id));

DROP POLICY IF EXISTS lr_insert_self ON public.leave_requests;
CREATE POLICY lr_insert_self ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (public.is_own_worker(worker_id) AND status = 'pending');

DROP POLICY IF EXISTS lr_update_self_cancel ON public.leave_requests;
CREATE POLICY lr_update_self_cancel ON public.leave_requests FOR UPDATE TO authenticated
  USING (public.is_own_worker(worker_id) AND status = 'pending');

-- Issues
DROP POLICY IF EXISTS iss_select_self ON public.issues;
CREATE POLICY iss_select_self ON public.issues FOR SELECT TO authenticated
  USING (worker_id IS NOT NULL AND public.is_own_worker(worker_id));

DROP POLICY IF EXISTS iss_insert_self ON public.issues;
CREATE POLICY iss_insert_self ON public.issues FOR INSERT TO authenticated
  WITH CHECK (worker_id IS NOT NULL AND public.is_own_worker(worker_id));

-- Issue comments
DROP POLICY IF EXISTS ic_select ON public.issue_comments;
CREATE POLICY ic_select ON public.issue_comments FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'accountant')
    OR EXISTS (
      SELECT 1 FROM public.issues i
      WHERE i.id = issue_comments.issue_id AND i.worker_id IS NOT NULL AND public.is_own_worker(i.worker_id)
    )
  );

DROP POLICY IF EXISTS ic_insert ON public.issue_comments;
CREATE POLICY ic_insert ON public.issue_comments FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND (
      has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'recruiter')
      OR EXISTS (
        SELECT 1 FROM public.issues i
        WHERE i.id = issue_comments.issue_id AND i.worker_id IS NOT NULL AND public.is_own_worker(i.worker_id)
      )
    )
  );

-- Payslips self
DROP POLICY IF EXISTS ps_select_self ON public.payslips;
CREATE POLICY ps_select_self ON public.payslips FOR SELECT TO authenticated
  USING (public.is_own_worker(worker_id));

-- Attendance self
DROP POLICY IF EXISTS att_select_self ON public.attendance;
CREATE POLICY att_select_self ON public.attendance FOR SELECT TO authenticated
  USING (public.is_own_worker(worker_id));

-- Branding: point to bundled SVG assets (PNG paths 404 in repo)
UPDATE public.branding_settings
SET
  logo_url = '/assets/emiraxis-logo.svg',
  logo_dark_url = '/assets/emiraxis-logo-white.svg',
  favicon_url = '/assets/emiraxis-favicon.svg'
WHERE singleton = true;
