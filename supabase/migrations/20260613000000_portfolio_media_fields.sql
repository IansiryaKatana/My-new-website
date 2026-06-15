-- Extended portfolio project media and SEO fields

alter table public.projects
  add column if not exists featured_image_url text,
  add column if not exists thumbnail_urls jsonb not null default '[]'::jsonb,
  add column if not exists seo_description text not null default '';
