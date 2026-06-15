-- Full CMS seed (idempotent). Run in Supabase SQL Editor after migrations.

-- Site settings (including hero/FAQ/CTA images)
insert into public.site_settings (key, value) values
  ('brand_name', '"Marcellaro"'),
  ('hero_headline', '"LUXURY REAL ESTATE"'),
  ('hero_subheadline', '"with full service support"'),
  ('hero_trust_copy', '"We''ll find and verify truly the best option for you"'),
  ('contact_phone', '"+1 (310) 555-0487"'),
  ('contact_availability', '"available 7 days a week"'),
  ('hero_image', '"/images/hero-L.png"'),
  ('faq_image', '"https://images.unsplash.com/photo-1618221195710-e3f330b0e0f0?w=800&q=80"'),
  ('cta_image', '"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"'),
  ('admin_primary', '"#46482f"')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Property categories
insert into public.property_categories (id, slug, label, sort_order, active) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'loft', 'Loft', 1, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 'budget', 'Budget', 2, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 'rent', 'Rent', 3, true)
on conflict (slug) do update set label = excluded.label, sort_order = excluded.sort_order, active = true;

-- Properties
insert into public.properties (
  id, slug, title, location, description, price_from, image_url, category,
  status, bedrooms, bathrooms, area_label, year_label, published, sort_order
) values
  ('11111111-1111-1111-1111-111111111101', 'family-villa', 'Family Villa', 'Malibu, California',
   'A spacious villa with a pool, living area, outdoor patio, and terrace overlooking the Pacific.',
   2950000, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80', 'loft',
   'New Listing', 5, 4, '320 m²', '25 yr', true, 1),
  ('11111111-1111-1111-1111-111111111102', 'serene-edge', 'Serene Edge', 'Malibu, California',
   'An architectural retreat with infinity pool, glass walls, and uninterrupted ocean views.',
   2470000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80', 'budget',
   'New Listing', 4, 3, '280 m²', '12 yr', true, 2),
  ('11111111-1111-1111-1111-111111111103', 'modern-hillside', 'Modern Hillside', 'Malibu, California',
   'Multi-level hillside residence with panoramic views, private gardens, and refined interiors.',
   1650000, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80', 'rent',
   'New Listing', 3, 2, '210 m²', '8 yr', true, 3)
on conflict (slug) do update set
  title = excluded.title, location = excluded.location, description = excluded.description,
  price_from = excluded.price_from, image_url = excluded.image_url, category = excluded.category,
  status = excluded.status, bedrooms = excluded.bedrooms, bathrooms = excluded.bathrooms,
  area_label = excluded.area_label, year_label = excluded.year_label, published = true,
  sort_order = excluded.sort_order, updated_at = now();

-- Hero stats (replace by label)
delete from public.hero_stats where label in ('successful deals', 'years experience', 'verified houses');
insert into public.hero_stats (id, label, value, sort_order, published) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb101', 'successful deals', '100+', 1, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb102', 'years experience', '15', 2, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb103', 'verified houses', '87', 3, true);

-- FAQ topic + entries
insert into public.faq_topics (id, title, sort_order, published) values
  ('22222222-2222-2222-2222-222222222201', 'General', 0, true)
on conflict (id) do update set title = excluded.title, published = true;

insert into public.faq_entries (id, topic_id, question, answer, sort_order, published) values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', '22222222-2222-2222-2222-222222222201',
   'How can I be sure the property is legally verified?',
   'Every listing undergoes title search, lien review, and compliance checks before it appears on our site.', 1, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', '22222222-2222-2222-2222-222222222201',
   'Why work with agents that have passed a full legal check?',
   'Our advisors are vetted for licensing, transaction history, and regulatory compliance.', 2, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff03', '22222222-2222-2222-2222-222222222201',
   'Can I buy property if I''m not from this country?',
   'Yes. We support international buyers with documentation guidance and local legal partners.', 3, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff04', '22222222-2222-2222-2222-222222222201',
   'Do I need to be present in person for the paperwork?',
   'Many steps can be handled remotely via power of attorney and digital signing where permitted.', 4, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff05', '22222222-2222-2222-2222-222222222201',
   'How long does the whole process take?',
   'Typical transactions range from 30–90 days depending on financing, inspections, and jurisdiction.', 5, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff06', '22222222-2222-2222-2222-222222222201',
   'I''m afraid of losing my money — how is this protected?',
   'Funds are held in regulated escrow accounts with milestone-based releases tied to verified milestones.', 6, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff07', '22222222-2222-2222-2222-222222222201',
   'Can I sell the property I buy?',
   'Yes. We also provide resale advisory and market positioning for owners when you''re ready to exit.', 7, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffff08', '22222222-2222-2222-2222-222222222201',
   'I don''t understand legal details — who will explain everything?',
   'Your dedicated advisor and our legal team walk you through each document in plain language.', 8, true)
on conflict (id) do update set question = excluded.question, answer = excluded.answer,
  sort_order = excluded.sort_order, published = true;

-- Team
insert into public.team_members (id, name, role, bio, image_url, bullets, published, sort_order) values
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'Natalie Brooks', 'Senior Property Advisor',
   'Specializes in coastal estates and off-market acquisitions.',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
   '["15+ years","Malibu specialist","Legal verification"]', true, 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'Daniel Merron', 'CEO & Lead Concierge',
   'Oversees end-to-end client journeys from selection to closing.',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
   '["100+ deals","International buyers","Full paperwork support"]', true, 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'Markus Bell', 'Legal & Compliance Director',
   'Ensures every property passes rigorous legal and title verification.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
   '["Title review","Escrow oversight","Risk protection"]', true, 3)
