-- Public read RPCs for portfolio CMS snapshot

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

create or replace function public.get_project_by_slug(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(p)
  from public.projects p
  where p.slug = p_slug
    and p.published = true
  limit 1;
$$;

grant execute on function public.get_cms_snapshot() to anon, authenticated;
grant execute on function public.get_project_by_slug(text) to anon, authenticated;
