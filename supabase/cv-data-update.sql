-- =============================================================================
-- Ian Sirya CV data update + experience detail content
-- Run in Supabase SQL Editor (safe to re-run)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Schema (skip if migration already applied)
-- ---------------------------------------------------------------------------

alter table public.experience_items
  add column if not exists slug text,
  add column if not exists employment_type text not null default '',
  add column if not exists work_mode text not null default '',
  add column if not exists detail_intro text not null default '',
  add column if not exists responsibilities jsonb not null default '[]'::jsonb,
  add column if not exists technologies jsonb not null default '[]'::jsonb,
  add column if not exists seo_description text not null default '',
  add column if not exists is_current boolean not null default false,
  add column if not exists preview_limit int not null default 3;

create unique index if not exists experience_items_slug_key
  on public.experience_items (slug)
  where slug is not null;

create or replace function public.get_experience_by_slug(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(e)
  from public.experience_items e
  where e.slug = p_slug
    and e.published = true
  limit 1;
$$;

grant execute on function public.get_experience_by_slug(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Remove placeholder experience entries
-- ---------------------------------------------------------------------------

delete from public.experience_items
where company in ('Northline Labs', 'Studio Meridian', 'OpenCraft Agency');

-- ---------------------------------------------------------------------------
-- 3. Experience items from CV (list view uses highlights; detail uses responsibilities)
-- ---------------------------------------------------------------------------

insert into public.experience_items (
  id, slug, company, role, period, location, employment_type, work_mode,
  summary, detail_intro, highlights, responsibilities, technologies,
  seo_description, is_current, featured_on_home, published, sort_order, preview_limit
) values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'giovanni-lead-full-stack-digital-systems-lead',
    'GIOVANNI',
    'Lead Full-Stack Developer & Digital Systems Lead',
    'Oct 2025 — Present',
    'Dubai, United Arab Emirates',
    'Full-time',
    'On-site',
    'Leading business-critical digital systems, internal platforms, CRM workflows, dashboards, booking journeys, and multi-brand web applications.',
    'Promoted into a wider technical leadership role focused on building and improving business-critical digital systems, internal platforms, CRM workflows, dashboards, booking journeys, and multi-brand web applications.',
    '[
      "Lead full-stack development across company websites, internal systems, dashboards, and operational platforms.",
      "Design and improve CRM workflows, booking processes, student accommodation journeys, payment flows, and role-based admin tools.",
      "Translate requirements from directors, operations, sales, finance, marketing, and customer service teams into scalable technical solutions."
    ]'::jsonb,
    '[
      "Lead full-stack development across company websites, internal systems, dashboards, and operational platforms.",
      "Design and improve CRM workflows, booking processes, student accommodation journeys, payment flows, and role-based admin tools.",
      "Translate requirements from directors, operations, sales, finance, marketing, and customer service teams into scalable technical solutions.",
      "Work across React, TypeScript, Node.js, Laravel, WordPress, Shopify, Supabase, APIs, analytics tools, and cloud-based environments.",
      "Manage integrations including payment gateways, CRM workflows, analytics tracking, Google Tag Manager, email systems, and third-party APIs.",
      "Identify operational gaps and manual processes, then design improved software workflows to increase efficiency, visibility, and control.",
      "Support digital transformation initiatives by replacing disconnected manual processes with structured, scalable business systems.",
      "Improve UI/UX for complex systems including dashboards, booking interfaces, form journeys, cancelled-state handling, admin workflows, and role-based access."
    ]'::jsonb,
    '["React", "TypeScript", "Node.js", "Laravel", "WordPress", "Shopify", "Supabase", "PostgreSQL", "REST APIs", "Stripe", "Google Tag Manager", "Google Analytics"]'::jsonb,
    'Lead Full-Stack Developer & Digital Systems Lead at GIOVANNI in Dubai — CRM workflows, booking platforms, dashboards, and multi-brand digital systems.',
    true, true, true, 0, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'giovanni-lead-web-developer',
    'GIOVANNI',
    'Lead Web Developer',
    'Oct 2024 — Sep 2025',
    'Dubai, United Arab Emirates',
    'Full-time',
    'On-site',
    'Promoted to Lead Web Developer after taking ownership of multiple company websites, integrations, technical workflows, and delivery coordination across business units.',
    'Promoted from Web Developer to Lead Web Developer after taking ownership of multiple company websites, integrations, technical workflows, and delivery coordination across business units.',
    '[
      "Led development and maintenance of subsidiary websites, landing pages, CMS platforms, and digital assets.",
      "Coordinated with designers, developers, marketers, and stakeholders to deliver technical updates and campaign requirements.",
      "Managed website performance, mobile responsiveness, SEO structure, bug fixes, plugin updates, hosting support, and security improvements."
    ]'::jsonb,
    '[
      "Led development and maintenance of subsidiary websites, landing pages, CMS platforms, and digital assets.",
      "Coordinated with designers, developers, marketers, and stakeholders to deliver technical updates and campaign requirements.",
      "Managed website performance, mobile responsiveness, SEO structure, bug fixes, plugin updates, hosting support, and security improvements.",
      "Implemented API connections, form workflows, CRM integrations, analytics tracking, and marketing tool setups.",
      "Supported project planning, task allocation, delivery timelines, QA reviews, and technical troubleshooting.",
      "Improved website quality, user experience, speed, scalability, and reliability across multiple business brands.",
      "Built investor-focused websites and microsites to showcase real estate, business, and corporate projects.",
      "Provided advanced technical support for website issues and collaborated with customer service and operations teams."
    ]'::jsonb,
    '["WordPress", "Elementor", "Shopify", "Google Analytics", "Google Tag Manager", "SEO", "API Integrations", "CRM Workflows"]'::jsonb,
    'Lead Web Developer at GIOVANNI — multi-brand website delivery, integrations, SEO, performance, and technical coordination in Dubai.',
    false, true, true, 1, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'giovanni-web-developer',
    'GIOVANNI',
    'Web Developer',
    'Mar 2024 — Sep 2024',
    'Dubai, United Arab Emirates',
    'Full-time',
    'On-site',
    'Built, maintained, and improved company websites, landing pages, CMS content, and frontend user experiences across multiple brands.',
    'Started as a Web Developer responsible for building, maintaining, and improving company websites, landing pages, CMS content, and frontend user experiences.',
    '[
      "Built and maintained responsive websites, landing pages, and website sections across company brands.",
      "Performed CMS updates, layout improvements, bug fixes, mobile optimization, and speed improvements.",
      "Supported SEO implementation, Google Analytics, Google Tag Manager, and campaign tracking requirements."
    ]'::jsonb,
    '[
      "Built and maintained responsive websites, landing pages, and website sections across company brands.",
      "Performed CMS updates, layout improvements, bug fixes, mobile optimization, and speed improvements.",
      "Supported SEO implementation, Google Analytics, Google Tag Manager, and campaign tracking requirements.",
      "Collaborated with design and marketing teams to turn visual concepts into functional web pages.",
      "Assisted with hosting, domain, email, DNS, and technical website support.",
      "Delivered regular website updates while building deeper responsibility across systems, integrations, and business workflows."
    ]'::jsonb,
    '["WordPress", "HTML", "CSS", "JavaScript", "Google Analytics", "Google Tag Manager", "DNS", "Hosting"]'::jsonb,
    'Web Developer at GIOVANNI in Dubai — responsive websites, CMS updates, SEO, analytics, and campaign delivery.',
    false, false, true, 2, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
    'tshtking-full-stack-web-developer',
    'TSHTKING',
    'Full-Stack Web Developer',
    'Aug 2023 — Sep 2024',
    'Remote, United States',
    'Freelance',
    'Remote',
    'Delivered full-stack web development and technical support for client websites and digital platforms.',
    'Delivered full-stack web development and technical support for client websites and digital platforms.',
    '[
      "Delivered full-stack web development and technical support for client websites and digital platforms.",
      "Developed responsive websites and custom web interfaces using modern frontend technologies.",
      "Implemented CMS updates, backend integrations, payment workflows, and performance improvements."
    ]'::jsonb,
    '[
      "Delivered full-stack web development and technical support for client websites and digital platforms.",
      "Developed responsive websites and custom web interfaces using modern frontend technologies.",
      "Implemented CMS updates, backend integrations, payment workflows, and performance improvements.",
      "Supported UI/UX enhancements to improve usability, mobile responsiveness, and conversion flows.",
      "Managed technical troubleshooting, bug fixes, hosting support, and website optimization.",
      "Worked with stakeholders to understand project requirements, define scope, and deliver practical digital solutions.",
      "Supported integrations for forms, APIs, analytics tools, payment gateways, and CRM-related workflows."
    ]'::jsonb,
    '["React", "JavaScript", "WordPress", "Payment Gateways", "API Integrations", "CRM Workflows"]'::jsonb,
    'Freelance Full-Stack Web Developer for TSHTKING — client websites, integrations, payments, and performance optimization.',
    false, false, true, 3, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5',
    'tourkal-full-stack-web-developer',
    'TOURKAL INVESTMENTS LIMITED',
    'Full-Stack Web Developer',
    'Dec 2021 — Nov 2023',
    'Dubai, United Arab Emirates',
    'Full-time',
    'On-site',
    'Developed and optimized company websites, landing pages, and digital assets for business growth, marketing visibility, and user experience.',
    'Developed and optimized company websites, landing pages, and digital assets for business growth, marketing visibility, and user experience.',
    '[
      "Developed and optimized company websites, landing pages, and digital assets for business growth, marketing visibility, and user experience.",
      "Designed and developed responsive websites using HTML, CSS, JavaScript, Bootstrap, WordPress, and Elementor.",
      "Implemented SEO improvements including keyword research, metadata optimization, URL structure, XML sitemaps, robots.txt, and content optimization."
    ]'::jsonb,
    '[
      "Developed and optimized company websites, landing pages, and digital assets for business growth, marketing visibility, and user experience.",
      "Designed and developed responsive websites using HTML, CSS, JavaScript, Bootstrap, WordPress, and Elementor.",
      "Created website layouts, graphics, and visual assets using Figma, Photoshop, and Illustrator.",
      "Implemented SEO improvements including keyword research, metadata optimization, URL structure, XML sitemaps, robots.txt, and content optimization.",
      "Used Google Analytics, Google Search Console, Microsoft Clarity, and other tools to monitor traffic, user behavior, and site performance.",
      "Improved page speed, mobile responsiveness, and technical website quality.",
      "Collaborated with content, marketing, and business teams to align websites with campaign and brand objectives.",
      "Customized WordPress and Elementor functionality, design, and layouts to meet client and business requirements.",
      "Supported technical SEO best practices to improve indexing, crawling, and search visibility."
    ]'::jsonb,
    '["WordPress", "Elementor", "Bootstrap", "Figma", "Google Analytics", "Google Search Console", "Microsoft Clarity", "Technical SEO"]'::jsonb,
    'Full-Stack Web Developer at TOURKAL INVESTMENTS LIMITED — WordPress, Elementor, SEO, analytics, and digital asset development in Dubai.',
    false, false, true, 4, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6',
    'skymart-web-systems-administrator',
    'SKYMART KENYA',
    'Web & Systems Administrator',
    'Mar 2021 — Mar 2022',
    'Kenya',
    'Freelance',
    'Hybrid',
    'Managed and improved e-commerce website operations, performance, security, and user experience.',
    'Managed and improved e-commerce website operations, performance, security, and user experience.',
    '[
      "Managed and improved e-commerce website operations, performance, security, and user experience.",
      "Maintained e-commerce platform stability, product content, website performance, and customer-facing functionality.",
      "Implemented security practices to protect customer data, transactions, and website reliability."
    ]'::jsonb,
    '[
      "Managed and improved e-commerce website operations, performance, security, and user experience.",
      "Maintained e-commerce platform stability, product content, website performance, and customer-facing functionality.",
      "Implemented security practices to protect customer data, transactions, and website reliability.",
      "Supported inventory-related website workflows, product updates, localization, and content management.",
      "Monitored website speed, usability, and technical issues to improve customer experience.",
      "Collaborated with marketing and design teams to update campaigns, product visuals, and promotional content.",
      "Supported website optimization for mobile users and international audiences.",
      "Assisted with international e-commerce considerations including language, currency, product content, and region-specific user experience."
    ]'::jsonb,
    '["E-commerce", "WordPress", "WooCommerce", "Security", "Performance Optimization", "Localization"]'::jsonb,
    'Web & Systems Administrator at SKYMART KENYA — e-commerce operations, security, performance, and international storefront optimization.',
    false, false, true, 5, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7',
    'metacorp-senior-wordpress-developer',
    'METACORP AGENCY',
    'Senior WordPress Developer',
    'Jan 2020 — Nov 2020',
    'Dubai, United Arab Emirates',
    'Full-time',
    'Hybrid',
    'Promoted to Senior WordPress Developer after taking ownership of complex website builds, theme customization, plugin workflows, and client-facing technical delivery.',
    'Promoted to Senior WordPress Developer after taking ownership of more complex website builds, theme customization, plugin workflows, performance improvements, and client-facing technical delivery.',
    '[
      "Led the development of custom WordPress websites, themes, templates, and page structures based on client requirements.",
      "Customized WordPress plugins, layouts, and website functionality to support project-specific needs.",
      "Improved website performance, mobile responsiveness, security, and on-page usability."
    ]'::jsonb,
    '[
      "Led the development of custom WordPress websites, themes, templates, and page structures based on client requirements.",
      "Customized WordPress plugins, layouts, and website functionality to support project-specific needs.",
      "Improved website performance, mobile responsiveness, security, and on-page usability.",
      "Provided technical guidance on WordPress best practices, CMS structure, content management, and maintainability.",
      "Supported client communication, project handover, troubleshooting, and ongoing website support.",
      "Delivered reliable, responsive, and scalable WordPress solutions across multiple client projects."
    ]'::jsonb,
    '["WordPress", "PHP", "Theme Development", "Plugin Customization", "Performance", "Security"]'::jsonb,
    'Senior WordPress Developer at METACORP AGENCY in Dubai — custom themes, plugins, performance, and client delivery.',
    false, false, true, 6, 3
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8',
    'metacorp-wordpress-developer',
    'METACORP AGENCY',
    'WordPress Developer',
    'Feb 2019 — Dec 2019',
    'Dubai, United Arab Emirates',
    'Full-time',
    'Hybrid',
    'Built, customized, and maintained client websites using WordPress, themes, plugins, and responsive frontend layouts.',
    'Started as a WordPress Developer responsible for building, customizing, and maintaining client websites using WordPress, themes, plugins, and responsive frontend layouts.',
    '[
      "Built and updated WordPress websites based on client briefs, brand guidelines, and design requirements.",
      "Customized themes, pages, menus, forms, plugins, and content structures.",
      "Implemented responsive layouts to ensure websites worked smoothly across desktop, tablet, and mobile devices."
    ]'::jsonb,
    '[
      "Built and updated WordPress websites based on client briefs, brand guidelines, and design requirements.",
      "Customized themes, pages, menus, forms, plugins, and content structures.",
      "Implemented responsive layouts to ensure websites worked smoothly across desktop, tablet, and mobile devices.",
      "Supported website maintenance, bug fixes, plugin updates, basic security checks, and performance improvements.",
      "Collaborated with designers and project teams to turn visual concepts into functional WordPress websites.",
      "Assisted with client website handovers, CMS training, and technical support."
    ]'::jsonb,
    '["WordPress", "HTML", "CSS", "JavaScript", "Responsive Design", "CMS"]'::jsonb,
    'WordPress Developer at METACORP AGENCY in Dubai — client websites, theme customization, and responsive delivery.',
    false, false, true, 7, 3
  )