on conflict (id) do update set name = excluded.name, role = excluded.role, bio = excluded.bio,
  image_url = excluded.image_url, bullets = excluded.bullets, published = true, sort_order = excluded.sort_order;

-- Process steps
insert into public.process_steps (id, step_number, title, description, image_url, published, sort_order) values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '01', 'Property selection',
   'We curate verified options aligned with your lifestyle, budget, and investment goals.',
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', true, 1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', '02', 'Legal verification',
   'Title, liens, and compliance are reviewed before any commitment.',
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', true, 2),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', '03', 'Viewing & negotiation',
   'Private tours and discreet negotiation on your behalf.',
   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80', true, 3),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', '04', 'Paperwork & escrow',
   'We coordinate contracts, escrow, and milestone payments.',
   'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80', true, 4),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', '05', 'Closing & handover',
   'Final walkthrough, keys, and post-sale support.',
   'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80', true, 5),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee06', '06', 'Aftercare',
   'Ongoing advisory for maintenance, rental, or resale.',
   'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80', true, 6)
on conflict (id) do update set step_number = excluded.step_number, title = excluded.title,
  description = excluded.description, image_url = excluded.image_url, published = true, sort_order = excluded.sort_order;

-- Testimonials
insert into public.testimonials (
  id, client_name, client_location, title, quote, avatar_url, property_image_url,
  assigned_agent, card_type, published, sort_order
) values
  ('cccccccc-cccc-cccc-cccc-cccccccccc01', 'Sarah Mitchell', 'Beverly Hills, CA', 'Found our dream villa',
   'Marcellaro guided us through every step. The property was verified, the paperwork seamless, and the experience felt truly private.',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80', null, 'Daniel Merron', 'text', true, 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02', 'Property Preview', 'Malibu', 'Serene Edge', '',
   null, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', null, 'image', true, 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccc03', 'James Chen', 'Pacific Palisades, CA', 'International buyer confidence',
   'As a non-resident buyer, I needed legal certainty. The team explained every document and protected my investment.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80', null, 'Natalie Brooks', 'text', true, 3),
  ('cccccccc-cccc-cccc-cccc-cccccccccc04', 'Elena Rodriguez', 'Santa Monica, CA', 'From request to keys',
   'The process was transparent from day one. We always knew the next step and never felt rushed.',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80', null, 'Markus Bell', 'text', true, 4)
on conflict (id) do update set
  client_name = excluded.client_name, client_location = excluded.client_location,
  title = excluded.title, quote = excluded.quote, avatar_url = excluded.avatar_url,
  property_image_url = excluded.property_image_url, assigned_agent = excluded.assigned_agent,
  card_type = excluded.card_type, published = true, sort_order = excluded.sort_order;

-- Marketing blocks
insert into public.marketing_blocks (id, key, title, body, cta_label, cta_href, published) values
  ('99999999-9999-9999-9999-999999999901', 'quote_pause', 'We''ve seen all misleading labels.',
   'Not perfect option and we will show some listings', 'GET IN TOUCH', '#contact', true),
  ('99999999-9999-9999-9999-999999999902', 'filter_helper', null,
   'Select your way · Make a request · Watch your project', null, null, true)
on conflict (key) do update set title = excluded.title, body = excluded.body,
  cta_label = excluded.cta_label, cta_href = excluded.cta_href, published = true;

-- RPC (safe to re-run)
create or replace function public.get_public_cms_snapshot()
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  return jsonb_build_object(
    'properties', coalesce((select jsonb_agg(to_jsonb(p) order by p.sort_order) from public.properties p where p.published = true), '[]'::jsonb),
    'testimonials', coalesce((select jsonb_agg(to_jsonb(t) order by t.sort_order) from public.testimonials t where t.published = true), '[]'::jsonb),
    'team_members', coalesce((select jsonb_agg(to_jsonb(m) order by m.sort_order) from public.team_members m where m.published = true), '[]'::jsonb),
    'faq_entries', coalesce((select jsonb_agg(to_jsonb(f) order by f.sort_order) from public.faq_entries f where f.published = true), '[]'::jsonb),
    'process_steps', coalesce((select jsonb_agg(to_jsonb(s) order by s.sort_order) from public.process_steps s where s.published = true), '[]'::jsonb),
    'hero_stats', coalesce((select jsonb_agg(to_jsonb(h) order by h.sort_order) from public.hero_stats h where h.published = true), '[]'::jsonb),
    'marketing_blocks', coalesce((select jsonb_agg(to_jsonb(b) order by b.key) from public.marketing_blocks b where b.published = true), '[]'::jsonb),
    'site_settings', coalesce((select jsonb_agg(jsonb_build_object('key', ss.key, 'value', ss.value) order by ss.key) from public.site_settings ss), '[]'::jsonb),
    'property_categories', coalesce((select jsonb_agg(to_jsonb(c) order by c.sort_order) from public.property_categories c where c.active = true), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_public_cms_snapshot() from public;
grant execute on function public.get_public_cms_snapshot() to anon, authenticated;
