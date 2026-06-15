
-- PRD completion: lifecycle RPCs, payroll engine, portals, compliance alerts, audit

-- Portal scoping on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES public.recruitment_agents(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_client ON public.profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_profiles_agent ON public.profiles(agent_id);

-- =====================================================
-- PAYROLL ENGINE
-- =====================================================
CREATE TYPE public.payroll_run_status AS ENUM ('draft','review','approved','exported','closed');

CREATE TABLE public.payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_year int NOT NULL,
  period_month int NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  status public.payroll_run_status NOT NULL DEFAULT 'draft',
  total_gross numeric(14,2) NOT NULL DEFAULT 0,
  total_deductions numeric(14,2) NOT NULL DEFAULT 0,
  total_net numeric(14,2) NOT NULL DEFAULT 0,
  worker_count int NOT NULL DEFAULT 0,
  sif_content text,
  sif_exported_at timestamptz,
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  notes text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_year, period_month)
);

CREATE TABLE public.payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id uuid NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  base_salary numeric(12,2) NOT NULL DEFAULT 0,
  housing_allowance numeric(12,2) NOT NULL DEFAULT 0,
  transport_allowance numeric(12,2) NOT NULL DEFAULT 0,
  other_allowance numeric(12,2) NOT NULL DEFAULT 0,
  overtime_amount numeric(12,2) NOT NULL DEFAULT 0,
  gross numeric(14,2) NOT NULL DEFAULT 0,
  deductions numeric(14,2) NOT NULL DEFAULT 0,
  net numeric(14,2) NOT NULL DEFAULT 0,
  hours_worked numeric(8,2) NOT NULL DEFAULT 0,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (payroll_run_id, worker_id)
);

CREATE TYPE public.advance_status AS ENUM ('pending','approved','paid','rejected','deducted');
CREATE TABLE public.salary_advances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  reason text,
  status public.advance_status NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  deducted_in_payroll_id uuid REFERENCES public.payroll_runs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE public.deduction_type AS ENUM ('advance','loan','absence','late','uniform','accommodation','sim','penalty','other');
CREATE TABLE public.worker_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  deduction_type public.deduction_type NOT NULL DEFAULT 'other',
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  description text,
  period_year int,
  period_month int,
  applied_in_payroll_id uuid REFERENCES public.payroll_runs(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_advances TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_deductions TO authenticated;
GRANT ALL ON public.payroll_runs, public.payroll_items, public.salary_advances, public.worker_deductions TO service_role;

ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_deductions ENABLE ROW LEVEL SECURITY;

CREATE POLICY pr_run_fin ON public.payroll_runs FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE POLICY pr_item_fin ON public.payroll_items FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE POLICY sa_select ON public.salary_advances FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant')
    OR EXISTS (SELECT 1 FROM workers w WHERE w.id = salary_advances.worker_id AND w.user_id = auth.uid())
  );
