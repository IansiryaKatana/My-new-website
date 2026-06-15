create table if not exists public.hub_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null unique,
  interest text not null check (
    interest in ('consent-guide', 'communication', 'confidence', 'weekly-lessons')
  ),
  consent boolean not null default false,
  source text not null default 'landing_page',
  created_at timestamptz not null default now()
);

alter table public.hub_signups enable row level security;

create policy "Hub signups are service-role managed"
on public.hub_signups
for all
using (false)
with check (false);
