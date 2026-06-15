
-- =====================================================
-- EmirAxis PRD gap closure: 14 new modules in one migration
-- =====================================================

-- Helper: shared updated_at trigger function already exists as public.set_updated_at()

-- =====================================================
-- 1. VISA & IMMIGRATION TRACKING
-- =====================================================
CREATE TYPE public.visa_stage AS ENUM (
  'offer_accepted','documents_collected','entry_permit','status_change',
  'medical_booked','medical_done','emirates_id','visa_stamping',
  'labour_contract','activated','renewal_pending','cancellation','cancelled'
);
CREATE TYPE public.visa_step_status AS ENUM ('pending','in_progress','done','failed','skipped');

CREATE TABLE public.visa_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL,
  stage public.visa_stage NOT NULL,
  status public.visa_step_status NOT NULL DEFAULT 'pending',
  visa_type text,
  sponsor text,
  entry_permit_no text,
  uid_no text,
  reference_no text,
  scheduled_date date,
  completed_date date,
  cost numeric DEFAULT 0,
  assigned_pro uuid,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visa_records TO authenticated;
GRANT ALL ON public.visa_records TO service_role;
ALTER TABLE public.visa_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY vr_select_staff ON public.visa_records FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY vr_select_self ON public.visa_records FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workers w WHERE w.id = visa_records.worker_id AND w.user_id = auth.uid()));
CREATE POLICY vr_write_mgmt ON public.visa_records FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_vr_updated BEFORE UPDATE ON public.visa_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 2. MEDICAL FITNESS
-- =====================================================
CREATE TYPE public.medical_status AS ENUM ('required','booked','attended','missed','passed','failed','retest','certified');
CREATE TABLE public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL,
  medical_center text,
  appointment_at timestamptz,
  status public.medical_status NOT NULL DEFAULT 'required',
  result_date date,
  certificate_url text,
  assigned_pro uuid,
  transport_pickup text,
  cost numeric DEFAULT 0,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_records TO authenticated;
GRANT ALL ON public.medical_records TO service_role;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY mr_select_staff ON public.medical_records FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY mr_select_self ON public.medical_records FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workers w WHERE w.id = medical_records.worker_id AND w.user_id = auth.uid()));
CREATE POLICY mr_write_mgmt ON public.medical_records FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_mr_updated BEFORE UPDATE ON public.medical_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 3. WARNING LETTERS
-- =====================================================
CREATE TYPE public.warning_type AS ENUM ('verbal','first_written','second_written','final','suspension','termination','absconding','performance');
CREATE TYPE public.warning_status AS ENUM ('draft','issued','acknowledged','disputed','closed');
CREATE TABLE public.warning_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL,
  client_id uuid,
  warning_type public.warning_type NOT NULL DEFAULT 'verbal',
  status public.warning_status NOT NULL DEFAULT 'draft',
  incident_date date NOT NULL DEFAULT CURRENT_DATE,
  reason text NOT NULL,
  description text,
  evidence_url text,
  issued_by uuid,
  issued_at timestamptz,
  acknowledged_at timestamptz,
  follow_up_date date,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.warning_letters TO authenticated;
GRANT ALL ON public.warning_letters TO service_role;
ALTER TABLE public.warning_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY wl_select_staff ON public.warning_letters FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY wl_select_self ON public.warning_letters FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workers w WHERE w.id = warning_letters.worker_id AND w.user_id = auth.uid()));
CREATE POLICY wl_write_mgmt ON public.warning_letters FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_wl_updated BEFORE UPDATE ON public.warning_letters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 4. PRO / GOVERNMENT TASKS
-- =====================================================
CREATE TYPE public.pro_task_type AS ENUM (
  'quota_request','work_permit','offer_letter','entry_permit','status_change',
  'medical_booking','emirates_id','visa_stamping','labour_card','insurance',
  'visa_renewal','visa_cancellation','absconding','fine_check','document_collection','other'
);
CREATE TYPE public.pro_task_status AS ENUM ('open','in_progress','submitted','on_hold','done','cancelled');

