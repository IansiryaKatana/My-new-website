-- NGUNJUK Matcha Cafe CMS schema

create extension if not exists "pgcrypto";

-- Site settings (key-value branding & copy)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Products catalog
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description_html text not null default '',
  image_url text not null default '',
  price numeric(10,2),
  category text not null default 'signature' check (category in ('ceremonial', 'seasonal', 'signature')),
  flavor text,
  is_featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  cta_href text not null default '/menu',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Benefit marquee items
create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Navigation
create table if not exists public.nav_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  is_highlighted boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Landing page sections (hero, essence, promo, flavor, footer)
create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  body text not null,
  image_url text not null default '',
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Form submissions / newsletter
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null default 'newsletter' check (form_type in ('newsletter', 'contact', 'order')),
  email text not null,
  payload jsonb not null default '{}'::jsonb,
  source text not null default 'footer',
  created_at timestamptz not null default now()
);

-- CMS media index
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  public_url text not null,
  storage_path text not null,
  folder text not null default 'general',
  kind text not null default 'image' check (kind in ('image', 'video', 'other')),
  alt_text text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Admin users (RBAC)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean not null default true,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Marketing pages
create table if not exists public.marketing_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body_html text not null default '',
  meta jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Campaign popups
create table if not exists public.campaign_popups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_html text not null default '',
  image_url text not null default '',
  cta_text text not null default '',
  cta_href text not null default '',
  trigger_rules jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists products_published_idx on public.products (published, sort_order);
create index if not exists benefits_sort_idx on public.benefits (sort_order);
create index if not exists nav_items_sort_idx on public.nav_items (sort_order);
create index if not exists form_submissions_created_idx on public.form_submissions (created_at desc);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create trigger admin_users_updated_at before update on public.admin_users
  for each row execute function public.set_updated_at();

-- RLS
alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.benefits enable row level security;
alter table public.nav_items enable row level security;
alter table public.content_sections enable row level security;
alter table public.testimonials enable row level security;
alter table public.form_submissions enable row level security;
alter table public.cms_media enable row level security;
alter table public.admin_users enable row level security;
alter table public.marketing_pages enable row level security;
alter table public.campaign_popups enable row level security;