on conflict (id) do update set
  slug = excluded.slug,
  company = excluded.company,
  role = excluded.role,
  period = excluded.period,
  location = excluded.location,
  employment_type = excluded.employment_type,
  work_mode = excluded.work_mode,
  summary = excluded.summary,
  detail_intro = excluded.detail_intro,
  highlights = excluded.highlights,
  responsibilities = excluded.responsibilities,
  technologies = excluded.technologies,
  seo_description = excluded.seo_description,
  is_current = excluded.is_current,
  featured_on_home = excluded.featured_on_home,
  published = excluded.published,
  sort_order = excluded.sort_order,
  preview_limit = excluded.preview_limit,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 4. Site profile (role, tagline, phone)
-- ---------------------------------------------------------------------------

update public.site_settings
set
  value = value
    || jsonb_build_object(
      'title', 'Ian Sirya | Lead Full-Stack Developer',
      'role', 'Lead Full-Stack Developer & Digital Systems Lead',
      'tagline', 'Building and leading business-critical web platforms, CRM systems, dashboards, booking workflows, and multi-brand digital products.',
      'phone', '+971 52 144 0383',
      'location', 'Dubai, United Arab Emirates'
    ),
  updated_at = now()
where key = 'profile';

-- ---------------------------------------------------------------------------
-- 5. Hero content
-- ---------------------------------------------------------------------------

