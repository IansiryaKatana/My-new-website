
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE public.uae_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  bank_code text,
  swift_code text,
  routing_code text,
  country text NOT NULL DEFAULT 'AE',
  emirate text,
  logo_url text,
  website text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.uae_banks TO anon, authenticated;
GRANT ALL ON public.uae_banks TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.uae_banks TO authenticated;

ALTER TABLE public.uae_banks ENABLE ROW LEVEL SECURITY;

CREATE POLICY banks_select_all ON public.uae_banks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY banks_write_admin ON public.uae_banks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_uae_banks_active ON public.uae_banks(is_active);
CREATE INDEX idx_uae_banks_name_trgm ON public.uae_banks USING gin (name gin_trgm_ops);

CREATE TRIGGER trg_uae_banks_updated BEFORE UPDATE ON public.uae_banks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.uae_banks (name, short_name, bank_code, swift_code, emirate, website) VALUES
('Emirates NBD Bank', 'ENBD', 'EBIL', 'EBILAEAD', 'Dubai', 'https://www.emiratesnbd.com'),
('First Abu Dhabi Bank', 'FAB', 'NBAD', 'NBADAEAA', 'Abu Dhabi', 'https://www.bankfab.com'),
('Abu Dhabi Commercial Bank', 'ADCB', 'ADCB', 'ADCBAEAA', 'Abu Dhabi', 'https://www.adcb.com'),
('Dubai Islamic Bank', 'DIB', 'DUIB', 'DUIBAEAD', 'Dubai', 'https://www.dib.ae'),
('Abu Dhabi Islamic Bank', 'ADIB', 'ABDI', 'ABDIAEAD', 'Abu Dhabi', 'https://www.adib.ae'),
('Mashreq Bank', 'Mashreq', 'BOML', 'BOMLAEAD', 'Dubai', 'https://www.mashreqbank.com'),
('Commercial Bank of Dubai', 'CBD', 'CBDU', 'CBDUAEAD', 'Dubai', 'https://www.cbd.ae'),
('RAKBANK', 'RAKBANK', 'NRAK', 'NRAKAEAK', 'Ras Al Khaimah', 'https://www.rakbank.ae'),
('Emirates Islamic Bank', 'EI', 'MEBL', 'MEBLAEAD', 'Dubai', 'https://www.emiratesislamic.ae'),
('Sharjah Islamic Bank', 'SIB', 'NBSH', 'NBSHAEAS', 'Sharjah', 'https://www.sib.ae'),
('Bank of Sharjah', 'BOS', 'BSHJ', 'BSHJAESH', 'Sharjah', 'https://www.bankofsharjah.com'),
('National Bank of Fujairah', 'NBF', 'NBFU', 'NBFUAEAF', 'Fujairah', 'https://www.nbf.ae'),
('United Arab Bank', 'UAB', 'UABL', 'UABLAEAA', 'Sharjah', 'https://www.uab.ae'),
('Ajman Bank', 'AJB', 'AJMA', 'AJMAAEAJ', 'Ajman', 'https://www.ajmanbank.ae'),
('Al Hilal Bank', 'AHB', 'ALHI', 'ALHIAEAA', 'Abu Dhabi', 'https://www.alhilalbank.ae'),
('HSBC Bank Middle East', 'HSBC', 'BBME', 'BBMEAEAD', 'Dubai', 'https://www.hsbc.ae'),
('Standard Chartered Bank UAE', 'SCB', 'SCBL', 'SCBLAEAD', 'Dubai', 'https://www.sc.com/ae'),
('Citibank UAE', 'Citi', 'CITI', 'CITIAEAD', 'Dubai', 'https://www.citibank.ae'),
('Wio Bank', 'Wio', 'WIOB', 'WIOBAEAA', 'Abu Dhabi', 'https://www.wio.io'),
('Liv Bank', 'Liv', 'LIVB', NULL, 'Dubai', 'https://www.liv.me');

CREATE OR REPLACE FUNCTION public.search_uae_banks(_q text DEFAULT '', _active_only boolean DEFAULT true, _limit int DEFAULT 50)
RETURNS TABLE(id uuid, name text, short_name text, swift_code text, routing_code text, bank_code text, emirate text, logo_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT b.id, b.name, b.short_name, b.swift_code, b.routing_code, b.bank_code, b.emirate, b.logo_url
  FROM public.uae_banks b
  WHERE (NOT _active_only OR b.is_active)
    AND (_q = '' OR b.name ILIKE '%'||_q||'%' OR b.short_name ILIKE '%'||_q||'%'
         OR b.swift_code ILIKE '%'||_q||'%' OR b.routing_code ILIKE '%'||_q||'%' OR b.bank_code ILIKE '%'||_q||'%')
  ORDER BY b.name
  LIMIT _limit;
$$;

CREATE OR REPLACE FUNCTION public.search_staff(_q text DEFAULT '', _role app_role DEFAULT NULL, _active_only boolean DEFAULT true, _limit int DEFAULT 50)
RETURNS TABLE(id uuid, full_name text, email text, phone text, avatar_url text, job_title text, is_active boolean, roles text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.email, p.phone, p.avatar_url, p.job_title, p.is_active,
    COALESCE(ARRAY(SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.id), ARRAY[]::text[]) AS roles
  FROM public.profiles p
  WHERE (NOT _active_only OR p.is_active)
    AND (_q = '' OR p.full_name ILIKE '%'||_q||'%' OR p.email ILIKE '%'||_q||'%' OR p.phone ILIKE '%'||_q||'%')
    AND (_role IS NULL OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = _role))
  ORDER BY p.full_name NULLS LAST
  LIMIT _limit;
$$;

GRANT EXECUTE ON FUNCTION public.search_uae_banks(text, boolean, int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_staff(text, app_role, boolean, int) TO authenticated;
