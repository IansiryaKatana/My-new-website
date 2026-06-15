-- Education & certifications seed (safe to re-run)
-- Run after 20260615000001_education_certifications.sql

insert into public.education_items (
  id, degree, institution, issued_label, summary, published, sort_order
) values
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
    'Bachelor of Science in Information Technology',
    'Jomo Kenyatta University of Agriculture and Technology',
    'Nov 2019',
    '',
    true,
    0
  )
on conflict (id) do update set
  degree = excluded.degree,
  institution = excluded.institution,
  issued_label = excluded.issued_label,
  summary = excluded.summary,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.certification_items (
  id, title, issuer, issued_label, credential_url, published, sort_order
) values
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff1',
    'Foundations of Project Management',
    'Google',
    'Jun 2023',
    null,
    true,
    0
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff2',
    'Google SEO Fundamentals',
    'University of California, Davis',
    'Jun 2022',
    null,
    true,
    1
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff3',
    'Optimizing a Website for Google Search',
    'University of California, Davis',
    'May 2022',
    null,
    true,
    2
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff4',
    'Increase SEO Traffic with WordPress',
    'Coursera',
    'Jul 2019',
    null,
    true,
    3
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff5',
    'Build a Full Website using WordPress',
    'Coursera',
    'Jun 2019',
    null,
    true,
    4
  )
on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  issued_label = excluded.issued_label,
  credential_url = excluded.credential_url,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();

update public.marketing_pages
set
  sections = sections || '{
    "education": {
      "eyebrow": "Education",
      "title": "Academic background"
    },
    "certifications": {
      "eyebrow": "Certifications",
      "title": "Licenses & credentials",
      "description": "Professional credentials across project management, technical SEO, and WordPress development."
    }
  }'::jsonb,
  updated_at = now()
where slug = 'about';
