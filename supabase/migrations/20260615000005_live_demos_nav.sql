-- Live demos navigation: Home, Portfolio rename, Live demos page + homepage anchor

update public.site_settings
set
  value = jsonb_set(
    jsonb_set(
      value,
      '{navigation}',
      '[
        {"label": "Home", "href": "/", "description": "Back to homepage"},
        {"label": "Portfolio", "href": "/portfolio", "description": "Selected projects"},
        {"label": "Live demos", "href": "/live-demos", "description": "Hosted project previews"},
        {"label": "About", "href": "/about", "description": "Background & approach"},
        {"label": "Certifications", "href": "/certifications", "description": "Licenses & credentials"},
        {"label": "Experience", "href": "/experience", "description": "Roles & milestones"},
        {"label": "Contact", "href": "/contact", "description": "Start a project"}
      ]'::jsonb
    ),
    '{homeSections}',
    '[
      {"label": "Live demos", "href": "/#live-demos"},
      {"label": "Experience", "href": "/#experience"},
      {"label": "Stack", "href": "/#stack"},
      {"label": "Contact", "href": "/#contact"}
    ]'::jsonb
  ),
  updated_at = now()
where key = 'profile';

update public.hero_content
set
  navigation = '[
    {"label": "Home", "href": "/"},
    {"label": "Portfolio", "href": "/portfolio"},
    {"label": "Live demos", "href": "/live-demos"},
    {"label": "About", "href": "/about"},
    {"label": "Certifications", "href": "/certifications"},
    {"label": "Experience", "href": "/experience"},
    {"label": "Contact", "href": "/contact"}
  ]'::jsonb,
  updated_at = now()
where published = true;