update public.hero_content
set
  role = 'Lead Full-Stack Developer & Digital Systems Lead',
  left_intro = '["As a lead full-stack developer, I focus on", "building business-critical platforms, CRM systems,", "and scalable digital products."]'::jsonb,
  expertise = 'Ian''s full-stack and digital systems leadership.',
  right_intro = '["A lead developer building reliable CRM workflows,", "booking platforms, dashboards, and multi-brand", "web experiences across the full stack."]'::jsonb,
  right_secondary = '["React, TypeScript, Node.js, Laravel, Supabase,", "WordPress, Shopify, and workflow automation."]'::jsonb,
  tags = '["Lead Developer", "2026"]'::jsonb,
  ticker = '["Full-Stack Development", "CRM Systems", "Booking Platforms", "Dashboard Development", "WordPress", "Shopify", "React", "TypeScript", "Supabase", "Technical SEO", "Workflow Automation"]'::jsonb,
  updated_at = now()
where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';

-- ---------------------------------------------------------------------------
-- 6. Marketing pages (stats, summaries, about copy)
-- ---------------------------------------------------------------------------

update public.marketing_pages
set
  title = 'Ian Sirya | Lead Full-Stack Developer',
  description = 'Building and leading business-critical web platforms, CRM systems, dashboards, booking workflows, and multi-brand digital products.',
  sections = sections || '{
    "capabilities": {
      "eyebrow": "Capabilities",
      "headlines": ["Full-stack platforms", "CRM & booking systems", "Multi-brand delivery"],
      "description": "From student accommodation booking platforms to CRM workflows and multi-brand websites — I translate business requirements into scalable technical solutions across real estate, staffing, e-commerce, nonprofit, and corporate environments.",
      "primaryCta": {"label": "Explore projects", "to": "/portfolio"},
      "secondaryCta": {"label": "About Ian", "to": "/about"}
    },
    "experiencePreview": {
      "eyebrow": "Experience",
      "title": "From WordPress delivery to digital systems leadership",
      "description": "Seven years across agencies, investment firms, e-commerce, and corporate environments — now leading full-stack development and business-critical digital systems at GIOVANNI in Dubai.",
      "actionLabel": "Full timeline",
      "actionTo": "/experience"
    },
    "stack": {
      "eyebrow": "Stack & craft",
      "title": "Tools chosen for real business outcomes",
      "description": "React, TypeScript, Node.js, Laravel, Supabase, PostgreSQL, WordPress, Shopify, Stripe, and analytics — pragmatic choices for velocity, maintainability, and measurable impact."
    },
    "aboutPreview": {
      "eyebrow": "About",
      "title": "Business systems thinking meets hands-on development",
      "descriptionTemplate": "I''m {{name}}, a {{role}} based in {{location}}. I partner with teams who need dependable platforms — CRM workflows, booking systems, dashboards, and multi-brand web products that reduce manual work and improve visibility.",
      "actionLabel": "About me",
      "actionTo": "/about",
      "linkLabel": "Learn more about my approach",
      "stats": [
        {"value": "7+", "label": "Years building production web platforms"},
        {"value": "15+", "label": "Multi-brand websites and digital systems managed"}
      ]
    },
    "workPreview": {
      "eyebrow": "Selected work",
      "title": "Platforms, products, and multi-brand delivery",
      "description": "Case studies and project work spanning booking platforms, CRM concepts, investor sites, e-commerce, and internal business systems.",
      "actionLabel": "All projects",
      "actionTo": "/portfolio"
    }
  }'::jsonb,
  updated_at = now()
