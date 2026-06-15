-- Enum values must be committed before use (separate migration from policies/functions).

DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE 'pro'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE 'payroll_officer'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE 'agent'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
