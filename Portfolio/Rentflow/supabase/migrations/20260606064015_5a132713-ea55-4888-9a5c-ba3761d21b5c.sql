
-- =====================================================================
-- ENUMS
-- =====================================================================
CREATE TYPE public.app_role AS ENUM ('owner', 'agent', 'tenant');
CREATE TYPE public.property_status AS ENUM ('draft', 'available', 'reserved', 'rented', 'off_market');
CREATE TYPE public.property_type AS ENUM ('apartment', 'villa', 'townhouse', 'penthouse', 'studio', 'office', 'retail');
CREATE TYPE public.viewing_status AS ENUM ('requested', 'confirmed', 'completed', 'no_show', 'cancelled');
CREATE TYPE public.application_status AS ENUM ('submitted', 'docs_review', 'contract_sent', 'approved', 'rejected', 'withdrawn');
CREATE TYPE public.document_type AS ENUM ('emirates_id', 'passport', 'visa', 'salary_certificate', 'bank_statement', 'trade_license', 'other');
CREATE TYPE public.tenancy_status AS ENUM ('upcoming', 'active', 'notice_given', 'ended', 'terminated');
CREATE TYPE public.payment_type AS ENUM ('rent', 'security_deposit', 'agency_fee', 'ejari_fee', 'dewa_deposit', 'chiller_deposit', 'other');
CREATE TYPE public.payment_status AS ENUM ('scheduled', 'pending', 'cleared', 'bounced', 'paid', 'refunded', 'cancelled');
CREATE TYPE public.payment_method AS ENUM ('cheque', 'bank_transfer', 'card', 'cash', 'stripe');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'awaiting_tenant', 'resolved', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.renewal_status AS ENUM ('pending', 'offered', 'accepted', 'declined', 'expired');

-- =====================================================================
-- UPDATED_AT TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- =====================================================================
-- PROFILES
-- =====================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  emirates_id TEXT,
  nationality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================================
-- USER ROLES
-- =====================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('owner','agent'))
$$;

-- =====================================================================
-- AUTO PROFILE + FIRST-OWNER BOOTSTRAP
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_first BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'phone'
  );

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner') INTO is_first;

  IF is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'tenant');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Staff view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Staff update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));

-- User roles policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owners view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'owner'));

-- =====================================================================
-- AGENCY SETTINGS (single row)
-- =====================================================================
CREATE TABLE public.agency_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  agency_name TEXT NOT NULL DEFAULT 'My Agency',
  legal_name TEXT,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#C9A35B',
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  vat_number TEXT,
  trade_license TEXT,
  rera_number TEXT,
  ejari_contact TEXT,
  stripe_account_id TEXT,
  stripe_charges_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_payouts_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_country TEXT DEFAULT 'AE',
  currency TEXT NOT NULL DEFAULT 'AED',
  default_agency_fee_pct NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  default_security_deposit_pct NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.agency_settings (id) VALUES (1);
GRANT SELECT ON public.agency_settings TO anon, authenticated;
GRANT UPDATE ON public.agency_settings TO authenticated;
GRANT ALL ON public.agency_settings TO service_role;
ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view agency settings" ON public.agency_settings FOR SELECT USING (true);
CREATE POLICY "Owners update agency settings" ON public.agency_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'owner'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.agency_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================================
-- PROPERTIES
-- =====================================================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  community TEXT NOT NULL,
  sub_community TEXT,
  building TEXT,
  unit_no TEXT,
  property_type property_type NOT NULL,
  beds NUMERIC(3,1) NOT NULL DEFAULT 0,
  baths NUMERIC(3,1) NOT NULL DEFAULT 0,
  sqft INT,
  rent_yearly NUMERIC(12,2) NOT NULL,
  cheques_accepted INT NOT NULL DEFAULT 4,
  security_deposit NUMERIC(12,2),
  agency_fee NUMERIC(12,2),
  available_from DATE,
  furnished BOOLEAN NOT NULL DEFAULT FALSE,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  cover_image TEXT,
  status property_status NOT NULL DEFAULT 'draft',
  listed_by UUID REFERENCES public.profiles(id),
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view available properties" ON public.properties FOR SELECT USING (status IN ('available','reserved'));
CREATE POLICY "Staff view all properties" ON public.properties FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage properties" ON public.properties FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_properties_updated BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_community ON public.properties(community);

