update public.site_settings
set value = '"Marcellaro"', updated_at = now()
where key = 'brand_name';