where slug = 'home';

update public.marketing_pages
set
  title = 'Building business-critical platforms with engineering discipline',
  description = 'Ian Sirya is a Lead Full-Stack Developer and Digital Systems Lead who blends hands-on development with systems thinking — translating business requirements into scalable CRM workflows, booking platforms, dashboards, and multi-brand web products.',
  sections = '{
    "paragraphs": [
      "I build and improve business-critical web platforms, CRM systems, dashboards, booking workflows, internal tools, and multi-brand digital products. My work spans real estate, student accommodation, staffing operations, e-commerce, nonprofit, beauty, investment, and corporate environments.",
      "I combine hands-on development with stakeholder communication and technical leadership — designing role-based systems, payment integrations, e-signature workflows, analytics tracking, and workflow automation that replace manual processes with structured, scalable business systems.",
      "Whether leading full-stack delivery at GIOVANNI or shipping client platforms remotely, I focus on UI/UX for complex systems, performance, SEO architecture, and integrations that support measurable business outcomes."
    ],
    "cards": [
      "CRM workflows, booking journeys, and role-based admin tools",
      "React, TypeScript, Node.js, Laravel, Supabase, and PostgreSQL platforms",
      "WordPress, Shopify, and multi-brand website management",
      "Payment gateways, e-signature flows, analytics, and API integrations"
    ],
    "primaryCta": {"label": "View projects", "to": "/portfolio"},
    "secondaryCta": {"label": "Start a project", "to": "/contact"}
  }'::jsonb,
  meta = '{"metaDescription": "Learn about Ian Sirya — Lead Full-Stack Developer and Digital Systems Lead in Dubai, focused on CRM systems, booking platforms, and multi-brand digital products."}'::jsonb,
  updated_at = now()