-- =====================================================================
-- PROPERTY IMAGES
-- =====================================================================
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.property_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT ALL ON public.property_images TO service_role;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Staff manage property images" ON public.property_images FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =====================================================================
-- VIEWINGS
-- =====================================================================
CREATE TABLE public.viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_at TIMESTAMPTZ,
  status viewing_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.viewings TO authenticated;
GRANT ALL ON public.viewings TO service_role;
ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own viewings" ON public.viewings FOR SELECT TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "Tenants create viewings" ON public.viewings FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "Tenants cancel own viewings" ON public.viewings FOR UPDATE TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "Staff manage viewings" ON public.viewings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_viewings_updated BEFORE UPDATE ON public.viewings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_viewings_status ON public.viewings(status);
CREATE INDEX idx_viewings_tenant ON public.viewings(tenant_id);

-- =====================================================================
-- APPLICATIONS
-- =====================================================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status application_status NOT NULL DEFAULT 'submitted',
  offer_amount NUMERIC(12,2) NOT NULL,
  cheques_offered INT NOT NULL DEFAULT 4,
  move_in_date DATE,
  occupants INT NOT NULL DEFAULT 1,
  employer TEXT,
  monthly_income NUMERIC(12,2),
  notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own apps" ON public.applications FOR SELECT TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "Tenants create apps" ON public.applications FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "Tenants update own pending apps" ON public.applications FOR UPDATE TO authenticated USING (tenant_id = auth.uid() AND status IN ('submitted','docs_review'));
CREATE POLICY "Staff manage applications" ON public.applications FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_apps_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_apps_status ON public.applications(status);
CREATE INDEX idx_apps_tenant ON public.applications(tenant_id);

