-- Run once in SQL Editor to use the local hero image on live CMS
update public.site_settings
set value = '"/images/hero-L.png"', updated_at = now()
where key = 'hero_image';
