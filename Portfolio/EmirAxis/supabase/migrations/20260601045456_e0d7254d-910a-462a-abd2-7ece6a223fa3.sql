
-- ============ DOCUMENTS (worker documents) ============
CREATE TYPE public.doc_category AS ENUM ('passport','visa','emirates_id','labor_card','medical','insurance','contract','certificate','other');
CREATE TYPE public.attendance_status AS ENUM ('present','absent','leave','sick','holiday','off');
CREATE TYPE public.timesheet_status AS ENUM ('draft','submitted','approved','rejected','paid');

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL,
  category doc_category NOT NULL,
  title TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  issue_date DATE,
  expiry_date DATE,
  notes TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_documents_worker ON public.documents(worker_id);
CREATE INDEX idx_documents_expiry ON public.documents(expiry_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY doc_select_staff ON public.documents FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY doc_select_self ON public.documents FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = documents.worker_id AND w.user_id = auth.uid()));
CREATE POLICY doc_write_mgmt ON public.documents FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_documents_updated BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ATTENDANCE ============
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL,
  placement_id UUID,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  hours NUMERIC(5,2) DEFAULT 0,
  overtime_hours NUMERIC(5,2) DEFAULT 0,
  location TEXT,
  notes TEXT,
  recorded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(worker_id, date)
);
CREATE INDEX idx_attendance_worker_date ON public.attendance(worker_id, date DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY att_select_staff ON public.attendance FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY att_select_self ON public.attendance FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = attendance.worker_id AND w.user_id = auth.uid()));
CREATE POLICY att_write_mgmt ON public.attendance FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON public.attendance
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TIMESHEETS ============
CREATE TABLE public.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL,
  placement_id UUID,
  client_id UUID,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_hours NUMERIC(7,2) DEFAULT 0,
  overtime_hours NUMERIC(7,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'AED',
  status timesheet_status NOT NULL DEFAULT 'draft',
  submitted_by UUID,
  submitted_at TIMESTAMPTZ,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_timesheets_worker ON public.timesheets(worker_id, period_start DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.timesheets TO authenticated;
GRANT ALL ON public.timesheets TO service_role;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY ts_select_staff ON public.timesheets FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY ts_select_self ON public.timesheets FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = timesheets.worker_id AND w.user_id = auth.uid()));
CREATE POLICY ts_write_mgmt ON public.timesheets FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'))
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'accountant'));

CREATE TRIGGER trg_timesheets_updated BEFORE UPDATE ON public.timesheets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ COMPLIANCE EXPIRY VIEW (function) ============
CREATE OR REPLACE FUNCTION public.get_compliance_expiries(_days_ahead INT DEFAULT 60)
RETURNS TABLE(
  worker_id UUID,
  worker_name TEXT,
  employee_code TEXT,
  category TEXT,
  expiry_date DATE,
  days_remaining INT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT w.id, w.full_name, w.employee_code, 'passport'::text, w.passport_expiry,
    (w.passport_expiry - CURRENT_DATE)::int
  FROM public.workers w
  WHERE w.passport_expiry IS NOT NULL
    AND w.passport_expiry <= CURRENT_DATE + _days_ahead
  UNION ALL
  SELECT w.id, w.full_name, w.employee_code, 'visa', w.visa_expiry,
    (w.visa_expiry - CURRENT_DATE)::int
  FROM public.workers w
  WHERE w.visa_expiry IS NOT NULL
    AND w.visa_expiry <= CURRENT_DATE + _days_ahead
  UNION ALL
  SELECT w.id, w.full_name, w.employee_code, 'emirates_id', w.emirates_id_expiry,
    (w.emirates_id_expiry - CURRENT_DATE)::int
  FROM public.workers w
  WHERE w.emirates_id_expiry IS NOT NULL
    AND w.emirates_id_expiry <= CURRENT_DATE + _days_ahead
  UNION ALL
  SELECT w.id, w.full_name, w.employee_code, 'labor_card', w.labor_card_expiry,
    (w.labor_card_expiry - CURRENT_DATE)::int
  FROM public.workers w
  WHERE w.labor_card_expiry IS NOT NULL
    AND w.labor_card_expiry <= CURRENT_DATE + _days_ahead
  UNION ALL
  SELECT w.id, w.full_name, w.employee_code, 'medical', w.medical_expiry,
    (w.medical_expiry - CURRENT_DATE)::int
  FROM public.workers w
  WHERE w.medical_expiry IS NOT NULL
    AND w.medical_expiry <= CURRENT_DATE + _days_ahead
  UNION ALL
  SELECT w.id, w.full_name, w.employee_code, 'insurance', w.insurance_expiry,
    (w.insurance_expiry - CURRENT_DATE)::int
  FROM public.workers w
  WHERE w.insurance_expiry IS NOT NULL
    AND w.insurance_expiry <= CURRENT_DATE + _days_ahead
  ORDER BY 5 ASC;
$$;

-- ============ STORAGE POLICIES for documents bucket ============
CREATE POLICY "doc_bucket_select_staff" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND (
  has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR
  has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant')
));
CREATE POLICY "doc_bucket_select_self" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "doc_bucket_insert_mgmt" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND (
  has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager')
));
CREATE POLICY "doc_bucket_update_mgmt" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager')));
CREATE POLICY "doc_bucket_delete_mgmt" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager')));

CREATE POLICY "branding_bucket_select_all" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'branding');
CREATE POLICY "branding_bucket_write_admin" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'branding' AND has_role(auth.uid(),'admin'));
CREATE POLICY "branding_bucket_update_admin" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'branding' AND has_role(auth.uid(),'admin'));