-- =====================================================================
-- APPLICATION DOCUMENTS
-- =====================================================================
CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  doc_type document_type NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_documents TO authenticated;
GRANT ALL ON public.application_documents TO service_role;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own docs" ON public.application_documents FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.tenant_id = auth.uid()));
CREATE POLICY "Tenants upload own docs" ON public.application_documents FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.tenant_id = auth.uid()));
CREATE POLICY "Staff manage docs" ON public.application_documents FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =====================================================================
-- TENANCIES
-- =====================================================================
CREATE TABLE public.tenancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id),
  tenant_id UUID NOT NULL REFERENCES auth.users(id),
  application_id UUID REFERENCES public.applications(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  annual_rent NUMERIC(12,2) NOT NULL,
  cheques INT NOT NULL DEFAULT 4,
  security_deposit NUMERIC(12,2) NOT NULL DEFAULT 0,
  status tenancy_status NOT NULL DEFAULT 'upcoming',
  ejari_number TEXT,
  ejari_status TEXT,
  contract_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenancies TO authenticated;
GRANT ALL ON public.tenancies TO service_role;
ALTER TABLE public.tenancies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own tenancies" ON public.tenancies FOR SELECT TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "Staff manage tenancies" ON public.tenancies FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_tenancies_updated BEFORE UPDATE ON public.tenancies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_tenancies_status ON public.tenancies(status);
CREATE INDEX idx_tenancies_tenant ON public.tenancies(tenant_id);

-- =====================================================================
-- PAYMENTS
-- =====================================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID NOT NULL REFERENCES public.tenancies(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_type payment_type NOT NULL DEFAULT 'rent',
  method payment_method,
  status payment_status NOT NULL DEFAULT 'scheduled',
  cheque_no TEXT,
  bank_name TEXT,
  reference TEXT,
  paid_at TIMESTAMPTZ,
  proof_url TEXT,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own payments" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Staff manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_due ON public.payments(due_date);

-- =====================================================================
-- MAINTENANCE
-- =====================================================================
CREATE TABLE public.maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID NOT NULL REFERENCES public.tenancies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  subject TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_tickets TO authenticated;
GRANT ALL ON public.maintenance_tickets TO service_role;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own tickets" ON public.maintenance_tickets FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Tenants create tickets" ON public.maintenance_tickets FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Staff manage tickets" ON public.maintenance_tickets FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON public.maintenance_tickets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_tickets_status ON public.maintenance_tickets(status);

CREATE TABLE public.maintenance_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.maintenance_tickets(id) ON DELETE CASCADE,
  by_user UUID NOT NULL REFERENCES auth.users(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.maintenance_updates TO authenticated;
GRANT ALL ON public.maintenance_updates TO service_role;
ALTER TABLE public.maintenance_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View updates on accessible tickets" ON public.maintenance_updates FOR SELECT TO authenticated USING (
  public.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.maintenance_tickets mt JOIN public.tenancies t ON t.id = mt.tenancy_id
    WHERE mt.id = ticket_id AND t.tenant_id = auth.uid()
  )
);
CREATE POLICY "Insert updates on accessible tickets" ON public.maintenance_updates FOR INSERT TO authenticated WITH CHECK (
  by_user = auth.uid() AND (
    public.is_staff(auth.uid()) OR EXISTS (
      SELECT 1 FROM public.maintenance_tickets mt JOIN public.tenancies t ON t.id = mt.tenancy_id
      WHERE mt.id = ticket_id AND t.tenant_id = auth.uid()
    )
  )
);

-- =====================================================================
-- COMPLAINTS
-- =====================================================================
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID NOT NULL REFERENCES public.tenancies(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  severity ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own complaints" ON public.complaints FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Tenants create complaints" ON public.complaints FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Staff manage complaints" ON public.complaints FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_complaints_updated BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================================
-- RENEWALS
-- =====================================================================
CREATE TABLE public.renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenancy_id UUID NOT NULL REFERENCES public.tenancies(id) ON DELETE CASCADE,
  current_rent NUMERIC(12,2) NOT NULL,
  proposed_rent NUMERIC(12,2) NOT NULL,
  proposed_cheques INT NOT NULL DEFAULT 4,
  status renewal_status NOT NULL DEFAULT 'pending',
  offered_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.renewals TO authenticated;
GRANT ALL ON public.renewals TO service_role;
ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own renewals" ON public.renewals FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Tenants respond own renewals" ON public.renewals FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenancies t WHERE t.id = tenancy_id AND t.tenant_id = auth.uid()));
CREATE POLICY "Staff manage renewals" ON public.renewals FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_renewals_updated BEFORE UPDATE ON public.renewals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================================
-- MESSAGES (thread-style; scoped to application or tenancy)
-- =====================================================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  tenancy_id UUID REFERENCES public.tenancies(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (application_id IS NOT NULL OR tenancy_id IS NOT NULL)
);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view messages" ON public.messages FOR SELECT TO authenticated USING (
  public.is_staff(auth.uid())
  OR sender_id = auth.uid()
  OR (application_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.tenant_id = auth.uid()))
  OR (tenancy_id    IS NOT NULL AND EXISTS (SELECT 1 FROM public.tenancies   t WHERE t.id = tenancy_id    AND t.tenant_id = auth.uid()))
);
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND (
    public.is_staff(auth.uid())
    OR (application_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.tenant_id = auth.uid()))
    OR (tenancy_id    IS NOT NULL AND EXISTS (SELECT 1 FROM public.tenancies   t WHERE t.id = tenancy_id    AND t.tenant_id = auth.uid()))
  )
);

-- =====================================================================
-- ACTIVITY LOG
-- =====================================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view activity" ON public.activity_log FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Authenticated log activity" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

