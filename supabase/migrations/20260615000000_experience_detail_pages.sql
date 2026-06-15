-- Experience detail pages: slug, full responsibilities, metadata

alter table public.experience_items
  add column if not exists slug text,
  add column if not exists employment_type text not null default '',
  add column if not exists work_mode text not null default '',
  add column if not exists detail_intro text not null default '',
  add column if not exists responsibilities jsonb not null default '[]'::jsonb,
  add column if not exists technologies jsonb not null default '[]'::jsonb,
  add column if not exists seo_description text not null default '',
  add column if not exists is_current boolean not null default false,
  add column if not exists preview_limit int not null default 3;

create unique index if not exists experience_items_slug_key
  on public.experience_items (slug)
  where slug is not null;

create or replace function public.get_experience_by_slug(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(e)
  from public.experience_items e
  where e.slug = p_slug
    and e.published = true
  limit 1;
$$;

grant execute on function public.get_experience_by_slug(text) to anon, authenticated;
