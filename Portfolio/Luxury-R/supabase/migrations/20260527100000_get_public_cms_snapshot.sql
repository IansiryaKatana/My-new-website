-- Single RPC for public site CMS snapshot (replaces 9 parallel REST calls)

create or replace function public.get_public_cms_snapshot()
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  return jsonb_build_object(
    'properties',
      coalesce(
        (select jsonb_agg(to_jsonb(p) order by p.sort_order)
         from public.properties p where p.published = true),
        '[]'::jsonb
      ),
    'testimonials',
      coalesce(
        (select jsonb_agg(to_jsonb(t) order by t.sort_order)
         from public.testimonials t where t.published = true),
        '[]'::jsonb
      ),
    'team_members',
      coalesce(
        (select jsonb_agg(to_jsonb(m) order by m.sort_order)
         from public.team_members m where m.published = true),
        '[]'::jsonb
      ),
    'faq_entries',
      coalesce(
        (select jsonb_agg(to_jsonb(f) order by f.sort_order)
         from public.faq_entries f where f.published = true),
        '[]'::jsonb
      ),
    'process_steps',
      coalesce(
        (select jsonb_agg(to_jsonb(s) order by s.sort_order)
         from public.process_steps s where s.published = true),
        '[]'::jsonb
      ),
    'hero_stats',
      coalesce(
        (select jsonb_agg(to_jsonb(h) order by h.sort_order)
         from public.hero_stats h where h.published = true),
        '[]'::jsonb
      ),
    'marketing_blocks',
      coalesce(
        (select jsonb_agg(to_jsonb(b) order by b.key)
         from public.marketing_blocks b where b.published = true),
        '[]'::jsonb
      ),
    'site_settings',
      coalesce(
        (select jsonb_agg(jsonb_build_object('key', ss.key, 'value', ss.value)
                 order by ss.key)
         from public.site_settings ss),
        '[]'::jsonb
      ),
    'property_categories',
      coalesce(
        (select jsonb_agg(to_jsonb(c) order by c.sort_order)
         from public.property_categories c where c.active = true),
        '[]'::jsonb
      )
  );
end;
$$;

revoke all on function public.get_public_cms_snapshot() from public;
grant execute on function public.get_public_cms_snapshot() to anon, authenticated;