-- =====================================================================
-- RPC: dashboard overview
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_dashboard_overview()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result JSONB;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;

  SELECT jsonb_build_object(
    'active_tenancies', (SELECT COUNT(*) FROM tenancies WHERE status = 'active'),
    'upcoming_tenancies', (SELECT COUNT(*) FROM tenancies WHERE status = 'upcoming'),
    'available_listings', (SELECT COUNT(*) FROM properties WHERE status = 'available'),
    'total_listings', (SELECT COUNT(*) FROM properties WHERE status <> 'draft'),
    'occupancy_pct', (
      SELECT CASE WHEN COUNT(*) = 0 THEN 0 ELSE
        ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'rented') / NULLIF(COUNT(*) FILTER (WHERE status IN ('available','rented','reserved')),0), 1)
      END FROM properties WHERE status <> 'draft'
    ),
    'open_viewings', (SELECT COUNT(*) FROM viewings WHERE status IN ('requested','confirmed') AND COALESCE(scheduled_at, now()) >= now() - interval '1 day'),
    'pending_applications', (SELECT COUNT(*) FROM applications WHERE status IN ('submitted','docs_review','contract_sent')),
    'open_tickets', (SELECT COUNT(*) FROM maintenance_tickets WHERE status IN ('open','in_progress','awaiting_tenant')),
    'mtd_collected', (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status IN ('cleared','paid') AND paid_at >= date_trunc('month', now())),
    'mtd_due',       (SELECT COALESCE(SUM(amount),0) FROM payments WHERE due_date >= date_trunc('month', now()) AND due_date < date_trunc('month', now()) + interval '1 month'),
    'overdue_amount',(SELECT COALESCE(SUM(amount),0) FROM payments WHERE status IN ('scheduled','pending') AND due_date < current_date),
    'overdue_count', (SELECT COUNT(*) FROM payments WHERE status IN ('scheduled','pending') AND due_date < current_date),
    'renewals_due_60d', (SELECT COUNT(*) FROM tenancies WHERE status = 'active' AND end_date <= current_date + interval '60 days')
  ) INTO result;

  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_dashboard_overview() TO authenticated;

