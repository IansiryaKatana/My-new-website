
-- Enums
CREATE TYPE public.issue_category AS ENUM ('welfare','accommodation','transport','payroll','safety','hr','other');
CREATE TYPE public.issue_severity AS ENUM ('low','medium','high','critical');
CREATE TYPE public.issue_status AS ENUM ('open','in_progress','resolved','closed');
CREATE TYPE public.invoice_status AS ENUM ('draft','sent','partial','paid','overdue','void');

-- Sequence for invoice reference
CREATE SEQUENCE IF NOT EXISTS public.invoice_seq START 1;

-- ISSUES
CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES public.workers(id) ON DELETE SET NULL,
  reported_by uuid,
  category public.issue_category NOT NULL DEFAULT 'other',
  severity public.issue_severity NOT NULL DEFAULT 'medium',
  status public.issue_status NOT NULL DEFAULT 'open',
  title text NOT NULL,
  description text,
  assigned_to uuid,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY iss_select_staff ON public.issues FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY iss_select_self ON public.issues FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = issues.worker_id AND w.user_id = auth.uid()));
CREATE POLICY iss_insert_staff ON public.issues FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY iss_insert_self ON public.issues FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = issues.worker_id AND w.user_id = auth.uid()));
CREATE POLICY iss_update_staff ON public.issues FOR UPDATE TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY iss_delete_mgmt ON public.issues FOR DELETE TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_issues_updated BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ISSUE COMMENTS
CREATE TABLE public.issue_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issue_comments TO authenticated;
GRANT ALL ON public.issue_comments TO service_role;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY ic_select ON public.issue_comments FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant')
    OR EXISTS (SELECT 1 FROM public.issues i JOIN public.workers w ON w.id = i.worker_id WHERE i.id = issue_comments.issue_id AND w.user_id = auth.uid())
  );
CREATE POLICY ic_insert ON public.issue_comments FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND (
      has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter')
      OR EXISTS (SELECT 1 FROM public.issues i JOIN public.workers w ON w.id = i.worker_id WHERE i.id = issue_comments.issue_id AND w.user_id = auth.uid())
    )
  );

-- INVOICES
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  period_start date,
  period_end date,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  vat_rate numeric(5,2) NOT NULL DEFAULT 5,
  vat_amount numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  amount_paid numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'AED',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY inv_select_fin ON public.invoices FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));
CREATE POLICY inv_write_fin ON public.invoices FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE OR REPLACE FUNCTION public.set_invoice_reference()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'INV-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.invoice_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_invoice_ref BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_reference();
CREATE TRIGGER trg_invoice_updated BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- INVOICE LINES
CREATE TABLE public.invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  placement_id uuid REFERENCES public.placements(id) ON DELETE SET NULL,
  worker_id uuid REFERENCES public.workers(id) ON DELETE SET NULL,
  description text NOT NULL,
  hours numeric(10,2) NOT NULL DEFAULT 0,
  rate numeric(12,2) NOT NULL DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_lines TO authenticated;
GRANT ALL ON public.invoice_lines TO service_role;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY invl_select_fin ON public.invoice_lines FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));
CREATE POLICY invl_write_fin ON public.invoice_lines FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

-- PAYMENTS
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL,
  method text,
  reference text,
  paid_on date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY pay_select_fin ON public.payments FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));
CREATE POLICY pay_write_fin ON public.payments FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

-- Trigger to keep invoice totals updated when lines change
CREATE OR REPLACE FUNCTION public.recalc_invoice_totals()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_invoice uuid;
  v_sub numeric;
  v_rate numeric;
BEGIN
  v_invoice := COALESCE(NEW.invoice_id, OLD.invoice_id);
  SELECT COALESCE(SUM(amount),0) INTO v_sub FROM public.invoice_lines WHERE invoice_id = v_invoice;
  SELECT vat_rate INTO v_rate FROM public.invoices WHERE id = v_invoice;
  UPDATE public.invoices
    SET subtotal = v_sub,
        vat_amount = ROUND(v_sub * v_rate / 100, 2),
        total = ROUND(v_sub + (v_sub * v_rate / 100), 2)
    WHERE id = v_invoice;
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER trg_invl_recalc AFTER INSERT OR UPDATE OR DELETE ON public.invoice_lines
  FOR EACH ROW EXECUTE FUNCTION public.recalc_invoice_totals();

-- Trigger to update amount_paid on payments
CREATE OR REPLACE FUNCTION public.recalc_invoice_paid()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_invoice uuid;
  v_paid numeric;
  v_total numeric;
BEGIN
  v_invoice := COALESCE(NEW.invoice_id, OLD.invoice_id);
  SELECT COALESCE(SUM(amount),0) INTO v_paid FROM public.payments WHERE invoice_id = v_invoice;
  SELECT total INTO v_total FROM public.invoices WHERE id = v_invoice;
  UPDATE public.invoices
    SET amount_paid = v_paid,
        status = CASE
          WHEN v_paid >= v_total AND v_total > 0 THEN 'paid'::invoice_status
          WHEN v_paid > 0 THEN 'partial'::invoice_status
          ELSE status
        END
    WHERE id = v_invoice;
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER trg_pay_recalc AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.recalc_invoice_paid();

CREATE INDEX idx_issues_worker ON public.issues(worker_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_invoices_client ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoice_lines_invoice ON public.invoice_lines(invoice_id);
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);
