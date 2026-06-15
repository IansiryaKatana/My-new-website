-- Seed published content for Luxury R (run after migration)

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
on conflict (slug) do nothing;

insert into public.hero_stats (label, value, sort_order, published) values
  ('successful deals', '100+', 1, true),
  ('years experience', '15', 2, true),
  ('verified houses', '87', 3, true);

insert into public.faq_topics (id, title, sort_order, published) values
  ('22222222-2222-2222-2222-222222222201', 'General', 0, true)
on conflict (id) do nothing;

insert into public.faq_entries (topic_id, question, answer, sort_order, published) values
  ('22222222-2222-2222-2222-222222222201', 'How can I be sure the property is legally verified?',
   'Every listing undergoes title search, lien review, and compliance checks before publication.', 1, true),
  ('22222222-2222-2222-2222-222222222201', 'Can I buy property if I''m not from this country?',
   'Yes. We support international buyers with documentation guidance and local legal partners.', 2, true);

insert into public.team_members (name, role, bio, image_url, bullets, published, sort_order) values
  ('Natalie Brooks', 'Senior Property Advisor', 'Coastal estates specialist.',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', '["15+ years","Malibu specialist"]', true, 1),
  ('Daniel Merron', 'CEO & Lead Concierge', 'End-to-end client journeys.',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80', '["100+ deals","International buyers"]', true, 2),
  ('Markus Bell', 'Legal Director', 'Title and compliance oversight.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80', '["Title review","Escrow oversight"]', true, 3);

insert into public.process_steps (step_number, title, description, image_url, published, sort_order) values
  ('01', 'Property selection', 'Curated verified options for your goals.',
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', true, 1),
  ('02', 'Legal verification', 'Title and compliance review.', null, true, 2),
  ('03', 'Viewing & negotiation', 'Private tours and discreet negotiation.', null, true, 3);

insert into public.testimonials (client_name, client_location, title, quote, avatar_url, card_type, published, sort_order) values
  ('Sarah Mitchell', 'Beverly Hills, CA', 'Found our dream villa',
   'Marcellaro guided us through every step with a truly private experience.',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80', 'text', true, 1);

insert into public.marketing_blocks (key, title, body, cta_label, cta_href, published) values
  ('quote_pause', 'We''ve seen all misleading labels.', 'Not perfect option and we will show some listings', 'GET IN TOUCH', '#contact', true),
  ('filter_helper', null, 'Select your way · Make a request · Watch your project', null, null, true)
on conflict (key) do nothing;