-- =====================================================================
-- RPC: rental funnel
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_rental_funnel()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN jsonb_build_object(
    'inquiries_30d',   (SELECT COUNT(*) FROM viewings WHERE created_at >= now() - interval '30 days'),
    'viewings_30d',    (SELECT COUNT(*) FROM viewings WHERE status = 'completed' AND updated_at >= now() - interval '30 days'),
    'applications_30d',(SELECT COUNT(*) FROM applications WHERE created_at >= now() - interval '30 days'),
    'approved_30d',    (SELECT COUNT(*) FROM applications WHERE status = 'approved' AND updated_at >= now() - interval '30 days'),
    'tenancies_30d',   (SELECT COUNT(*) FROM tenancies WHERE created_at >= now() - interval '30 days'),
    'pipeline', jsonb_build_object(
      'submitted',     (SELECT COUNT(*) FROM applications WHERE status = 'submitted'),
      'docs_review',   (SELECT COUNT(*) FROM applications WHERE status = 'docs_review'),
      'contract_sent', (SELECT COUNT(*) FROM applications WHERE status = 'contract_sent'),
      'approved',      (SELECT COUNT(*) FROM applications WHERE status = 'approved')
    )
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_rental_funnel() TO authenticated;

-- =====================================================================
-- RPC: action queue
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_action_queue()
RETURNS TABLE(kind TEXT, entity_id UUID, label TEXT, sublabel TEXT, urgency TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN QUERY
    SELECT 'viewing'::TEXT, v.id, 'Viewing request', p.title, 'high'::TEXT, v.created_at
      FROM viewings v JOIN properties p ON p.id = v.property_id
      WHERE v.status = 'requested' ORDER BY v.created_at DESC LIMIT 5;
  RETURN QUERY
    SELECT 'application'::TEXT, a.id, 'Application: ' || COALESCE(pr.full_name,'Tenant'), p.title,
           CASE WHEN a.status = 'docs_review' THEN 'medium' ELSE 'high' END, a.updated_at
      FROM applications a
      JOIN properties p ON p.id = a.property_id
      LEFT JOIN profiles pr ON pr.id = a.tenant_id
      WHERE a.status IN ('submitted','docs_review','contract_sent') ORDER BY a.updated_at DESC LIMIT 8;
  RETURN QUERY
    SELECT 'payment_overdue'::TEXT, pay.id, 'Overdue payment', p.title || ' · ' || pay.amount::text, 'high', pay.due_date::timestamptz
      FROM payments pay JOIN tenancies t ON t.id = pay.tenancy_id JOIN properties p ON p.id = t.property_id
      WHERE pay.status IN ('scheduled','pending') AND pay.due_date < current_date ORDER BY pay.due_date ASC LIMIT 5;
  RETURN QUERY
    SELECT 'ticket'::TEXT, mt.id, mt.subject, p.title,
           CASE mt.priority WHEN 'urgent' THEN 'high' WHEN 'high' THEN 'high' ELSE 'medium' END, mt.created_at
      FROM maintenance_tickets mt JOIN tenancies t ON t.id = mt.tenancy_id JOIN properties p ON p.id = t.property_id
      WHERE mt.status IN ('open','in_progress') ORDER BY mt.priority DESC, mt.created_at DESC LIMIT 5;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_action_queue() TO authenticated;

-- =====================================================================
-- RPC: payment summary
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_payment_summary()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN jsonb_build_object(
    'collected_ytd', (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status IN ('cleared','paid') AND paid_at >= date_trunc('year', now())),
    'cleared_count', (SELECT COUNT(*) FROM payments WHERE status IN ('cleared','paid')),
    'scheduled_amount', (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status IN ('scheduled','pending') AND due_date >= current_date),
    'overdue_amount', (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status IN ('scheduled','pending') AND due_date < current_date),
    'bounced_count', (SELECT COUNT(*) FROM payments WHERE status = 'bounced'),
    'bounced_amount', (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status = 'bounced'),
    'next_30d', (SELECT COALESCE(SUM(amount),0) FROM payments WHERE status IN ('scheduled','pending') AND due_date BETWEEN current_date AND current_date + interval '30 days')
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_payment_summary() TO authenticated;

-- =====================================================================
-- RPC: listing analytics
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_listing_analytics()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN jsonb_build_object(
    'by_community', (
      SELECT COALESCE(jsonb_agg(row_to_json(c)), '[]'::jsonb) FROM (
        SELECT p.community, COUNT(*) AS listings,
          COUNT(*) FILTER (WHERE p.status='rented') AS rented,
          COUNT(v.id) AS viewings,
          COUNT(a.id) AS applications,
          AVG(p.rent_yearly)::INT AS avg_rent
        FROM properties p
        LEFT JOIN viewings v ON v.property_id = p.id
        LEFT JOIN applications a ON a.property_id = p.id
        GROUP BY p.community ORDER BY listings DESC
      ) c
    ),
    'avg_time_to_lease_days', (
      SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (t.created_at - p.created_at))/86400)::numeric, 1), 0)
      FROM tenancies t JOIN properties p ON p.id = t.property_id
    )
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_listing_analytics() TO authenticated;

-- =====================================================================
-- RPC: tenant journey timeline
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_tenant_journey(_tenancy_id UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE t RECORD; tid UUID;
BEGIN
  SELECT * INTO t FROM tenancies WHERE id = _tenancy_id;
  IF t IS NULL THEN RAISE EXCEPTION 'Tenancy not found'; END IF;
  IF NOT (public.is_staff(auth.uid()) OR t.tenant_id = auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;

  RETURN jsonb_build_object(
    'tenancy', to_jsonb(t),
    'payments', (SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.due_date), '[]'::jsonb) FROM payments p WHERE p.tenancy_id = _tenancy_id),
    'tickets',  (SELECT COALESCE(jsonb_agg(to_jsonb(m) ORDER BY m.created_at DESC), '[]'::jsonb) FROM maintenance_tickets m WHERE m.tenancy_id = _tenancy_id),
    'renewals', (SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.created_at DESC), '[]'::jsonb) FROM renewals r WHERE r.tenancy_id = _tenancy_id),
    'complaints',(SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.created_at DESC), '[]'::jsonb) FROM complaints c WHERE c.tenancy_id = _tenancy_id)
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_tenant_journey(UUID) TO authenticated;

