-- Seed dummy portfolio records for Orizon Portal visualization

INSERT INTO public.orizon_portfolio_summary (total_balance, selected_range)
SELECT 25000.69, '1M'
WHERE NOT EXISTS (SELECT 1 FROM public.orizon_portfolio_summary);

WITH wallet_seed AS (
  INSERT INTO public.orizon_wallets (provider, label, balance, change_amount, change_percent, icon_key, sort_order, updated_at)
  SELECT * FROM (VALUES
    ('Coinbase', 'Coinbase', 42.50, 2.41, 5.99, 'coinbase', 1, now() - interval '56 seconds'),
    ('Trust Wallet', 'Trust wallet', 56.20, 3.18, 6.01, 'trust', 2, now() - interval '42 seconds'),
    ('MetaMask', 'Meta mask', 82.25, 4.65, 5.99, 'metamask', 3, now() - interval '38 seconds'),
    ('Crypto', 'Crypto', 120.25, 6.79, 5.98, 'crypto', 4, now() - interval '29 seconds')
  ) AS v(provider, label, balance, change_amount, change_percent, icon_key, sort_order, updated_at)
  WHERE NOT EXISTS (SELECT 1 FROM public.orizon_wallets)
  RETURNING id, icon_key
)
INSERT INTO public.orizon_wallet_sparkline (wallet_id, point_index, value)
SELECT w.id, s.point_index, s.value
FROM wallet_seed w
JOIN (VALUES
  ('coinbase', 0, 38.2), ('coinbase', 1, 39.1), ('coinbase', 2, 40.0), ('coinbase', 3, 41.2), ('coinbase', 4, 42.5),
  ('trust', 0, 50.1), ('trust', 1, 51.4), ('trust', 2, 52.8), ('trust', 3, 54.6), ('trust', 4, 56.2),
  ('metamask', 0, 74.0), ('metamask', 1, 76.2), ('metamask', 2, 78.1), ('metamask', 3, 80.4), ('metamask', 4, 82.25),
  ('crypto', 0, 108.0), ('crypto', 1, 111.5), ('crypto', 2, 114.2), ('crypto', 3, 117.8), ('crypto', 4, 120.25)
) AS s(icon_key, point_index, value) ON s.icon_key = w.icon_key
WHERE NOT EXISTS (SELECT 1 FROM public.orizon_wallet_sparkline);

WITH holding_seed AS (
  INSERT INTO public.orizon_holdings (symbol, name, network, current_value, change_percent, icon_key, icon_bg, icon_color, sort_order)
  SELECT * FROM (VALUES
    ('NEAR', 'Near', 'Near Protocol', 1.98, 6.5, 'near', '#d9ff32', '#111111', 1),
    ('BTC', 'BTC', 'Bitcoin', 1.44, 5.29, 'btc', '#ff9900', '#ffffff', 2)
  ) AS v(symbol, name, network, current_value, change_percent, icon_key, icon_bg, icon_color, sort_order)
  WHERE NOT EXISTS (SELECT 1 FROM public.orizon_holdings)
  RETURNING id, icon_key
)
INSERT INTO public.orizon_holding_sparkline (holding_id, point_index, value)
SELECT h.id, s.point_index, s.value
FROM holding_seed h
JOIN (VALUES
  ('near', 0, 1.72), ('near', 1, 1.78), ('near', 2, 1.84), ('near', 3, 1.91), ('near', 4, 1.98),
  ('btc', 0, 1.28), ('btc', 1, 1.31), ('btc', 2, 1.35), ('btc', 3, 1.39), ('btc', 4, 1.44)
) AS s(icon_key, point_index, value) ON s.icon_key = h.icon_key
WHERE NOT EXISTS (SELECT 1 FROM public.orizon_holding_sparkline);

INSERT INTO public.orizon_balance_history (range_key, point_index, label, value, is_active)
SELECT r.range_key, r.point_index, r.label, r.value, r.is_active
FROM (VALUES
  ('1M', 0, 'W1', 23800.00, false),
  ('1M', 1, 'W2', 24120.50, false),
  ('1M', 2, 'W3', 24450.25, false),
  ('1M', 3, 'W4', 24780.10, true),
  ('1M', 4, 'W5', 25000.69, false),
  ('1W', 0, 'Mon', 24800.00, false),
  ('1W', 1, 'Tue', 24920.00, false),
  ('1W', 2, 'Wed', 24750.00, true),
  ('1W', 3, 'Thu', 24980.00, false),
  ('1W', 4, 'Fri', 25000.69, false)
) AS r(range_key, point_index, label, value, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.orizon_balance_history WHERE range_key = r.range_key);
