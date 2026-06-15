-- Valence Capital CMS schema
-- Run via: supabase db push (or apply in Supabase SQL editor)

-- Extensions
create extension if not exists "pgcrypto";

-- Site settings (key-value)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Hero (singleton)
create table if not exists public.hero_content (
  id uuid primary key default gen_random_uuid(),
  logo_text text not null default 'Valence Capital',
  title_line_one text not null default 'Valence',
  title_line_two text not null default 'Capital',
  intro_text text not null default '',
  statement text not null default '',
  background_image_url text not null default '',
  primary_cta_label text not null default 'Submit Opportunity',
  primary_cta_href text not null default '#submit',
  secondary_cta_label text not null default 'Let''s Talk',
  secondary_cta_href text not null default '#contact',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Navigation
create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trusted logos
create table if not exists public.trusted_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null default '',
  alt_text text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Logo strip label
create table if not exists public.logo_strip (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'Trusted by Industry Leaders',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Perspective section (singleton)
create table if not exists public.perspective_section (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'Perspective',
  title text not null default '',
  description text not null default '',
  image_url text not null default '',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Principles
create table if not exists public.principles (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Portfolio section header
create table if not exists public.portfolio_section (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'Selected Work',
  title text not null default 'Built on Principle',
  intro_text text not null default '',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Portfolio projects
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_large_url text not null default '',
  image_side_url text not null default '',
  project_url text not null default '#',
  is_featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Image break section
create table if not exists public.image_break (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  alt_text text not null default '',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Investment approach header
create table if not exists public.investment_approach (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'Process',
  title text not null default 'Investment Approach',
  description text not null default '',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.investment_approach_items (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Final CTA
create table if not exists public.final_cta (
  id uuid primary key default gen_random_uuid(),
  heading text not null default '',
  button_label text not null default 'Submit Opportunity',
  button_href text not null default '#submit',
  background_image_url text not null default '',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Footer
create table if not exists public.footer_content (
  id uuid primary key default gen_random_uuid(),
  statement text not null default '',
  wordmark text not null default 'VALENCE',
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.footer_link_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.footer_link_groups(id) on delete cascade,
  label text not null,
  href text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.legal_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

-- Form submissions
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null default 'opportunity',
  name text,
  email text,
  company text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Admin users
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media library
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  public_url text not null,
  storage_path text not null,
  folder text not null default 'general',
  kind text not null default 'image',
  alt_text text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.site_settings enable row level security;
alter table public.hero_content enable row level security;
alter table public.navigation_items enable row level security;
alter table public.trusted_logos enable row level security;
alter table public.logo_strip enable row level security;
alter table public.perspective_section enable row level security;
alter table public.principles enable row level security;
alter table public.portfolio_section enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.image_break enable row level security;
alter table public.investment_approach enable row level security;
alter table public.investment_approach_items enable row level security;
alter table public.final_cta enable row level security;
alter table public.footer_content enable row level security;
alter table public.footer_link_groups enable row level security;
alter table public.footer_links enable row level security;
alter table public.social_links enable row level security;
alter table public.legal_links enable row level security;
alter table public.form_submissions enable row level security;
alter table public.admin_users enable row level security;
alter table public.cms_media enable row level security;

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
        au.auth_user_id = auth.uid()
        or lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Public read policies (published content)
do $$ declare t text; begin
  foreach t in array array[
    'hero_content','navigation_items','trusted_logos','logo_strip',
    'perspective_section','principles','portfolio_section','portfolio_projects',
    'image_break','investment_approach','investment_approach_items','final_cta',
    'footer_content','footer_link_groups','footer_links','social_links','legal_links','site_settings'
  ] loop
    execute format('create policy "public read %s" on public.%I for select to anon, authenticated using (true)', t, t);
  end loop;
end $$;

-- Form submissions: anyone can insert (public forms), admins read
create policy "public insert submissions" on public.form_submissions for insert to anon, authenticated with check (true);
create policy "admin read submissions" on public.form_submissions for select to authenticated using (public.is_admin());
create policy "admin delete submissions" on public.form_submissions for delete to authenticated using (public.is_admin());

-- Admin write policies
do $$ declare t text; begin
  foreach t in array array[
    'hero_content','navigation_items','trusted_logos','logo_strip',
    'perspective_section','principles','portfolio_section','portfolio_projects',
    'image_break','investment_approach','investment_approach_items','final_cta',
    'footer_content','footer_link_groups','footer_links','social_links','legal_links',
    'site_settings','cms_media'
  ] loop
    execute format('create policy "admin all %s" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

create policy "admin read admin_users" on public.admin_users for select to authenticated using (public.is_admin() or auth_user_id = auth.uid());
create policy "admin manage admin_users" on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket (run in dashboard or via storage API)
-- insert into storage.buckets (id, name, public) values ('cms-media', 'cms-media', true);