CREATE TABLE public.pro_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid,
  candidate_id uuid,
  client_id uuid,
  task_type public.pro_task_type NOT NULL DEFAULT 'other',
  status public.pro_task_status NOT NULL DEFAULT 'open',
  title text NOT NULL,
  description text,
  reference_no text,
  cost numeric DEFAULT 0,
  assigned_to uuid,
  due_date date,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pro_tasks TO authenticated;
GRANT ALL ON public.pro_tasks TO service_role;
ALTER TABLE public.pro_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY pt_select_staff ON public.pro_tasks FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY pt_write_mgmt ON public.pro_tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE TRIGGER trg_pt_updated BEFORE UPDATE ON public.pro_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 5. ACCOMMODATION (buildings -> rooms -> beds)
-- =====================================================
CREATE TABLE public.accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  emirate text,
  city text,
  building_type text,
  monthly_rent numeric DEFAULT 0,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accommodations TO authenticated;
GRANT ALL ON public.accommodations TO service_role;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
CREATE POLICY acc_select ON public.accommodations FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY acc_write ON public.accommodations FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_acc_updated BEFORE UPDATE ON public.accommodations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.accommodation_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id uuid NOT NULL,
  room_no text NOT NULL,
  floor text,
  capacity int NOT NULL DEFAULT 1,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accommodation_rooms TO authenticated;
GRANT ALL ON public.accommodation_rooms TO service_role;
ALTER TABLE public.accommodation_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY ar_select ON public.accommodation_rooms FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY ar_write ON public.accommodation_rooms FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_ar_updated BEFORE UPDATE ON public.accommodation_rooms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.bed_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  bed_no text,
  check_in date NOT NULL DEFAULT CURRENT_DATE,
  check_out date,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bed_assignments TO authenticated;
GRANT ALL ON public.bed_assignments TO service_role;
ALTER TABLE public.bed_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY ba_select_staff ON public.bed_assignments FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY ba_select_self ON public.bed_assignments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workers w WHERE w.id = bed_assignments.worker_id AND w.user_id = auth.uid()));
CREATE POLICY ba_write ON public.bed_assignments FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_ba_updated BEFORE UPDATE ON public.bed_assignments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 6. ASSET / UNIFORM ISSUANCES
-- =====================================================
CREATE TYPE public.asset_status AS ENUM ('issued','returned','lost','damaged');
CREATE TABLE public.asset_issuances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL,
  item_name text NOT NULL,
  category text,
  size text,
  quantity int NOT NULL DEFAULT 1,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  return_date date,
  status public.asset_status NOT NULL DEFAULT 'issued',
  deduction_amount numeric DEFAULT 0,
  acknowledged boolean NOT NULL DEFAULT false,
  notes text,
  issued_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_issuances TO authenticated;
GRANT ALL ON public.asset_issuances TO service_role;
ALTER TABLE public.asset_issuances ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_select_staff ON public.asset_issuances FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY ai_select_self ON public.asset_issuances FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workers w WHERE w.id = asset_issuances.worker_id AND w.user_id = auth.uid()));
CREATE POLICY ai_write ON public.asset_issuances FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_ai_updated BEFORE UPDATE ON public.asset_issuances FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Uniform sizes columns on workers
ALTER TABLE public.workers
  ADD COLUMN IF NOT EXISTS shirt_size text,
  ADD COLUMN IF NOT EXISTS trouser_size text,
  ADD COLUMN IF NOT EXISTS shoe_size text;

-- =====================================================
-- 7. INTERNAL TASKS
-- =====================================================
CREATE TYPE public.task_priority AS ENUM ('low','medium','high','urgent');
CREATE TYPE public.task_status AS ENUM ('todo','in_progress','blocked','done','cancelled');
CREATE TABLE public.internal_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  related_worker_id uuid,
  related_client_id uuid,
  related_job_order_id uuid,
  assigned_to uuid,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  status public.task_status NOT NULL DEFAULT 'todo',
  due_date date,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internal_tasks TO authenticated;