-- Helper: is active admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.is_active = true
      and au.role in ('owner', 'admin', 'editor')
      and (
        au.auth_user_id = (select auth.uid())
        or lower(au.email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
      )
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Public read policies (published content)
create policy "public_read_site_settings" on public.site_settings for select to anon, authenticated using (true);
create policy "public_read_products" on public.products for select to anon, authenticated using (published = true);
create policy "public_read_benefits" on public.benefits for select to anon, authenticated using (published = true);
create policy "public_read_nav" on public.nav_items for select to anon, authenticated using (published = true);
create policy "public_read_sections" on public.content_sections for select to anon, authenticated using (published = true);
create policy "public_read_testimonials" on public.testimonials for select to anon, authenticated using (published = true and status = 'approved');
create policy "public_read_pages" on public.marketing_pages for select to anon, authenticated using (published = true);
create policy "public_read_popups" on public.campaign_popups for select to anon, authenticated using (published = true);
create policy "public_read_media" on public.cms_media for select to anon, authenticated using (true);

-- Public insert newsletter
create policy "public_insert_submissions" on public.form_submissions for insert to anon, authenticated with check (true);

-- Admin write policies
create policy "admin_all_site_settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_benefits" on public.benefits for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_nav" on public.nav_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_sections" on public.content_sections for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_testimonials" on public.testimonials for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_read_submissions" on public.form_submissions for select to authenticated using (public.is_admin());
create policy "admin_delete_submissions" on public.form_submissions for delete to authenticated using (public.is_admin());
create policy "admin_all_media" on public.cms_media for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_read_admin_users" on public.admin_users for select to authenticated using (public.is_admin() or auth_user_id = (select auth.uid()));
create policy "admin_write_admin_users" on public.admin_users for all to authenticated using (
  exists (select 1 from public.admin_users au where au.auth_user_id = (select auth.uid()) and au.is_active and au.role in ('owner', 'admin'))
) with check (
  exists (select 1 from public.admin_users au where au.auth_user_id = (select auth.uid()) and au.is_active and au.role in ('owner', 'admin'))
);
create policy "admin_all_pages" on public.marketing_pages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_popups" on public.campaign_popups for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket (run via dashboard or storage migration)
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

create policy "public_read_cms_media_storage" on storage.objects for select to anon, authenticated
  using (bucket_id = 'cms-media');

create policy "admin_upload_cms_media" on storage.objects for all to authenticated
  using (bucket_id = 'cms-media' and public.is_admin())
  with check (bucket_id = 'cms-media' and public.is_admin());

-- Seed default content
insert into public.site_settings (key, value) values
  ('brand', '{"name":"NGUNJUK","tagline":"Matcha On Perfect","primaryColor":"#103b27","limeColor":"#e8f33f","creamColor":"#f7f0da"}'::jsonb),
  ('integrations', '{"newsletterEnabled":true}'::jsonb)
on conflict (key) do nothing;

insert into public.benefits (label, sort_order)
select v.label, v.sort_order
from (values
  ('Clean Energy', 1),
  ('No Crash', 2),
  ('Antioxidant Rich', 3),
  ('Naturally Calming', 4),
  ('Premium Matcha', 5)
) as v(label, sort_order)
where not exists (select 1 from public.benefits b where b.label = v.label);

insert into public.nav_items (label, href, is_highlighted, sort_order)
select v.label, v.href, v.is_highlighted, v.sort_order
from (values
  ('Home', '/', false, 1),
  ('Our Menu', '/menu', true, 2),
  ('Signature', '/signature', false, 3),
  ('Our Locations', '/locations', false, 4),
  ('Contact Us', '/contact', false, 5)
) as v(label, href, is_highlighted, sort_order)
where not exists (select 1 from public.nav_items n where n.href = v.href);

insert into public.content_sections (section_key, payload) values
  ('hero', '{
    "headlineMain": "Matcha",
    "headlineSub": "On Perfect",
    "bgImageUrl": "https://images.unsplash.com/photo-1515823064-24b604ea0a0a?auto=format&fit=crop&w=1200&q=80",
    "ctaText": "Order Now",
    "ctaHref": "/menu",
    "badgeText": "BEST OF DRINK",
    "microCardTitle": "Ceremonial Grade Matcha",
    "microCardDescription": "Smooth. Clean. Naturally Energizing.",
    "showFrame": true
  }'::jsonb),
  ('essence', '{
    "headingMain": "Matcha",
    "headingAccent": "Essence",
    "subheading": "100% STONE-GROUND GREEN TEA SOURCED FROM THE FINEST JAPANESE LEAVES",
    "imageUrl": "https://images.unsplash.com/photo-1563823002068-5a1c7b0b0b0b?auto=format&fit=crop&w=900&q=80",
    "captionLeft": "Packed With Nutrients",
    "captionRight": "Naturally Nutrient Dense"
  }'::jsonb),
  ('promo', '{
    "leftTitle": "Pure Matcha",
    "leftAccent": "Energy",
    "productImageUrl": "https://images.unsplash.com/photo-1556675593-ef0fdf2939f3?auto=format&fit=crop&w=600&q=80",
    "lifestyleImageUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    "ctaText": "Order Now",
    "ctaHref": "/menu",
    "supportLines": ["Click to Order", "Naturally Powerful", "Green Essence", "Clean energy from nature.", "Rich, smooth matcha taste."],
    "marqueeWords": ["Ceremonial Grade", "Green Every Day", "Feel the Energy", "Keep the Calm"]
  }'::jsonb),
  ('flavor', '{
    "headingMain": "Glow With",
    "headingAccent": "Matcha",
    "productImageUrl": "https://images.unsplash.com/photo-1553530666-ba11a7da8558?auto=format&fit=crop&w=800&q=80",
    "productLabel": "Matcha Strawberry",
    "ctaText": "Order Now",
    "ctaHref": "/menu",
    "labelLeft": "Seasonal Specials",
    "labelRight": "Ceremonial Matcha",
    "fruitCards": [
      {"name": "Mango", "imageUrl": "https://images.unsplash.com/photo-1553279766-86024f0f3f8c?auto=format&fit=crop&w=200&q=80"},
      {"name": "Strawberry", "imageUrl": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=200&q=80"},
      {"name": "Blueberry", "imageUrl": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=200&q=80"}
    ]
  }'::jsonb),
  ('footer', '{
    "newsletterTitle": "Sign up to our newsletter for all the latest news and updates.",
    "newsletterPlaceholder": "Email Address",
    "wordmark": "NGUNJUK",
    "copyright": "© 2026 NGUNJUK. All rights reserved."
  }'::jsonb)
on conflict (section_key) do nothing;

insert into public.products (name, slug, short_description, image_url, category, flavor, is_featured, sort_order, cta_href)
select v.name, v.slug, v.short_description, v.image_url, v.category, v.flavor, v.is_featured, v.sort_order, v.cta_href
from (values
  ('Ceremonial Grade Matcha', 'ceremonial-grade', 'Smooth. Clean. Naturally Energizing.', 'https://images.unsplash.com/photo-1563823002068-5a1c7b0b0b0b?auto=format&fit=crop&w=400&q=80', 'ceremonial', null::text, true, 1, '/menu'),
  ('Pure Matcha Energy', 'pure-matcha-energy', 'Clean energy from nature.', 'https://images.unsplash.com/photo-1556675593-ef0fdf2939f3?auto=format&fit=crop&w=400&q=80', 'signature', null::text, true, 2, '/menu'),
  ('Matcha Strawberry', 'matcha-strawberry', 'Seasonal special with fresh strawberry.', 'https://images.unsplash.com/photo-1553530666-ba11a7da8558?auto=format&fit=crop&w=400&q=80', 'seasonal', 'strawberry', true, 3, '/menu')
) as v(name, slug, short_description, image_url, category, flavor, is_featured, sort_order, cta_href)
on conflict (slug) do nothing;
