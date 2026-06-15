
-- =========================================================================
-- PHASE 2: CORE OPERATIONS SCHEMA
-- =========================================================================

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE public.client_status AS ENUM ('prospect','active','on_hold','inactive','blacklisted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.job_order_status AS ENUM ('draft','open','in_progress','partially_filled','filled','on_hold','cancelled','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.job_priority AS ENUM ('low','normal','high','urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.contract_type AS ENUM ('limited','unlimited','part_time','project','seasonal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.candidate_status AS ENUM ('new','screening','shortlisted','interviewing','offered','hired','rejected','withdrawn','blacklisted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.worker_status AS ENUM ('onboarding','active','on_leave','suspended','terminated','absconded','exited');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.placement_status AS ENUM ('proposed','confirmed','active','completed','terminated','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- CLIENTS ----------
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL,
  trade_name text,
  industry text,
  trade_license_no text,
  trade_license_expiry date,
  vat_number text,
  country text DEFAULT 'AE',
  emirate text,
  city text,
  address_line text,
  website text,
  email text,
  phone text,
  billing_terms_days int DEFAULT 30,
  credit_limit numeric(14,2) DEFAULT 0,
  currency text DEFAULT 'AED',
  status public.client_status NOT NULL DEFAULT 'prospect',
  account_manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  logo_url text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_clients_account_manager ON public.clients(account_manager_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY clients_select_staff ON public.clients FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY clients_insert_mgmt ON public.clients FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY clients_update_mgmt ON public.clients FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY clients_delete_admin ON public.clients FOR DELETE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- CLIENT CONTACTS ----------
CREATE TABLE public.client_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  role_title text,
  email text,
  phone text,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_client_contacts_client ON public.client_contacts(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_contacts TO authenticated;
GRANT ALL ON public.client_contacts TO service_role;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY cc_select_staff ON public.client_contacts FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY cc_write_mgmt ON public.client_contacts FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'))
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));

CREATE TRIGGER trg_cc_updated BEFORE UPDATE ON public.client_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- JOB ORDERS ----------
CREATE TABLE public.job_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  title text NOT NULL,
  category text,
  description text,
  quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  filled_count int NOT NULL DEFAULT 0,
  location text,
  emirate text,
  contract_type public.contract_type DEFAULT 'limited',
  start_date date,
  end_date date,
  working_hours_per_day numeric(4,2) DEFAULT 9,
  pay_rate numeric(12,2) DEFAULT 0,
  bill_rate numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'AED',
  priority public.job_priority DEFAULT 'normal',
  status public.job_order_status NOT NULL DEFAULT 'draft',
  sla_days int DEFAULT 14,
  requirements jsonb DEFAULT '{}'::jsonb,
  account_manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  recruiter_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_job_orders_client ON public.job_orders(client_id);
CREATE INDEX idx_job_orders_status ON public.job_orders(status);
CREATE INDEX idx_job_orders_recruiter ON public.job_orders(recruiter_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_orders TO authenticated;
GRANT ALL ON public.job_orders TO service_role;
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY jo_select_staff ON public.job_orders FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY jo_insert_mgmt ON public.job_orders FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY jo_update_mgmt ON public.job_orders FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY jo_delete_admin ON public.job_orders FOR DELETE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_job_orders_updated BEFORE UPDATE ON public.job_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-generate job order reference like JO-2026-000001
CREATE SEQUENCE IF NOT EXISTS public.job_order_seq START 1;
CREATE OR REPLACE FUNCTION public.set_job_order_reference()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'JO-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.job_order_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_jo_reference BEFORE INSERT ON public.job_orders
FOR EACH ROW EXECUTE FUNCTION public.set_job_order_reference();

-- ---------- CANDIDATES ----------
CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE,
  full_name text NOT NULL,
  email text,
  phone text,
  whatsapp text,
  date_of_birth date,
  gender text,
  nationality text,
  passport_no text,
  passport_expiry date,
  current_country text,
  current_city text,
  marital_status text,
  religion text,
  languages text[],
  skills text[],
  years_experience numeric(4,1) DEFAULT 0,
  current_salary numeric(12,2),
  expected_salary numeric(12,2),
  notice_period_days int,
  source text,
  status public.candidate_status NOT NULL DEFAULT 'new',
  job_order_id uuid REFERENCES public.job_orders(id) ON DELETE SET NULL,
  assigned_recruiter_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  avatar_url text,
  cv_url text,
  rating int CHECK (rating BETWEEN 0 AND 5),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_candidates_status ON public.candidates(status);
CREATE INDEX idx_candidates_job_order ON public.candidates(job_order_id);
CREATE INDEX idx_candidates_recruiter ON public.candidates(assigned_recruiter_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO authenticated;
GRANT ALL ON public.candidates TO service_role;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY cand_select_staff ON public.candidates FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY cand_insert_staff ON public.candidates FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY cand_update_staff ON public.candidates FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));
CREATE POLICY cand_delete_mgmt ON public.candidates FOR DELETE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_candidates_updated BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE SEQUENCE IF NOT EXISTS public.candidate_seq START 1;
CREATE OR REPLACE FUNCTION public.set_candidate_reference()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := 'CN-' || to_char(now(),'YY') || lpad(nextval('public.candidate_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_cand_reference BEFORE INSERT ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.set_candidate_reference();

-- ---------- CANDIDATE DOCUMENTS ----------
CREATE TABLE public.candidate_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_path text NOT NULL,
  file_name text,
  mime_type text,
  size_bytes bigint,
  expiry_date date,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cand_docs_candidate ON public.candidate_documents(candidate_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_documents TO authenticated;
GRANT ALL ON public.candidate_documents TO service_role;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY cd_select_staff ON public.candidate_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY cd_write_staff ON public.candidate_documents FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'))
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter'));

-- ---------- WORKERS ----------
CREATE TABLE public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code text UNIQUE,
  user_id uuid UNIQUE,           -- links to auth user when worker has portal access
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  whatsapp text,
  nationality text,
  date_of_birth date,
  gender text,
  passport_no text,
  passport_expiry date,
  emirates_id text,
  emirates_id_expiry date,
  visa_number text,
  visa_expiry date,
  labor_card_no text,
  labor_card_expiry date,
  medical_expiry date,
  insurance_expiry date,
  department text,
  designation text,
  joining_date date,
  contract_start date,
  contract_end date,
  base_salary numeric(12,2) DEFAULT 0,
  housing_allowance numeric(12,2) DEFAULT 0,
  transport_allowance numeric(12,2) DEFAULT 0,
  other_allowance numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'AED',
  bank_name text,
  iban text,
  wps_personal_id text,
  routing_code text,
  accommodation text,
  status public.worker_status NOT NULL DEFAULT 'onboarding',
  avatar_url text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_workers_status ON public.workers(status);
CREATE INDEX idx_workers_user ON public.workers(user_id);
CREATE INDEX idx_workers_visa_expiry ON public.workers(visa_expiry);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workers TO authenticated;
GRANT ALL ON public.workers TO service_role;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY workers_select_staff ON public.workers FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY workers_select_self ON public.workers FOR SELECT TO authenticated
USING (user_id = auth.uid());
CREATE POLICY workers_insert_mgmt ON public.workers FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE POLICY workers_update_mgmt ON public.workers FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));
CREATE POLICY workers_delete_admin ON public.workers FOR DELETE TO authenticated
USING (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_workers_updated BEFORE UPDATE ON public.workers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE SEQUENCE IF NOT EXISTS public.worker_seq START 1;
CREATE OR REPLACE FUNCTION public.set_worker_code()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.employee_code IS NULL OR NEW.employee_code = '' THEN
    NEW.employee_code := 'EMP' || lpad(nextval('public.worker_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_worker_code BEFORE INSERT ON public.workers
FOR EACH ROW EXECUTE FUNCTION public.set_worker_code();

-- ---------- PLACEMENTS ----------
CREATE TABLE public.placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  job_order_id uuid NOT NULL REFERENCES public.job_orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  pay_rate numeric(12,2) DEFAULT 0,
  bill_rate numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'AED',
  status public.placement_status NOT NULL DEFAULT 'proposed',
  notes text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_placements_worker ON public.placements(worker_id);
CREATE INDEX idx_placements_job_order ON public.placements(job_order_id);
CREATE INDEX idx_placements_client ON public.placements(client_id);
CREATE INDEX idx_placements_status ON public.placements(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.placements TO authenticated;
GRANT ALL ON public.placements TO service_role;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY pl_select_staff ON public.placements FOR SELECT TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant'));
CREATE POLICY pl_select_self ON public.placements FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.workers w WHERE w.id = placements.worker_id AND w.user_id = auth.uid()));
CREATE POLICY pl_write_mgmt ON public.placements FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'))
WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_placements_updated BEFORE UPDATE ON public.placements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- STORAGE BUCKETS ----------
INSERT INTO storage.buckets (id, name, public) VALUES ('documents','documents', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('branding','branding', true)
ON CONFLICT (id) DO NOTHING;

-- documents (private) — staff read/write; workers can read files in folder = their uid
CREATE POLICY "documents_staff_read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='documents' AND (
  has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager')
  OR has_role(auth.uid(),'recruiter') OR has_role(auth.uid(),'accountant')
));
CREATE POLICY "documents_self_read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "documents_staff_write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='documents' AND (
  has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter')
));
CREATE POLICY "documents_staff_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id='documents' AND (
  has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'recruiter')
));
CREATE POLICY "documents_staff_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='documents' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager')));

-- branding (public read, admin write)
CREATE POLICY "branding_public_read" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id='branding');
CREATE POLICY "branding_admin_write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='branding' AND has_role(auth.uid(),'admin'));
CREATE POLICY "branding_admin_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id='branding' AND has_role(auth.uid(),'admin'));
CREATE POLICY "branding_admin_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='branding' AND has_role(auth.uid(),'admin'));
