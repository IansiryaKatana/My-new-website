-- Seed Valence Capital CMS with PRD default content
-- Run after migrations

insert into public.hero_content (
  id, logo_text, title_line_one, title_line_two, intro_text, statement,
  background_image_url, primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href, published
) values (
  '00000000-0000-0000-0000-000000000001',
  'Valence Capital', 'Valence', 'Capital',
  'Valence Capital is a private investment firm focused on building long-term conviction across capital markets.',
  E'Long-Term Capital.\nClear Conviction.',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
  'Submit Opportunity', '#submit', 'Let''s Talk', '#contact', true
) on conflict (id) do update set updated_at = now();

insert into public.navigation_items (id, label, href, sort_order, published) values
  ('00000000-0000-0000-0001-000000000001', 'Home', '#', 0, true),
  ('00000000-0000-0000-0001-000000000002', 'About Us', '#about', 1, true),
  ('00000000-0000-0000-0001-000000000003', 'Works', '#works', 2, true),
  ('00000000-0000-0000-0001-000000000004', 'Process', '#process', 3, true),
  ('00000000-0000-0000-0001-000000000005', 'FAQ', '#faq', 4, true)
on conflict (id) do nothing;

insert into public.logo_strip (id, label, published) values
  ('00000000-0000-0000-0002-000000000001', 'Trusted by Industry Leaders', true)
on conflict (id) do nothing;

insert into public.trusted_logos (id, name, alt_text, sort_order, published) values
  ('00000000-0000-0000-0003-000000000001', 'Morgan Stanley', 'Morgan Stanley', 0, true),
  ('00000000-0000-0000-0003-000000000002', 'KPMG', 'KPMG', 1, true),
  ('00000000-0000-0000-0003-000000000003', 'Bloomberg', 'Bloomberg', 2, true),
  ('00000000-0000-0000-0003-000000000004', 'Deloitte', 'Deloitte', 3, true),
  ('00000000-0000-0000-0003-000000000005', 'Prudential', 'Prudential', 4, true),
  ('00000000-0000-0000-0003-000000000006', 'Forbes', 'Forbes', 5, true)
on conflict (id) do nothing;

insert into public.perspective_section (id, eyebrow, title, description, image_url, published) values (
  '00000000-0000-0000-0004-000000000001',
  'Perspective', 'The Valence Perspective',
  'We invest with patience and discipline, seeking alignment with partners who share our commitment to long-term value creation.',
  'https://images.unsplash.com/photo-1487958449943-242f94e3a918?w=1600&q=80', true
) on conflict (id) do nothing;

insert into public.principles (id, number, title, description, sort_order, published) values
  ('00000000-0000-0000-0005-000000000001', '01', 'Patience', 'We measure success in years, not quarters.', 0, true),
  ('00000000-0000-0000-0005-000000000002', '02', 'Risk', 'Risk management is embedded in every decision.', 1, true),
  ('00000000-0000-0000-0005-000000000003', '03', 'Alignment', 'We partner with teams who share our long-term orientation.', 2, true)
on conflict (id) do nothing;

insert into public.portfolio_section (id, eyebrow, title, intro_text, published) values (
  '00000000-0000-0000-0006-000000000001', 'Selected Work', 'Built on Principle',
  'Our portfolio reflects companies and assets where structural advantages converge.', true
) on conflict (id) do nothing;

insert into public.portfolio_projects (id, name, slug, description, image_large_url, image_side_url, project_url, is_featured, sort_order, published) values
  ('00000000-0000-0000-0007-000000000001', 'Mayweather Holdings', 'mayweather-holdings', '', '', '', '#', false, 0, true),
  ('00000000-0000-0000-0007-000000000002', 'Berto Investments Group', 'berto-investments', '', '', '', '#', false, 1, true),
  ('00000000-0000-0000-0007-000000000003', 'Atlas Industrial Holdings', 'atlas-industrial', 'A diversified industrial platform spanning manufacturing and infrastructure.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80', '#', true, 2, true),
  ('00000000-0000-0000-0007-000000000004', 'Intersummit Systems', 'intersummit-systems', '', '', '', '#', false, 3, true),
  ('00000000-0000-0000-0007-000000000005', 'Cascade Timber Reserve', 'cascade-timber', '', '', '', '#', false, 4, true),
  ('00000000-0000-0000-0007-000000000006', 'Harbour Logistics Capital', 'harbour-logistics', '', '', '', '#', false, 5, true)
on conflict (id) do nothing;

insert into public.image_break (id, image_url, alt_text, published) values (
  '00000000-0000-0000-0008-000000000001',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
  'Glass skyscrapers', true
) on conflict (id) do nothing;

insert into public.investment_approach (id, eyebrow, title, description, published) values (
  '00000000-0000-0000-0009-000000000001', 'Process', 'Investment Approach',
  'Our framework spans public and private markets with a focus on durable cash flows.', true
) on conflict (id) do nothing;

insert into public.investment_approach_items (id, number, title, description, sort_order, published) values
  ('00000000-0000-0000-000a-000000000001', '01', 'Public Markets', 'Selective exposure to listed equities and credit.', 0, true),
  ('00000000-0000-0000-000a-000000000002', '02', 'Private Equity', 'Control and growth investments over multi-year horizons.', 1, true),
  ('00000000-0000-0000-000a-000000000003', '03', 'Real Assets', 'Infrastructure, real estate, and natural resources.', 2, true)
on conflict (id) do nothing;

insert into public.final_cta (id, heading, button_label, button_href, background_image_url, published) values (
  '00000000-0000-0000-000b-000000000001',
  'Our Commitment to Create Long-Term Value Through Strategic Partnerships and Focused Investments',
  'Submit Opportunity', '#submit',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80', true
) on conflict (id) do nothing;

insert into public.footer_content (id, statement, wordmark, published) values (
  '00000000-0000-0000-000c-000000000001',
  'Building long-term conviction through disciplined capital allocation and strategic partnerships.',
  'VALENCE', true
) on conflict (id) do nothing;

insert into public.site_settings (key, value) values
  ('siteName', '"Valence Capital"'::jsonb),
  ('adminPrimary', '"#061426"'::jsonb)
on conflict (key) do update set value = excluded.value;
