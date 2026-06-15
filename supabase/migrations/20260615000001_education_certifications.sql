-- Education & certifications for About page

create table if not exists public.education_items (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  issued_label text not null default '',
  summary text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certification_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_label text not null default '',
  credential_url text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists education_items_updated_at on public.education_items;
create trigger education_items_updated_at
  before update on public.education_items
  for each row execute function public.set_updated_at();

drop trigger if exists certification_items_updated_at on public.certification_items;
create trigger certification_items_updated_at
  before update on public.certification_items
  for each row execute function public.set_updated_at();

alter table public.education_items enable row level security;
alter table public.certification_items enable row level security;

drop policy if exists "education_items public read published" on public.education_items;
create policy "education_items public read published"
  on public.education_items for select
  using (published = true);

drop policy if exists "education_items admin all" on public.education_items;
create policy "education_items admin all"
  on public.education_items for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

drop policy if exists "certification_items public read published" on public.certification_items;
create policy "certification_items public read published"
  on public.certification_items for select
  using (published = true);

drop policy if exists "certification_items admin all" on public.certification_items;
create policy "certification_items admin all"
  on public.certification_items for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

create or replace function public.get_cms_snapshot()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'site_settings',
      coalesce(
        (select jsonb_agg(to_jsonb(s) order by s.key) from public.site_settings s),
        '[]'::jsonb
      ),
    'hero_content',
      (
        select to_jsonb(h)
        from public.hero_content h
        where h.published = true
        order by h.updated_at desc
        limit 1
      ),
    'projects',
      coalesce(
        (
          select jsonb_agg(to_jsonb(p) order by p.sort_order, p.created_at)
          from public.projects p
          where p.published = true
        ),
        '[]'::jsonb
      ),
    'experience_items',
      coalesce(
        (
          select jsonb_agg(to_jsonb(e) order by e.sort_order, e.created_at)
          from public.experience_items e
          where e.published = true
        ),
        '[]'::jsonb
      ),
    'skill_groups',
      coalesce(
        (
          select jsonb_agg(to_jsonb(g) order by g.sort_order, g.created_at)
          from public.skill_groups g
          where g.published = true
        ),
        '[]'::jsonb
      ),
    'skill_items',
      coalesce(
        (
          select jsonb_agg(to_jsonb(i) order by i.sort_order, i.created_at)
          from public.skill_items i
          where exists (
            select 1
            from public.skill_groups g
            where g.id = i.group_id and g.published = true
          )
        ),
        '[]'::jsonb
      ),
    'education_items',
      coalesce(
        (
          select jsonb_agg(to_jsonb(ed) order by ed.sort_order, ed.created_at)
          from public.education_items ed
          where ed.published = true
        ),
        '[]'::jsonb
      ),
    'certification_items',
      coalesce(
        (
          select jsonb_agg(to_jsonb(c) order by c.sort_order, c.created_at)
          from public.certification_items c
          where c.published = true
        ),
        '[]'::jsonb
      ),
    'marketing_pages',
      coalesce(
        (
          select jsonb_agg(to_jsonb(m) order by m.sort_order, m.slug)
          from public.marketing_pages m
          where m.published = true
        ),
        '[]'::jsonb
      )
  );
$$;

grant execute on function public.get_cms_snapshot() to anon, authenticated;
