-- Remove decorative hero badge ("05") from live CMS content
update public.hero_content
set badge_text = null,
    updated_at = now()
where badge_text is not null;
