-- Portfolio CMS schema (Supabase Postgres)
-- Safe to re-run in SQL Editor (uses IF NOT EXISTS / OR REPLACE / DROP IF EXISTS)

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admin_users must exist before is_cms_* helpers and CMS RLS policies
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null default 'editor'
    check (role in ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists admin_users_updated_at on public.admin_users;
create trigger admin_users_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and is_active = true
      and role in ('owner', 'admin', 'editor')
  );
$$;

create or replace function public.is_cms_owner_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and is_active = true
      and role in ('owner', 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- site_settings (key-value)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write"
  on public.site_settings for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- hero_content (singleton)
-- ---------------------------------------------------------------------------

create table if not exists public.hero_content (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  left_intro jsonb not null default '[]'::jsonb,
  expertise text not null default '',
  right_intro jsonb not null default '[]'::jsonb,
  right_secondary jsonb not null default '[]'::jsonb,
  cta_label text not null default 'Let''s talk',
  cta_href text not null default '/contact',
  start_project_label text not null default 'Start a project',
  start_project_href text not null default '/contact',
  tags jsonb not null default '[]'::jsonb,
  ticker jsonb not null default '[]'::jsonb,
  navigation jsonb not null default '[]'::jsonb,
  subject_image_url text,
  subject_alt text,
  badge_text text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

drop trigger if exists hero_content_updated_at on public.hero_content;
create trigger hero_content_updated_at
  before update on public.hero_content
  for each row execute function public.set_updated_at();

alter table public.hero_content enable row level security;

drop policy if exists "hero_content public read published" on public.hero_content;
create policy "hero_content public read published"
  on public.hero_content for select
  using (published = true);

drop policy if exists "hero_content admin all" on public.hero_content;
create policy "hero_content admin all"
  on public.hero_content for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  year text not null default '',
  role text not null default '',
  stack jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  href text,
  cover_image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_sort on public.projects (published, sort_order);

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "projects public read published" on public.projects;
create policy "projects public read published"
  on public.projects for select
  using (published = true);

drop policy if exists "projects admin all" on public.projects;
create policy "projects admin all"
  on public.projects for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- experience_items
-- ---------------------------------------------------------------------------

create table if not exists public.experience_items (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  period text not null,
  location text not null default '',
  summary text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  featured_on_home boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists experience_items_updated_at on public.experience_items;
create trigger experience_items_updated_at
  before update on public.experience_items
  for each row execute function public.set_updated_at();

alter table public.experience_items enable row level security;

drop policy if exists "experience_items public read published" on public.experience_items;
create policy "experience_items public read published"
  on public.experience_items for select
  using (published = true);

drop policy if exists "experience_items admin all" on public.experience_items;
create policy "experience_items admin all"
  on public.experience_items for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- skill_groups + skill_items
-- ---------------------------------------------------------------------------

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups (id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

drop trigger if exists skill_groups_updated_at on public.skill_groups;
create trigger skill_groups_updated_at
  before update on public.skill_groups
  for each row execute function public.set_updated_at();

alter table public.skill_groups enable row level security;
alter table public.skill_items enable row level security;

drop policy if exists "skill_groups public read published" on public.skill_groups;
create policy "skill_groups public read published"
  on public.skill_groups for select
  using (published = true);

drop policy if exists "skill_groups admin all" on public.skill_groups;
create policy "skill_groups admin all"
  on public.skill_groups for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

drop policy if exists "skill_items public read" on public.skill_items;
create policy "skill_items public read"
  on public.skill_items for select
  using (
    exists (
      select 1 from public.skill_groups g
      where g.id = group_id and g.published = true
    )
  );

drop policy if exists "skill_items admin all" on public.skill_items;
create policy "skill_items admin all"
  on public.skill_items for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- marketing_pages
-- ---------------------------------------------------------------------------

create table if not exists public.marketing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text,
  description text not null default '',
  body_html text not null default '',
  sections jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists marketing_pages_updated_at on public.marketing_pages;
create trigger marketing_pages_updated_at
  before update on public.marketing_pages
  for each row execute function public.set_updated_at();

alter table public.marketing_pages enable row level security;

drop policy if exists "marketing_pages public read published" on public.marketing_pages;
create policy "marketing_pages public read published"
  on public.marketing_pages for select
  using (published = true);

drop policy if exists "marketing_pages admin all" on public.marketing_pages;
create policy "marketing_pages admin all"
  on public.marketing_pages for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- cms_media
-- ---------------------------------------------------------------------------

create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  public_url text not null,
  storage_path text not null,
  folder text not null default 'general',
  kind text not null default 'image',
  alt_text text,
  file_name text,
  byte_size bigint,
  created_at timestamptz not null default now()
);

alter table public.cms_media enable row level security;

drop policy if exists "cms_media public read" on public.cms_media;
create policy "cms_media public read"
  on public.cms_media for select
  using (true);

drop policy if exists "cms_media admin all" on public.cms_media;
create policy "cms_media admin all"
  on public.cms_media for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- form_submissions
-- ---------------------------------------------------------------------------

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.form_submissions enable row level security;

drop policy if exists "form_submissions public insert" on public.form_submissions;
create policy "form_submissions public insert"
  on public.form_submissions for insert
  with check (true);

drop policy if exists "form_submissions admin read delete" on public.form_submissions;
create policy "form_submissions admin read delete"
  on public.form_submissions for select
  using (public.is_cms_admin());

drop policy if exists "form_submissions admin delete" on public.form_submissions;
create policy "form_submissions admin delete"
  on public.form_submissions for delete
  using (public.is_cms_admin());

drop policy if exists "form_submissions admin update" on public.form_submissions;
create policy "form_submissions admin update"
  on public.form_submissions for update
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- ---------------------------------------------------------------------------
-- admin_users RLS
-- ---------------------------------------------------------------------------

alter table public.admin_users enable row level security;

drop policy if exists "admin_users read own or admin" on public.admin_users;
create policy "admin_users read own or admin"
  on public.admin_users for select
  using (
    auth_user_id = auth.uid()
    or public.is_cms_owner_or_admin()
  );

drop policy if exists "admin_users owner admin manage" on public.admin_users;
create policy "admin_users owner admin manage"
  on public.admin_users for all
  using (public.is_cms_owner_or_admin())
  with check (public.is_cms_owner_or_admin());

drop policy if exists "admin_users bootstrap owner" on public.admin_users;
create policy "admin_users bootstrap owner"
  on public.admin_users for insert
  with check (
    auth.uid() is not null
    and auth_user_id = auth.uid()
    and role = 'owner'
    and not exists (select 1 from public.admin_users)
  );

-- ---------------------------------------------------------------------------
-- Storage bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

drop policy if exists "cms media public read" on storage.objects;
create policy "cms media public read"
  on storage.objects for select
  using (bucket_id = 'cms-media');

drop policy if exists "cms media admin upload" on storage.objects;
create policy "cms media admin upload"
  on storage.objects for insert
  with check (
    bucket_id = 'cms-media'
    and public.is_cms_admin()
  );

drop policy if exists "cms media admin update" on storage.objects;
create policy "cms media admin update"
  on storage.objects for update
  using (bucket_id = 'cms-media' and public.is_cms_admin());

drop policy if exists "cms media admin delete" on storage.objects;
create policy "cms media admin delete"
  on storage.objects for delete
  using (bucket_id = 'cms-media' and public.is_cms_admin());