GRANT ALL ON public.internal_tasks TO service_role;
ALTER TABLE public.internal_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY it_select ON public.internal_tasks FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant') OR assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY it_write ON public.internal_tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR assigned_to = auth.uid() OR created_by = auth.uid())
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR created_by = auth.uid());
CREATE TRIGGER trg_it_updated BEFORE UPDATE ON public.internal_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 8. RECRUITMENT AGENTS
-- =====================================================
CREATE TABLE public.recruitment_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  contact_person text,
  email text,
  phone text,
  whatsapp text,
  commission_pct numeric DEFAULT 0,
  agreement_url text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recruitment_agents TO authenticated;
GRANT ALL ON public.recruitment_agents TO service_role;
ALTER TABLE public.recruitment_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY ra_select ON public.recruitment_agents FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY ra_write ON public.recruitment_agents FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_ra_updated BEFORE UPDATE ON public.recruitment_agents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS agent_id uuid;

-- =====================================================
-- 9. TRANSPORT (vehicles, drivers, routes)
-- =====================================================
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_no text NOT NULL,
  make text,
  model text,
  capacity int DEFAULT 0,
  registration_expiry date,
  insurance_expiry date,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY veh_select ON public.vehicles FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY veh_write ON public.vehicles FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_veh_updated BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  license_no text,
  license_expiry date,
  vehicle_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY drv_select ON public.drivers FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY drv_write ON public.drivers FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_drv_updated BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.transport_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pickup_point text,
  dropoff_point text,
  client_id uuid,
  shift text,
  driver_id uuid,
  vehicle_id uuid,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transport_routes TO authenticated;
GRANT ALL ON public.transport_routes TO service_role;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tr_select ON public.transport_routes FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY tr_write ON public.transport_routes FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_tr_updated BEFORE UPDATE ON public.transport_routes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 10. INVENTORY
-- =====================================================
CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text,
  category text,
  unit text DEFAULT 'pcs',
  stock_qty int NOT NULL DEFAULT 0,
  low_stock_threshold int DEFAULT 0,
  unit_cost numeric DEFAULT 0,
  supplier text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_items TO authenticated;
GRANT ALL ON public.inventory_items TO service_role;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY ii_select ON public.inventory_items FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY ii_write ON public.inventory_items FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_ii_updated BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TYPE public.inv_txn_type AS ENUM ('in','out','adjust','return','damage');
CREATE TABLE public.inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  txn_type public.inv_txn_type NOT NULL,
  quantity int NOT NULL,
  worker_id uuid,
  reference text,
  notes text,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_transactions TO authenticated;
GRANT ALL ON public.inventory_transactions TO service_role;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY it_txn_select ON public.inventory_transactions FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY it_txn_write ON public.inventory_transactions FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

-- =====================================================
-- 11. INCIDENTS
-- =====================================================
CREATE TYPE public.incident_type AS ENUM ('injury','accident','damage','theft','fight','misconduct','site_accident','transport_accident','accommodation','other');
CREATE TYPE public.incident_status AS ENUM ('open','investigating','resolved','escalated','closed');
CREATE TABLE public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid,
  client_id uuid,
  incident_type public.incident_type NOT NULL DEFAULT 'other',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  location text,
  description text NOT NULL,
  witnesses text,
  photos jsonb DEFAULT '[]'::jsonb,
  medical_treatment text,
  police_report text,
  action_taken text,
  status public.incident_status NOT NULL DEFAULT 'open',
  reported_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.incidents TO authenticated;
