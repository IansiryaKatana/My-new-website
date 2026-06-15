-- Run this if the full migration failed partway (policies already exist).
-- Safe to run multiple times.

drop policy if exists "public_read_published_properties" on public.properties;
drop policy if exists "public_read_categories" on public.property_categories;
drop policy if exists "public_read_published_testimonials" on public.testimonials;
drop policy if exists "public_read_published_team" on public.team_members;
drop policy if exists "public_read_published_faq_topics" on public.faq_topics;
drop policy if exists "public_read_published_faq_entries" on public.faq_entries;
drop policy if exists "public_read_published_process" on public.process_steps;
drop policy if exists "public_read_published_hero_stats" on public.hero_stats;
drop policy if exists "public_read_published_marketing" on public.marketing_blocks;
drop policy if exists "public_read_site_settings" on public.site_settings;
drop policy if exists "public_insert_submissions" on public.form_submissions;
drop policy if exists "admin_all_properties" on public.properties;
drop policy if exists "admin_all_categories" on public.property_categories;
drop policy if exists "admin_all_testimonials" on public.testimonials;
drop policy if exists "admin_all_team" on public.team_members;
drop policy if exists "admin_all_faq_topics" on public.faq_topics;
drop policy if exists "admin_all_faq_entries" on public.faq_entries;
drop policy if exists "admin_all_process" on public.process_steps;
drop policy if exists "admin_all_hero_stats" on public.hero_stats;
drop policy if exists "admin_all_marketing" on public.marketing_blocks;
drop policy if exists "admin_all_site_settings" on public.site_settings;
drop policy if exists "admin_all_cms_media" on public.cms_media;
drop policy if exists "admin_read_submissions" on public.form_submissions;
drop policy if exists "admin_update_submissions" on public.form_submissions;
drop policy if exists "admin_delete_submissions" on public.form_submissions;
drop policy if exists "admin_read_admin_users" on public.admin_users;
drop policy if exists "admin_manage_admin_users" on public.admin_users;

-- Recreate (copy from migration lines 189–270)
create policy "public_read_published_properties" on public.properties
  for select to anon, authenticated using (published = true);

create policy "public_read_categories" on public.property_categories
  for select to anon, authenticated using (active = true);

create policy "public_read_published_testimonials" on public.testimonials
  for select to anon, authenticated using (published = true);

create policy "public_read_published_team" on public.team_members
  for select to anon, authenticated using (published = true);

create policy "public_read_published_faq_topics" on public.faq_topics
  for select to anon, authenticated using (published = true);

create policy "public_read_published_faq_entries" on public.faq_entries
  for select to anon, authenticated using (published = true);

create policy "public_read_published_process" on public.process_steps
  for select to anon, authenticated using (published = true);

create policy "public_read_published_hero_stats" on public.hero_stats
  for select to anon, authenticated using (published = true);

create policy "public_read_published_marketing" on public.marketing_blocks
  for select to anon, authenticated using (published = true);

create policy "public_read_site_settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "public_insert_submissions" on public.form_submissions
  for insert to anon, authenticated with check (true);

create policy "admin_all_properties" on public.properties
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_categories" on public.property_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_team" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_faq_topics" on public.faq_topics
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_faq_entries" on public.faq_entries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_process" on public.process_steps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_hero_stats" on public.hero_stats
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_marketing" on public.marketing_blocks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_site_settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_cms_media" on public.cms_media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_read_submissions" on public.form_submissions
  for select to authenticated using (public.is_admin());

create policy "admin_update_submissions" on public.form_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_delete_submissions" on public.form_submissions
  for delete to authenticated using (public.is_admin());

create policy "admin_read_admin_users" on public.admin_users
  for select to authenticated using (public.is_admin() or auth.uid() = auth_user_id);

create policy "admin_manage_admin_users" on public.admin_users
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
