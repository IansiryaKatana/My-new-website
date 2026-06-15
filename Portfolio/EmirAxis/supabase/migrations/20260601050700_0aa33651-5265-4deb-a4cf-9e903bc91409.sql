
CREATE TYPE public.leave_type AS ENUM ('annual','sick','unpaid','emergency','maternity','paternity','other');
CREATE TYPE public.leave_status AS ENUM ('pending','approved','rejected','cancelled');
CREATE TYPE public.payslip_status AS ENUM ('draft','issued','paid');

-- LEAVE REQUESTS
CREATE TABLE public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  leave_type public.leave_type NOT NULL DEFAULT 'annual',
  start_date date NOT NULL,
  end_date date NOT NULL,
  days numeric(5,1) NOT NULL DEFAULT 1,
  reason text,
  status public.leave_status NOT NULL DEFAULT 'pending',
  decided_by uuid,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT ALL ON public.leave_requests TO service_role;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY lr_select_self ON public.leave_requests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = leave_requests.worker_id AND w.user_id = auth.uid()));
CREATE POLICY lr_select_staff ON public.leave_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY lr_insert_self ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workers w WHERE w.id = leave_requests.worker_id AND w.user_id = auth.uid())
    AND status = 'pending'
  );
CREATE POLICY lr_insert_staff ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE POLICY lr_update_staff ON public.leave_requests FOR UPDATE TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE POLICY lr_update_self_cancel ON public.leave_requests FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workers w WHERE w.id = leave_requests.worker_id AND w.user_id = auth.uid())
    AND status = 'pending'
  );

CREATE TRIGGER trg_lr_updated BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PAYSLIPS
CREATE TABLE public.payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  period_year int NOT NULL,
  period_month int NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  gross numeric(14,2) NOT NULL DEFAULT 0,
  deductions numeric(14,2) NOT NULL DEFAULT 0,
  net numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'AED',
  status public.payslip_status NOT NULL DEFAULT 'draft',
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  pdf_url text,
  issued_at timestamptz,
  paid_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(worker_id, period_year, period_month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payslips TO authenticated;
GRANT ALL ON public.payslips TO service_role;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;

CREATE POLICY ps_select_self ON public.payslips FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workers w WHERE w.id = payslips.worker_id AND w.user_id = auth.uid())
    AND status <> 'draft'
  );
CREATE POLICY ps_select_fin ON public.payslips FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));
CREATE POLICY ps_write_fin ON public.payslips FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE TRIGGER trg_ps_updated BEFORE UPDATE ON public.payslips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  category text NOT NULL DEFAULT 'general',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY nt_select_self ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(),'admin'));
CREATE POLICY nt_insert_staff ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY nt_update_self ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_lr_worker ON public.leave_requests(worker_id);
CREATE INDEX idx_lr_status ON public.leave_requests(status);
CREATE INDEX idx_ps_worker ON public.payslips(worker_id);
CREATE INDEX idx_ps_period ON public.payslips(period_year, period_month);
CREATE INDEX idx_nt_user_unread ON public.notifications(user_id) WHERE read_at IS NULL;

-- Reporting RPC: margin per client over a period (computed from timesheets/placements)
CREATE OR REPLACE FUNCTION public.get_client_margin(_from date, _to date)
RETURNS TABLE(client_id uuid, client_name text, revenue numeric, cost numeric, margin numeric, margin_pct numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT
    c.id, c.legal_name,
    COALESCE(SUM(ts.total_hours * COALESCE(p.bill_rate, 0)), 0) AS revenue,
    COALESCE(SUM(ts.total_hours * COALESCE(p.pay_rate, 0)), 0) AS cost,
    COALESCE(SUM(ts.total_hours * (COALESCE(p.bill_rate, 0) - COALESCE(p.pay_rate, 0))), 0) AS margin,
    CASE
      WHEN COALESCE(SUM(ts.total_hours * COALESCE(p.bill_rate, 0)), 0) = 0 THEN 0
      ELSE ROUND(100.0 * COALESCE(SUM(ts.total_hours * (COALESCE(p.bill_rate,0) - COALESCE(p.pay_rate,0))), 0)
                 / COALESCE(SUM(ts.total_hours * COALESCE(p.bill_rate, 0)), 1), 2)
    END AS margin_pct
  FROM public.clients c
  LEFT JOIN public.placements p ON p.client_id = c.id
  LEFT JOIN public.timesheets ts ON ts.placement_id = p.id
    AND ts.status = 'approved'
    AND ts.period_start >= _from AND ts.period_end <= _to
  GROUP BY c.id, c.legal_name
  ORDER BY margin DESC;
$$;