where slug = 'about';

update public.marketing_pages
set
  title = 'Roles that shaped a full-stack and systems practice',
  description = 'A timeline from WordPress agency delivery through investment and e-commerce work to leading digital systems, CRM workflows, and multi-brand platforms in Dubai.',
  sections = '{
    "footerCta": {"label": "Discuss your next role or project", "to": "/contact"}
  }'::jsonb,
  meta = '{"metaDescription": "Professional experience — GIOVANNI, Tourkal Investments, Metacorp Agency, and freelance full-stack delivery."}'::jsonb,
  updated_at = now()
where slug = 'experience';

update public.marketing_pages
set
  sections = sections || '{
    "sidebarIntro": "Whether you need a booking platform, CRM workflow, multi-brand website programme, or full-stack product build — share context on timeline, stakeholders, and business goals so we can move quickly on scope and fit.",
    "remoteNote": "Based in Dubai, UAE. Available for on-site and remote collaboration."
  }'::jsonb,
  updated_at = now()
where slug = 'contact';

-- ---------------------------------------------------------------------------
-- 7. Skills from CV technical stack
-- ---------------------------------------------------------------------------

insert into public.skill_groups (id, title, sort_order, published) values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Frontend', 0, true),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Backend & Data', 1, true),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'CMS, Commerce & Integrations', 2, true),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Product & Delivery', 3, true)
on conflict (id) do update set
  title = excluded.title,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();

