-- Marden Energy CMS schema
create extension if not exists "pgcrypto";

-- Site settings (key-value)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Navigation
create table if not exists public.navigation_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null default '#',
  sort_order int not null default 0,
  published boolean not null default true,
  is_cta boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hero
create table if not exists public.hero_content (
  id uuid primary key default gen_random_uuid(),
  headline_line1 text not null default 'Energy Systems',
  headline_line2 text not null default 'for a Sustainable World.',
  subcopy text,
  cta_label text not null default 'About Marden',
  cta_url text not null default '#about',
  background_image_url text not null,
  thumbnail_image_url text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Metrics (hero stats)
create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  phase text,
  location text,
  image_url text not null,
  category text not null default 'Infrastructure'
    check (category in ('Solar', 'Wind', 'Grid', 'Infrastructure')),
  layout text not null default 'stacked'
    check (layout in ('stacked', 'featured')),
  cta_label text not null default 'Explore project',
  cta_url text not null default '#',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Services / capabilities
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  active boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Capabilities section copy
create table if not exists public.capabilities_section (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'What We Do',
  heading text not null default 'Capabilities included.',
  body text,
  cta_label text not null default 'View core services',
  cta_url text not null default '#services',
  background_image_url text not null,
  services_card_title text not null default 'Core Services',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Process stages
create table if not exists public.process_stages (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Map section + locations
create table if not exists public.map_section (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  heading text not null default 'Building energy where communities grow.',
  cta_label text not null default 'Our global footprint',
  cta_url text not null default '#',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.map_locations (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  region text,
  x_percent numeric(5,2) not null default 50,
  y_percent numeric(5,2) not null default 50,
  status text not null default 'inactive' check (status in ('active', 'inactive')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Footer
create table if not exists public.footer_columns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  links jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

-- Section copy blocks
create table if not exists public.section_copy (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  eyebrow text,
  heading text,
  body text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Form submissions
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null default 'contact',
  name text,
  email text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

-- Media library
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  public_url text not null,
  folder text not null default 'general',
  kind text not null default 'image' check (kind in ('image', 'video', 'document')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Admin users
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  role text not null default 'editor'
    check (role in ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.site_settings enable row level security;
alter table public.navigation_links enable row level security;
alter table public.hero_content enable row level security;
alter table public.metrics enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.capabilities_section enable row level security;
alter table public.process_stages enable row level security;
alter table public.map_section enable row level security;
alter table public.map_locations enable row level security;
alter table public.footer_columns enable row level security;
alter table public.social_links enable row level security;
alter table public.section_copy enable row level security;
alter table public.form_submissions enable row level security;
alter table public.cms_media enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies
create policy "public_read_site_settings" on public.site_settings for select to anon, authenticated using (true);
create policy "public_read_nav" on public.navigation_links for select to anon, authenticated using (published = true);
create policy "public_read_hero" on public.hero_content for select to anon, authenticated using (published = true);
create policy "public_read_metrics" on public.metrics for select to anon, authenticated using (published = true);
create policy "public_read_projects" on public.projects for select to anon, authenticated using (published = true);
create policy "public_read_services" on public.services for select to anon, authenticated using (published = true);
create policy "public_read_capabilities" on public.capabilities_section for select to anon, authenticated using (published = true);
create policy "public_read_stages" on public.process_stages for select to anon, authenticated using (published = true);
create policy "public_read_map_section" on public.map_section for select to anon, authenticated using (published = true);
create policy "public_read_map_locations" on public.map_locations for select to anon, authenticated using (published = true);
create policy "public_read_footer" on public.footer_columns for select to anon, authenticated using (published = true);
create policy "public_read_social" on public.social_links for select to anon, authenticated using (published = true);
create policy "public_read_section_copy" on public.section_copy for select to anon, authenticated using (published = true);
create policy "public_read_cms_media" on public.cms_media for select to anon, authenticated using (true);

-- Public insert submissions
create policy "public_insert_submissions" on public.form_submissions for insert to anon, authenticated with check (true);

-- Admin helper
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
        au.auth_user_id = auth.uid()
        or lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

-- Admin write policies
create policy "admin_all_site_settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_nav" on public.navigation_links for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_hero" on public.hero_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_metrics" on public.metrics for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_capabilities" on public.capabilities_section for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_stages" on public.process_stages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_map_section" on public.map_section for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_map_locations" on public.map_locations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_footer" on public.footer_columns for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_social" on public.social_links for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_section_copy" on public.section_copy for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_read_submissions" on public.form_submissions for select to authenticated using (public.is_admin());
create policy "admin_update_submissions" on public.form_submissions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_delete_submissions" on public.form_submissions for delete to authenticated using (public.is_admin());
create policy "admin_all_cms_media" on public.cms_media for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_read_admin_users" on public.admin_users for select to authenticated using (public.is_admin());
create policy "admin_write_admin_users" on public.admin_users for all to authenticated using (
  exists (select 1 from public.admin_users au where au.auth_user_id = auth.uid() and au.role in ('owner', 'admin') and au.is_active)
) with check (
  exists (select 1 from public.admin_users au where au.auth_user_id = auth.uid() and au.role in ('owner', 'admin') and au.is_active)
);

-- Storage bucket (run in dashboard or via CLI)
-- insert storage policies separately when bucket cms-media is created
