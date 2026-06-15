-- Add Certifications to site and hero navigation

update public.site_settings
set
  value = jsonb_set(
    value,
    '{navigation}',
    (
      select jsonb_agg(item order by ord)
      from (
        values
          (1, '{"label": "Work", "href": "/portfolio", "description": "Selected projects"}'::jsonb),
          (2, '{"label": "About", "href": "/about", "description": "Background & approach"}'::jsonb),
          (3, '{"label": "Certifications", "href": "/certifications", "description": "Licenses & credentials"}'::jsonb),
          (4, '{"label": "Experience", "href": "/experience", "description": "Roles & milestones"}'::jsonb),
          (5, '{"label": "Contact", "href": "/contact", "description": "Start a project"}'::jsonb)
      ) as nav(ord, item)
    )
  ),
  updated_at = now()
where key = 'profile';

update public.hero_content
set
  navigation = '[
    {"label": "Work", "href": "/portfolio"},
    {"label": "About", "href": "/about"},
    {"label": "Certifications", "href": "/certifications"},
    {"label": "Experience", "href": "/experience"},
    {"label": "Contact", "href": "/contact"}
  ]'::jsonb,
  updated_at = now()
where published = true;