delete from public.skill_items
where group_id in (
  'cccccccc-cccc-cccc-cccc-ccccccccccc1',
  'cccccccc-cccc-cccc-cccc-ccccccccccc2',
  'cccccccc-cccc-cccc-cccc-ccccccccccc3',
  'cccccccc-cccc-cccc-cccc-ccccccccccc4'
);

insert into public.skill_items (id, group_id, label, sort_order) values
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'React', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'TypeScript', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'JavaScript', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd04', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Vite', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd05', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'TanStack', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd06', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Tailwind CSS', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd07', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'HTML5 & CSS3', 6),
  ('dddddddd-dddd-dddd-dddd-dddddddddd08', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Responsive Design', 7),
  ('dddddddd-dddd-dddd-dddd-dddddddddd09', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'shadcn / Radix UI', 8),
  ('dddddddd-dddd-dddd-dddd-dddddddddd10', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Node.js', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd11', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Laravel', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd12', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Supabase', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd13', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'PostgreSQL', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd14', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'REST APIs', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd15', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'RPC Workflows', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd16', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Webhooks', 6),
  ('dddddddd-dddd-dddd-dddd-dddddddddd17', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'WordPress', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd18', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Elementor', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd19', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'WooCommerce', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd20', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Shopify', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd21', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Stripe', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd22', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Google Tag Manager', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd23', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Google Analytics', 6),
  ('dddddddd-dddd-dddd-dddd-dddddddddd24', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Google Search Console', 7),
  ('dddddddd-dddd-dddd-dddd-dddddddddd25', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Microsoft Clarity', 8),
  ('dddddddd-dddd-dddd-dddd-dddddddddd26', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Resend & Brevo', 9),
  ('dddddddd-dddd-dddd-dddd-dddddddddd27', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'CRM Systems', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd28', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Booking Systems', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd29', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Internal Dashboards', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd30', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Workflow Automation', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd31', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Role-Based Access Control', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd32', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'E-Signature Workflows', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd33', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Technical SEO', 6),
  ('dddddddd-dddd-dddd-dddd-dddddddddd34', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Cloud Hosting & DNS', 7),
  ('dddddddd-dddd-dddd-dddd-dddddddddd35', 'cccccccc-cccc-cccc-cccc-ccccccccccc4', 'Production Support', 8)
on conflict (id) do update set
  group_id = excluded.group_id,
  label = excluded.label,
  sort_order = excluded.sort_order;
