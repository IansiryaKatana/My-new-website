-- Orizon Portfolio Dashboard schema

CREATE TABLE IF NOT EXISTS public.orizon_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  label text NOT NULL,
  balance numeric(18,2) NOT NULL DEFAULT 0,
  change_amount numeric(18,2) NOT NULL DEFAULT 0,
  change_percent numeric(8,2) NOT NULL DEFAULT 0,
  icon_key text NOT NULL DEFAULT 'wallet',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orizon_wallet_sparkline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.orizon_wallets(id) ON DELETE CASCADE,
  point_index int NOT NULL,
  value numeric(18,4) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_id, point_index)
);

CREATE TABLE IF NOT EXISTS public.orizon_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  name text NOT NULL,
  network text,
  current_value numeric(18,2) NOT NULL DEFAULT 0,
  change_percent numeric(8,2) NOT NULL DEFAULT 0,
  icon_key text NOT NULL DEFAULT 'asset',
  icon_bg text NOT NULL DEFAULT '#111111',
  icon_color text NOT NULL DEFAULT '#ffffff',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orizon_holding_sparkline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holding_id uuid NOT NULL REFERENCES public.orizon_holdings(id) ON DELETE CASCADE,
  point_index int NOT NULL,
  value numeric(18,4) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(holding_id, point_index)
);

CREATE TABLE IF NOT EXISTS public.orizon_balance_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  range_key text NOT NULL CHECK (range_key IN ('1W','1M','3M','6M','YTD','1Y')),
  point_index int NOT NULL,
  label text,
  value numeric(18,2) NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(range_key, point_index)
);

CREATE TABLE IF NOT EXISTS public.orizon_portfolio_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_balance numeric(18,2) NOT NULL DEFAULT 0,
  selected_range text NOT NULL DEFAULT '1M' CHECK (selected_range IN ('1W','1M','3M','6M','YTD','1Y')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orizon_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orizon_wallet_sparkline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orizon_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orizon_holding_sparkline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orizon_balance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orizon_portfolio_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read orizon_wallets" ON public.orizon_wallets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read orizon_wallet_sparkline" ON public.orizon_wallet_sparkline FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read orizon_holdings" ON public.orizon_holdings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read orizon_holding_sparkline" ON public.orizon_holding_sparkline FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read orizon_balance_history" ON public.orizon_balance_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read orizon_portfolio_summary" ON public.orizon_portfolio_summary FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON public.orizon_wallets TO anon, authenticated;
GRANT SELECT ON public.orizon_wallet_sparkline TO anon, authenticated;
GRANT SELECT ON public.orizon_holdings TO anon, authenticated;
GRANT SELECT ON public.orizon_holding_sparkline TO anon, authenticated;
GRANT SELECT ON public.orizon_balance_history TO anon, authenticated;
GRANT SELECT ON public.orizon_portfolio_summary TO anon, authenticated;