GRANT ALL ON public.incidents TO service_role;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY inc_select_staff ON public.incidents FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY inc_write ON public.incidents FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE TRIGGER trg_inc_updated BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 12. COMMUNICATION LOGS
-- =====================================================
CREATE TYPE public.comm_channel AS ENUM ('whatsapp','sms','email','phone','in_person','other');
CREATE TYPE public.comm_direction AS ENUM ('inbound','outbound');
CREATE TABLE public.communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid,
  candidate_id uuid,
  client_id uuid,
  channel public.comm_channel NOT NULL,
  direction public.comm_direction NOT NULL DEFAULT 'outbound',
  subject text,
  body text,
  attachment_url text,
  contacted_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.communication_logs TO authenticated;
GRANT ALL ON public.communication_logs TO service_role;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY cl_select ON public.communication_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY cl_write ON public.communication_logs FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));

CREATE TABLE public.message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel public.comm_channel NOT NULL DEFAULT 'whatsapp',
  category text,
  body text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_templates TO authenticated;
GRANT ALL ON public.message_templates TO service_role;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY mt_select ON public.message_templates FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY mt_write ON public.message_templates FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_mt_updated BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 13. AIRPORT PICKUPS
-- =====================================================
CREATE TYPE public.pickup_status AS ENUM ('pending','arranged','completed','missed','cancelled');
CREATE TABLE public.airport_pickups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid,
  worker_id uuid,
  flight_no text,
  airline text,
  terminal text,
  arrival_at timestamptz NOT NULL,
  driver_id uuid,
  vehicle_id uuid,
  accommodation_id uuid,
  status public.pickup_status NOT NULL DEFAULT 'pending',
  checklist jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.airport_pickups TO authenticated;
GRANT ALL ON public.airport_pickups TO service_role;
ALTER TABLE public.airport_pickups ENABLE ROW LEVEL SECURITY;
CREATE POLICY ap_select ON public.airport_pickups FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY ap_write ON public.airport_pickups FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE TRIGGER trg_ap_updated BEFORE UPDATE ON public.airport_pickups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 14. CONTRACT DOCUMENTS (generated templates)
-- =====================================================
CREATE TYPE public.contract_doc_type AS ENUM (
  'offer_letter','employment_contract','noc','salary_certificate','experience_certificate',
  'termination_letter','visa_cancellation','deployment_letter','warning_letter','other'
);
CREATE TABLE public.contract_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid,
  client_id uuid,
  doc_type public.contract_doc_type NOT NULL,
  title text NOT NULL,
  body text,
  pdf_url text,
  issued_date date DEFAULT CURRENT_DATE,
  signed boolean NOT NULL DEFAULT false,
  signed_url text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contract_documents TO authenticated;
GRANT ALL ON public.contract_documents TO service_role;
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY cd2_select_staff ON public.contract_documents FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY cd2_select_self ON public.contract_documents FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workers w WHERE w.id = contract_documents.worker_id AND w.user_id = auth.uid()));
CREATE POLICY cd2_write ON public.contract_documents FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE TRIGGER trg_cd2_updated BEFORE UPDATE ON public.contract_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- Seed message templates
-- =====================================================
INSERT INTO public.message_templates (name, channel, category, body) VALUES
('Medical Appointment Reminder','whatsapp','medical','Dear {{name}}, your medical appointment is scheduled at {{center}} on {{date}}. Please bring your passport copy.'),
('Visa Renewal Reminder','whatsapp','visa','Dear {{name}}, your visa expires on {{date}}. Please submit your passport for renewal.'),
('Airport Pickup','whatsapp','arrival','Welcome to UAE! Driver {{driver}} ({{plate}}) will pick you up at Terminal {{terminal}}.'),
('Payslip Issued','whatsapp','payroll','Dear {{name}}, your payslip for {{month}} has been issued. Net pay: AED {{net}}.'),
('Warning Letter Notice','whatsapp','disciplinary','Dear {{name}}, a {{type}} warning has been issued. Please report to HR.'),
('Deployment Confirmation','whatsapp','deployment','Dear {{name}}, you are deployed to {{client}} starting {{date}}. Report to {{supervisor}}.');
