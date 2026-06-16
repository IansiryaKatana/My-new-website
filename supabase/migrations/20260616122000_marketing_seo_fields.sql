-- SEO controls for dynamic intent pages and internal linking

alter table public.marketing_pages
  add column if not exists intent_page boolean not null default false,
  add column if not exists target_keyword text not null default '',
  add column if not exists target_location text not null default '',
  add column if not exists target_service text not null default '',
  add column if not exists internal_links jsonb not null default '[]'::jsonb;

create index if not exists marketing_pages_intent_page_sort_idx
  on public.marketing_pages (intent_page, sort_order, slug)
  where published = true;
