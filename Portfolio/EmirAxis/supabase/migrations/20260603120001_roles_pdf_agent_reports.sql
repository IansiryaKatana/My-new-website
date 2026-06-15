-- Dedicated roles, agent portal, inventory sync, report RPCs, PDF storage
-- Requires 20260603120000_app_role_enum_values.sql to be applied first.

-- Role helpers for supplemental RLS
CREATE OR REPLACE FUNCTION public.is_finance_staff(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT has_role(_uid, 'admin') OR has_role(_uid, 'manager') OR has_role(_uid, 'accountant') OR has_role(_uid, 'payroll_officer');
$$;

CREATE OR REPLACE FUNCTION public.is_pro_staff(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT has_role(_uid, 'admin') OR has_role(_uid, 'manager') OR has_role(_uid, 'recruiter') OR has_role(_uid, 'pro');
$$;

GRANT EXECUTE ON FUNCTION public.is_finance_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_pro_staff(uuid) TO authenticated;

-- Supplemental policies (OR with existing)
CREATE POLICY pr_run_payroll_officer ON public.payroll_runs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'payroll_officer')) WITH CHECK (has_role(auth.uid(), 'payroll_officer'));
CREATE POLICY ps_payroll_officer ON public.payslips FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'payroll_officer')) WITH CHECK (has_role(auth.uid(), 'payroll_officer'));
CREATE POLICY inv_payroll_officer ON public.invoices FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'payroll_officer')) WITH CHECK (has_role(auth.uid(), 'payroll_officer'));
CREATE POLICY invl_payroll_officer ON public.invoice_lines FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'payroll_officer')) WITH CHECK (has_role(auth.uid(), 'payroll_officer'));
CREATE POLICY pay_payroll_officer ON public.payments FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'payroll_officer')) WITH CHECK (has_role(auth.uid(), 'payroll_officer'));

CREATE POLICY vr_pro ON public.visa_records FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'pro')) WITH CHECK (has_role(auth.uid(), 'pro'));
CREATE POLICY mr_pro ON public.medical_records FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'pro')) WITH CHECK (has_role(auth.uid(), 'pro'));
CREATE POLICY pt_pro ON public.pro_tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'pro')) WITH CHECK (has_role(auth.uid(), 'pro'));

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS pdf_url text;

-- Agent portal: link candidates to agents
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES public.recruitment_agents(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_candidates_agent ON public.candidates(agent_id);

CREATE OR REPLACE FUNCTION public.my_agent_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT agent_id FROM profiles WHERE id = auth.uid()
$$;
GRANT EXECUTE ON FUNCTION public.my_agent_id() TO authenticated;

CREATE POLICY cand_update_agent ON public.candidates FOR UPDATE TO authenticated
  USING (agent_id = public.my_agent_id() AND public.my_agent_id() IS NOT NULL)
  WITH CHECK (agent_id = public.my_agent_id());

CREATE POLICY cand_insert_agent ON public.candidates FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'agent')
    OR (agent_id = public.my_agent_id() AND public.my_agent_id() IS NOT NULL)
  );

CREATE POLICY cand_select_agent_role ON public.candidates FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') OR has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'accountant')
    OR agent_id = public.my_agent_id()
  );

-- Agent can read own agent record
CREATE POLICY ra_select_agent ON public.recruitment_agents FOR SELECT TO authenticated
  USING (id = public.my_agent_id() OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));

CREATE POLICY cd_agent ON public.candidate_documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM candidates c WHERE c.id = candidate_documents.candidate_id AND c.agent_id = public.my_agent_id()))
  WITH CHECK (EXISTS (SELECT 1 FROM candidates c WHERE c.id = candidate_documents.candidate_id AND c.agent_id = public.my_agent_id()));

-- Inventory: auto-update stock on transaction
CREATE OR REPLACE FUNCTION public.apply_inventory_transaction()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  delta int;
BEGIN
  IF NEW.txn_type IN ('in', 'return') THEN delta := NEW.quantity;
  ELSIF NEW.txn_type IN ('out', 'damage') THEN delta := -NEW.quantity;
  ELSE delta := NEW.quantity;
  END IF;
  UPDATE inventory_items SET stock_qty = GREATEST(0, stock_qty + delta), updated_at = now()
  WHERE id = NEW.item_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_inv_txn_apply ON public.inventory_transactions;
CREATE TRIGGER trg_inv_txn_apply AFTER INSERT ON public.inventory_transactions
  FOR EACH ROW EXECUTE FUNCTION public.apply_inventory_transaction();

-- Report RPCs
CREATE OR REPLACE FUNCTION public.get_workers_by_status()
RETURNS TABLE(status text, count bigint) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT status::text, COUNT(*)::bigint FROM workers GROUP BY status ORDER BY count DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_candidates_by_source()
RETURNS TABLE(source text, count bigint) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT COALESCE(NULLIF(TRIM(source), ''), 'Unknown'), COUNT(*)::bigint FROM candidates GROUP BY 1 ORDER BY count DESC LIMIT 20;
$$;

CREATE OR REPLACE FUNCTION public.get_issues_by_category()
RETURNS TABLE(category text, count bigint) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT category::text, COUNT(*)::bigint FROM issues WHERE status IN ('open','in_progress') GROUP BY category ORDER BY count DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_recruitment_funnel()
RETURNS TABLE(stage text, count bigint) LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT status::text, COUNT(*)::bigint FROM candidates GROUP BY status ORDER BY count DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_workers_by_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_candidates_by_source() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_issues_by_category() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recruitment_funnel() TO authenticated;

-- PDF storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-pdfs','generated-pdfs', false) ON CONFLICT (id) DO NOTHING;

CREATE POLICY gen_pdf_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'generated-pdfs');
CREATE POLICY gen_pdf_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'generated-pdfs' AND (
    has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant')
    OR has_role(auth.uid(),'payroll_officer') OR has_role(auth.uid(),'pro')
  ));
CREATE POLICY gen_pdf_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'generated-pdfs');
CREATE POLICY gen_pdf_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'generated-pdfs' AND has_role(auth.uid(),'admin'));

-- Message templates: pro + recruiter read
CREATE POLICY mt_select_pro ON public.message_templates FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'pro') OR has_role(auth.uid(),'recruiter'));
