-- Luxury Real Estate CMS schema

create extension if not exists "pgcrypto";

-- Property categories (Loft, Budget, Rent tabs)
create table if not exists public.property_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order int not null default 0,
  active boolean not null default true
);

-- Properties
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null default '',
  description text not null default '',
  price_from numeric not null default 0,
  image_url text not null default '',
  category text not null default 'loft' check (category in ('loft', 'budget', 'rent')),
  status text,
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  area_label text not null default '',
  year_label text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_location text not null default '',
  title text not null default '',
  quote text not null default '',
  avatar_url text,
  property_image_url text,
  assigned_agent text,
  card_type text not null default 'text' check (card_type in ('text', 'image')),
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  image_url text not null default '',
  bullets jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faq_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.faq_entries (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.faq_topics(id) on delete cascade,
  question text not null,
  answer text not null default '',
  sort_order int not null default 0,
  published boolean not null default false
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  step_number text not null,
  title text not null,
  description text not null default '',
  image_url text,
  published boolean not null default false,
  sort_order int not null default 0
);

create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.marketing_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  body text,
  cta_label text,
  cta_href text,
  image_url text,
  published boolean not null default true
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  public_url text not null,
  folder text not null default 'general',
  kind text not null default 'image',
  file_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  goal text,
  source_page text not null default '/',
  property_interest text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_updated_at on public.properties;
create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- RLS
alter table public.property_categories enable row level security;
alter table public.properties enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.faq_topics enable row level security;
alter table public.faq_entries enable row level security;
alter table public.process_steps enable row level security;
alter table public.hero_stats enable row level security;
alter table public.marketing_blocks enable row level security;
alter table public.site_settings enable row level security;
alter table public.cms_media enable row level security;
alter table public.form_submissions enable row level security;
alter table public.admin_users enable row level security;

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
    where au.auth_user_id = auth.uid()
      and au.is_active = true
      and au.role in ('owner', 'admin', 'editor')
  );
$$;

-- Policies (drop first so this migration can be re-run safely in SQL Editor)
drop policy if exists "public_read_published_properties" on public.properties;
drop policy if exists "public_read_categories" on public.property_categories;
drop policy if exists "public_read_published_testimonials" on public.testimonials;
drop policy if exists "public_read_published_team" on public.team_members;
drop policy if exists "public_read_published_faq_topics" on public.faq_topics;
drop policy if exists "public_read_published_faq_entries" on public.faq_entries;
drop policy if exists "public_read_published_process" on public.process_steps;
drop policy if exists "public_read_published_hero_stats" on public.hero_stats;
drop policy if exists "public_read_published_marketing" on public.marketing_blocks;
drop policy if exists "public_read_site_settings" on public.site_settings;
drop policy if exists "public_insert_submissions" on public.form_submissions;
drop policy if exists "admin_all_properties" on public.properties;
drop policy if exists "admin_all_categories" on public.property_categories;
drop policy if exists "admin_all_testimonials" on public.testimonials;
drop policy if exists "admin_all_team" on public.team_members;
drop policy if exists "admin_all_faq_topics" on public.faq_topics;
drop policy if exists "admin_all_faq_entries" on public.faq_entries;
drop policy if exists "admin_all_process" on public.process_steps;
drop policy if exists "admin_all_hero_stats" on public.hero_stats;
drop policy if exists "admin_all_marketing" on public.marketing_blocks;
drop policy if exists "admin_all_site_settings" on public.site_settings;
drop policy if exists "admin_all_cms_media" on public.cms_media;
drop policy if exists "admin_read_submissions" on public.form_submissions;
drop policy if exists "admin_update_submissions" on public.form_submissions;
drop policy if exists "admin_delete_submissions" on public.form_submissions;
drop policy if exists "admin_read_admin_users" on public.admin_users;
drop policy if exists "admin_manage_admin_users" on public.admin_users;

-- Public read published content
create policy "public_read_published_properties" on public.properties
  for select to anon, authenticated using (published = true);

create policy "public_read_categories" on public.property_categories
  for select to anon, authenticated using (active = true);

create policy "public_read_published_testimonials" on public.testimonials
  for select to anon, authenticated using (published = true);

create policy "public_read_published_team" on public.team_members
  for select to anon, authenticated using (published = true);

create policy "public_read_published_faq_topics" on public.faq_topics
  for select to anon, authenticated using (published = true);

create policy "public_read_published_faq_entries" on public.faq_entries
  for select to anon, authenticated using (published = true);

create policy "public_read_published_process" on public.process_steps
  for select to anon, authenticated using (published = true);

create policy "public_read_published_hero_stats" on public.hero_stats
  for select to anon, authenticated using (published = true);

create policy "public_read_published_marketing" on public.marketing_blocks
  for select to anon, authenticated using (published = true);

create policy "public_read_site_settings" on public.site_settings
  for select to anon, authenticated using (true);

-- Public insert leads
create policy "public_insert_submissions" on public.form_submissions
  for insert to anon, authenticated with check (true);

-- Admin full access
create policy "admin_all_properties" on public.properties
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_categories" on public.property_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_team" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_faq_topics" on public.faq_topics
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_faq_entries" on public.faq_entries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_process" on public.process_steps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_hero_stats" on public.hero_stats
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_marketing" on public.marketing_blocks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_site_settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_cms_media" on public.cms_media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_read_submissions" on public.form_submissions
  for select to authenticated using (public.is_admin());

create policy "admin_update_submissions" on public.form_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_delete_submissions" on public.form_submissions
  for delete to authenticated using (public.is_admin());

create policy "admin_read_admin_users" on public.admin_users
  for select to authenticated using (public.is_admin() or auth.uid() = auth_user_id);

create policy "admin_manage_admin_users" on public.admin_users
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket (run in dashboard or via storage API)
-- insert into storage.buckets (id, name, public) values ('cms-media', 'cms-media', true);

-- Seed defaults
insert into public.site_settings (key, value) values
  ('brand_name', '"Marcellaro"'),
  ('hero_headline', '"LUXURY REAL ESTATE"'),
  ('hero_subheadline', '"with full service support"'),
  ('hero_trust_copy', '"We''ll find and verify truly the best option for you"'),
  ('contact_phone', '"+1 (310) 555-0487"'),
  ('contact_availability', '"available 7 days a week"'),
  ('admin_primary', '"#46482f"')
on conflict (key) do nothing;

insert into public.property_categories (slug, label, sort_order) values
  ('loft', 'Loft', 1),
  ('budget', 'Budget', 2),
  ('rent', 'Rent', 3)
on conflict (slug) do nothing;