CREATE POLICY sa_insert_self ON public.salary_advances FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM workers w WHERE w.id = salary_advances.worker_id AND w.user_id = auth.uid()));
CREATE POLICY sa_write_fin ON public.salary_advances FOR UPDATE TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE POLICY wd_fin ON public.worker_deductions FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE TRIGGER trg_payroll_runs_updated BEFORE UPDATE ON public.payroll_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_salary_advances_updated BEFORE UPDATE ON public.salary_advances
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync job order filled_count from active placements
CREATE OR REPLACE FUNCTION public.sync_job_order_filled_count(_job_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_qty int;
  v_filled int;
  v_status public.job_order_status;
BEGIN
  IF _job_order_id IS NULL THEN RETURN; END IF;
  SELECT quantity INTO v_qty FROM job_orders WHERE id = _job_order_id;
  SELECT COUNT(*)::int INTO v_filled FROM placements
    WHERE job_order_id = _job_order_id AND status IN ('confirmed','active');
  IF v_filled IS NULL THEN v_filled := 0; END IF;
  IF v_filled >= COALESCE(v_qty, 1) THEN
    v_status := 'filled';
  ELSIF v_filled > 0 THEN
    v_status := 'partially_filled';
  ELSE
    SELECT status INTO v_status FROM job_orders WHERE id = _job_order_id;
    IF v_status IN ('filled','partially_filled') THEN v_status := 'in_progress'; END IF;
  END IF;
  UPDATE job_orders SET filled_count = v_filled, status = v_status, updated_at = now()
  WHERE id = _job_order_id;
END $$;

CREATE OR REPLACE FUNCTION public.trg_placement_sync_job_order()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM sync_job_order_filled_count(OLD.job_order_id);
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.job_order_id IS DISTINCT FROM NEW.job_order_id THEN
    PERFORM sync_job_order_filled_count(OLD.job_order_id);
  END IF;
  PERFORM sync_job_order_filled_count(NEW.job_order_id);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_placement_sync_jo ON public.placements;
CREATE TRIGGER trg_placement_sync_jo
  AFTER INSERT OR UPDATE OR DELETE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.trg_placement_sync_job_order();

-- Convert candidate to worker
CREATE OR REPLACE FUNCTION public.convert_candidate_to_worker(_candidate_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c record;
  w_id uuid;
BEGIN
  IF NOT (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  SELECT * INTO c FROM candidates WHERE id = _candidate_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Candidate not found'; END IF;
  IF EXISTS (SELECT 1 FROM workers WHERE candidate_id = _candidate_id) THEN
    SELECT id INTO w_id FROM workers WHERE candidate_id = _candidate_id LIMIT 1;
    RETURN w_id;
  END IF;
  INSERT INTO workers (
    candidate_id, full_name, email, phone, nationality, passport_no, passport_expiry,
    base_salary, status, joining_date, created_by
  ) VALUES (
    c.id, c.full_name, c.email, c.phone, c.nationality, c.passport_no, c.passport_expiry,
    COALESCE(c.expected_salary, 0), 'onboarding', CURRENT_DATE, auth.uid()
  ) RETURNING id INTO w_id;
  UPDATE candidates SET status = 'hired', updated_at = now() WHERE id = _candidate_id;
  INSERT INTO audit_log (actor_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'convert_candidate', 'worker', w_id::text, jsonb_build_object('candidate_id', _candidate_id));
  RETURN w_id;
END $$;
GRANT EXECUTE ON FUNCTION public.convert_candidate_to_worker(uuid) TO authenticated;

-- Worker compliance summary
CREATE OR REPLACE FUNCTION public.get_worker_compliance(_worker_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE
  w record;
  missing text[] := '{}';
  score int := 100;
BEGIN
  SELECT * INTO w FROM workers WHERE id = _worker_id;
  IF NOT FOUND THEN RETURN '{"ok":false,"error":"not_found"}'::jsonb; END IF;
  IF w.passport_no IS NULL OR w.passport_expiry IS NULL THEN missing := array_append(missing, 'passport'); score := score - 15; END IF;
  IF w.visa_expiry IS NULL THEN missing := array_append(missing, 'visa'); score := score - 20; END IF;
  IF w.emirates_id IS NULL THEN missing := array_append(missing, 'emirates_id'); score := score - 10; END IF;
  IF w.labor_card_no IS NULL THEN missing := array_append(missing, 'labor_card'); score := score - 10; END IF;
  IF w.medical_expiry IS NULL THEN missing := array_append(missing, 'medical'); score := score - 15; END IF;
  IF w.iban IS NULL THEN missing := array_append(missing, 'bank_iban'); score := score - 10; END IF;
  IF NOT EXISTS (SELECT 1 FROM documents d WHERE d.worker_id = _worker_id AND d.category = 'passport') THEN
    missing := array_append(missing, 'passport_doc'); score := score - 10;
  END IF;
  RETURN jsonb_build_object(
    'ok', true,
    'score', GREATEST(score, 0),
    'complete', cardinality(missing) = 0,
    'missing', to_jsonb(missing),
    'visa_expiry', w.visa_expiry,
    'passport_expiry', w.passport_expiry,
    'medical_expiry', w.medical_expiry
  );
END $$;
GRANT EXECUTE ON FUNCTION public.get_worker_compliance(uuid) TO authenticated;

-- Generate payroll run from workers + timesheets + deductions
CREATE OR REPLACE FUNCTION public.generate_payroll_run(_year int, _month int)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  run_id uuid;
  w record;
  v_gross numeric(14,2) := 0;
  v_ded numeric(14,2) := 0;
  v_net numeric(14,2) := 0;
  v_count int := 0;
  v_hours numeric(8,2);
  v_ot numeric(12,2);
  v_ded_worker numeric(12,2);
  v_adv numeric(12,2);
  v_item_gross numeric(14,2);
  v_item_net numeric(14,2);
BEGIN
  IF NOT (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  INSERT INTO payroll_runs (period_year, period_month, status, created_by)
  VALUES (_year, _month, 'draft', auth.uid())
  ON CONFLICT (period_year, period_month) DO UPDATE SET updated_at = now()
  RETURNING id INTO run_id;
  DELETE FROM payroll_items WHERE payroll_run_id = run_id;
  FOR w IN SELECT * FROM workers WHERE status IN ('active','on_leave') LOOP
    SELECT COALESCE(SUM(total_hours), 0) INTO v_hours
    FROM timesheets
    WHERE worker_id = w.id AND status = 'approved'
      AND EXTRACT(YEAR FROM period_start) = _year
      AND EXTRACT(MONTH FROM period_start) = _month;
    v_ot := GREATEST(0, (v_hours - 208)) * (COALESCE(w.base_salary,0) / 208.0 * 1.25);
    SELECT COALESCE(SUM(amount), 0) INTO v_ded_worker FROM worker_deductions
    WHERE worker_id = w.id AND (period_year IS NULL OR period_year = _year)
      AND (period_month IS NULL OR period_month = _month)
      AND applied_in_payroll_id IS NULL;
    SELECT COALESCE(SUM(amount), 0) INTO v_adv FROM salary_advances
    WHERE worker_id = w.id AND status = 'approved' AND deducted_in_payroll_id IS NULL;
    v_item_gross := COALESCE(w.base_salary,0) + COALESCE(w.housing_allowance,0) + COALESCE(w.transport_allowance,0) + COALESCE(w.other_allowance,0) + v_ot;
    v_ded_worker := v_ded_worker + v_adv;
    v_item_net := v_item_gross - v_ded_worker;
    INSERT INTO payroll_items (
      payroll_run_id, worker_id, base_salary, housing_allowance, transport_allowance, other_allowance,
      overtime_amount, gross, deductions, net, hours_worked, line_items
    ) VALUES (
      run_id, w.id, w.base_salary, w.housing_allowance, w.transport_allowance, w.other_allowance,
      v_ot, v_item_gross, v_ded_worker, v_item_net, v_hours,
      jsonb_build_array(
        jsonb_build_object('label','Base', 'amount', w.base_salary),
        jsonb_build_object('label','Housing', 'amount', w.housing_allowance),
        jsonb_build_object('label','Transport', 'amount', w.transport_allowance),
        jsonb_build_object('label','Other', 'amount', w.other_allowance),
        jsonb_build_object('label','Overtime', 'amount', v_ot)
      )
    );
    v_gross := v_gross + v_item_gross;
    v_ded := v_ded + v_ded_worker;
    v_net := v_net + v_item_net;
    v_count := v_count + 1;
  END LOOP;
  UPDATE payroll_runs SET total_gross = v_gross, total_deductions = v_ded, total_net = v_net, worker_count = v_count
  WHERE id = run_id;
  RETURN run_id;
END $$;
GRANT EXECUTE ON FUNCTION public.generate_payroll_run(int, int) TO authenticated;

-- Generate payslips from payroll run
CREATE OR REPLACE FUNCTION public.issue_payslips_from_payroll(_run_id uuid)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r record;
  n int := 0;
BEGIN
  SELECT period_year, period_month INTO r FROM payroll_runs WHERE id = _run_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Payroll run not found'; END IF;
  INSERT INTO payslips (worker_id, period_year, period_month, gross, deductions, net, currency, status, line_items, created_by)
  SELECT pi.worker_id, r.period_year, r.period_month, pi.gross, pi.deductions, pi.net, 'AED', 'draft', pi.line_items, auth.uid()
  FROM payroll_items pi WHERE pi.payroll_run_id = _run_id
  ON CONFLICT (worker_id, period_year, period_month) DO UPDATE SET
    gross = EXCLUDED.gross, deductions = EXCLUDED.deductions, net = EXCLUDED.net, line_items = EXCLUDED.line_items, updated_at = now();
  GET DIAGNOSTICS n = ROW_COUNT;
  UPDATE salary_advances SET status = 'deducted', deducted_in_payroll_id = _run_id
  WHERE worker_id IN (SELECT worker_id FROM payroll_items WHERE payroll_run_id = _run_id) AND status = 'approved';
  UPDATE worker_deductions SET applied_in_payroll_id = _run_id
  WHERE worker_id IN (SELECT worker_id FROM payroll_items WHERE payroll_run_id = _run_id) AND applied_in_payroll_id IS NULL;
  RETURN n;
END $$;
GRANT EXECUTE ON FUNCTION public.issue_payslips_from_payroll(uuid) TO authenticated;

-- Invoice from approved timesheets
CREATE OR REPLACE FUNCTION public.generate_invoice_from_timesheets(
  _client_id uuid, _from date, _to date, _due_days int DEFAULT 30
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  inv_id uuid;
  subtotal numeric(14,2) := 0;
  ts record;
BEGIN
  IF NOT (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant')) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  INSERT INTO invoices (client_id, issue_date, due_date, status, currency, subtotal, vat_amount, total, created_by)
  VALUES (_client_id, CURRENT_DATE, CURRENT_DATE + _due_days, 'draft', 'AED', 0, 0, 0, auth.uid())
  RETURNING id INTO inv_id;
  FOR ts IN
    SELECT ts.id, ts.total_hours, p.bill_rate, w.full_name
    FROM timesheets ts
    JOIN placements p ON p.id = ts.placement_id
    JOIN workers w ON w.id = ts.worker_id
    WHERE p.client_id = _client_id AND ts.status = 'approved'
      AND ts.period_start >= _from AND ts.period_end <= _to
  LOOP
    INSERT INTO invoice_lines (invoice_id, description, hours, rate, amount)
    VALUES (inv_id, ts.full_name || ' — timesheet', ts.total_hours, ts.bill_rate, ts.total_hours * COALESCE(ts.bill_rate, 0));
    subtotal := subtotal + ts.total_hours * COALESCE(ts.bill_rate, 0);
  END LOOP;
  UPDATE invoices SET subtotal = subtotal, total = subtotal WHERE id = inv_id;
  RETURN inv_id;
END $$;
GRANT EXECUTE ON FUNCTION public.generate_invoice_from_timesheets(uuid, date, date, int) TO authenticated;

-- Compliance alerts → notifications for admins/managers
CREATE OR REPLACE FUNCTION public.run_compliance_alerts()
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  w record;
  n int := 0;
  uid uuid;
BEGIN
  FOR uid IN SELECT user_id FROM user_roles WHERE role IN ('admin','manager') LOOP
    FOR w IN
      SELECT id, full_name, visa_expiry, passport_expiry, medical_expiry
      FROM workers WHERE status IN ('active','onboarding')
        AND (
          visa_expiry <= CURRENT_DATE + 30
          OR passport_expiry <= CURRENT_DATE + 180
          OR medical_expiry <= CURRENT_DATE + 30
        )
    LOOP
      INSERT INTO notifications (user_id, title, body, link, category)
      VALUES (
        uid,
        'Compliance: ' || w.full_name,
        'Review expiring visa/passport/medical records.',
        '/workers',
        'compliance'
      );
      n := n + 1;
    END LOOP;
  END LOOP;
  RETURN n;
END $$;
GRANT EXECUTE ON FUNCTION public.run_compliance_alerts() TO authenticated;

-- Client RLS helpers
CREATE OR REPLACE FUNCTION public.my_client_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT client_id FROM profiles WHERE id = auth.uid()
$$;
GRANT EXECUTE ON FUNCTION public.my_client_id() TO authenticated;

-- Extend client policies for portal users
CREATE POLICY clients_select_portal ON public.clients FOR SELECT TO authenticated
  USING (id = public.my_client_id());

CREATE POLICY jo_select_portal ON public.job_orders FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());

CREATE POLICY pl_select_portal ON public.placements FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());

CREATE POLICY inv_select_portal ON public.invoices FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());

CREATE POLICY ts_select_portal ON public.timesheets FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM placements p WHERE p.id = timesheets.placement_id AND p.client_id = public.my_client_id()
  ));

ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_issues_client ON public.issues(client_id);

CREATE POLICY iss_select_client ON public.issues FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());
CREATE POLICY iss_insert_client ON public.issues FOR INSERT TO authenticated
  WITH CHECK (client_id = public.my_client_id() AND has_role(auth.uid(),'client'));

CREATE POLICY jo_insert_client ON public.job_orders FOR INSERT TO authenticated
  WITH CHECK (client_id = public.my_client_id() AND has_role(auth.uid(),'client'));

CREATE POLICY workers_select_client ON public.workers FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.placements p WHERE p.worker_id = workers.id AND p.client_id = public.my_client_id()
  ));

CREATE POLICY ts_update_portal ON public.timesheets FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(),'client')
    AND EXISTS (SELECT 1 FROM placements p WHERE p.id = timesheets.placement_id AND p.client_id = public.my_client_id())
  )
  WITH CHECK (status IN ('approved','rejected'));

-- Audit on key tables
CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO audit_log (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id)::text,
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS audit_workers ON public.workers;
CREATE TRIGGER audit_workers AFTER INSERT OR UPDATE OR DELETE ON public.workers
  FOR EACH ROW EXECUTE FUNCTION public.audit_row_change();

DROP TRIGGER IF EXISTS audit_placements ON public.placements;
CREATE TRIGGER audit_placements AFTER INSERT OR UPDATE OR DELETE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.audit_row_change();

-- Storage for candidate docs
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-documents','candidate-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY cand_docs_storage_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'candidate-documents');
CREATE POLICY cand_docs_storage_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'candidate-documents' AND (
    has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter')
  ));
CREATE POLICY cand_docs_storage_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'candidate-documents' AND (
    has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter')
  ));