-- =====================================================================
-- RPC: tenant home (for tenant portal)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_tenant_home()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN jsonb_build_object(
    'tenancies', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', t.id, 'status', t.status, 'start_date', t.start_date, 'end_date', t.end_date,
        'annual_rent', t.annual_rent, 'cheques', t.cheques, 'ejari_number', t.ejari_number,
        'property', jsonb_build_object('id',p.id,'title',p.title,'community',p.community,'building',p.building,'unit_no',p.unit_no,'cover_image',p.cover_image)
      ) ORDER BY t.start_date DESC), '[]'::jsonb)
      FROM tenancies t JOIN properties p ON p.id = t.property_id WHERE t.tenant_id = uid
    ),
    'applications', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', a.id, 'status', a.status, 'created_at', a.created_at, 'offer_amount', a.offer_amount,
        'property', jsonb_build_object('id',p.id,'title',p.title,'community',p.community,'cover_image',p.cover_image)
      ) ORDER BY a.created_at DESC), '[]'::jsonb)
      FROM applications a JOIN properties p ON p.id = a.property_id WHERE a.tenant_id = uid
    ),
    'viewings', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', v.id, 'status', v.status, 'scheduled_at', v.scheduled_at,
        'property', jsonb_build_object('id',p.id,'title',p.title,'community',p.community,'cover_image',p.cover_image)
      ) ORDER BY COALESCE(v.scheduled_at, v.created_at) DESC), '[]'::jsonb)
      FROM viewings v JOIN properties p ON p.id = v.property_id WHERE v.tenant_id = uid
    ),
    'upcoming_payments', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', pay.id, 'due_date', pay.due_date, 'amount', pay.amount, 'status', pay.status, 'payment_type', pay.payment_type,
        'property_title', p.title
      ) ORDER BY pay.due_date ASC), '[]'::jsonb)
      FROM payments pay JOIN tenancies t ON t.id = pay.tenancy_id JOIN properties p ON p.id = t.property_id
      WHERE t.tenant_id = uid AND pay.status IN ('scheduled','pending') AND pay.due_date <= current_date + interval '90 days'
    ),
    'open_tickets', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', mt.id, 'subject', mt.subject, 'status', mt.status, 'priority', mt.priority, 'created_at', mt.created_at
      ) ORDER BY mt.created_at DESC), '[]'::jsonb)
      FROM maintenance_tickets mt JOIN tenancies t ON t.id = mt.tenancy_id
      WHERE t.tenant_id = uid AND mt.status IN ('open','in_progress','awaiting_tenant')
    )
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_tenant_home() TO authenticated;

-- =====================================================================
-- RPC: generate payment schedule for a new tenancy
-- =====================================================================
CREATE OR REPLACE FUNCTION public.generate_payment_schedule(_tenancy_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t RECORD; i INT; cheque_amount NUMERIC; months_each NUMERIC; due DATE; inserted INT := 0;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT * INTO t FROM tenancies WHERE id = _tenancy_id;
  IF t IS NULL THEN RAISE EXCEPTION 'Tenancy not found'; END IF;
  DELETE FROM payments WHERE tenancy_id = _tenancy_id AND status = 'scheduled' AND payment_type = 'rent';
  cheque_amount := ROUND(t.annual_rent / t.cheques, 2);
  months_each := 12.0 / t.cheques;
  FOR i IN 0..(t.cheques - 1) LOOP
    due := (t.start_date + (i * months_each * interval '1 month'))::date;
    INSERT INTO payments (tenancy_id, due_date, amount, payment_type, status, method)
    VALUES (_tenancy_id, due, cheque_amount, 'rent', 'scheduled', 'cheque');
    inserted := inserted + 1;
  END LOOP;
  RETURN inserted;
END;
$$;
GRANT EXECUTE ON FUNCTION public.generate_payment_schedule(UUID) TO authenticated;

-- =====================================================================
-- RPC: bootstrap first owner (idempotent helper)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.bootstrap_first_owner()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN FALSE; END IF;
  IF EXISTS (SELECT 1 FROM user_roles WHERE role='owner') THEN RETURN FALSE; END IF;
  INSERT INTO user_roles (user_id, role) VALUES (uid, 'owner') ON CONFLICT DO NOTHING;
  DELETE FROM user_roles WHERE user_id = uid AND role = 'tenant';
  RETURN TRUE;
END;
$$;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_owner() TO authenticated;
