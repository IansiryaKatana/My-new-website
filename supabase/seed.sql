-- Seed from bundled static content (run after migration + create auth user)
-- Safe to re-run: uses ON CONFLICT upserts and fixed UUIDs where needed

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------

insert into public.site_settings (key, value) values
  ('profile', '{
    "name": "Ian Sirya",
    "title": "Ian Sirya | Full Stack Developer",
    "role": "Full Stack Developer",
    "tagline": "Building reliable, fast and user-focused web experiences across the full stack.",
    "email": "Hello@iankatana.com",
    "location": "Dubai, United Arab Emirates",
    "url": "https://iankatana.com",
    "social": {
      "github": "https://github.com/iansirya",
      "linkedin": "https://linkedin.com/in/iansirya",
      "twitter": "https://x.com/iansirya"
    },
    "navigation": [
      {"label": "Work", "href": "/portfolio", "description": "Selected projects"},
      {"label": "About", "href": "/about", "description": "Background & approach"},
      {"label": "Certifications", "href": "/certifications", "description": "Licenses & credentials"},
      {"label": "Experience", "href": "/experience", "description": "Roles & milestones"},
      {"label": "Contact", "href": "/contact", "description": "Start a project"}
    ],
    "homeSections": [
      {"label": "Capabilities", "href": "/#capabilities"},
      {"label": "Experience", "href": "/#experience"},
      {"label": "Stack", "href": "/#stack"},
      {"label": "Contact", "href": "/#contact"}
    ],
    "ogImage": "/images/og-default.jpg"
  }'::jsonb),
  ('theme', '{
    "primary": "#765F47",
    "surface": "#34392E",
    "cream": "#D8D7C3",
    "dark": "#10140D"
  }'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ---------------------------------------------------------------------------
-- hero_content (singleton)
-- ---------------------------------------------------------------------------

insert into public.hero_content (
  id, name, role, left_intro, expertise, right_intro, right_secondary,
  cta_label, cta_href, start_project_label, start_project_href,
  tags, ticker, navigation, subject_alt, badge_text, published
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Ian Sirya',
  'Full Stack Developer',
  '["As a full stack developer, I focus on", "building fast, scalable and impactful", "digital products."]'::jsonb,
  'Ian''s development expertise delivered.',
  '["A full stack digital platform", "developer building reliable, fast and", "user-focused web experiences."]'::jsonb,
  '["Exceptional frontend, backend", "and product engineering."]'::jsonb,
  'Let''s talk', '/contact', 'Start a project', '/contact',
  '["Full Stack", "2026"]'::jsonb,
  '["Frontend Development", "Backend Development", "UI Engineering", "API Systems", "Web Applications", "Full Stack Development"]'::jsonb,
  '[
    {"label": "Work", "href": "/portfolio"},
    {"label": "About", "href": "/about"},
    {"label": "Certifications", "href": "/certifications"},
    {"label": "Experience", "href": "/experience"},
    {"label": "Contact", "href": "/contact"}
  ]'::jsonb,
  'Portrait of Ian Sirya wearing round sunglasses',
  '05',
  true
) on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  left_intro = excluded.left_intro,
  expertise = excluded.expertise,
  right_intro = excluded.right_intro,
  right_secondary = excluded.right_secondary,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  start_project_label = excluded.start_project_label,
  start_project_href = excluded.start_project_href,
  tags = excluded.tags,
  ticker = excluded.ticker,
  navigation = excluded.navigation,
  subject_alt = excluded.subject_alt,
  badge_text = excluded.badge_text,
  published = excluded.published,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

insert into public.projects (
  slug, title, summary, description, year, role, stack, tags, outcomes,
  featured, published, sort_order
) values
  (
    'nexus-commerce',
    'Nexus Commerce',
    'Headless e-commerce platform with real-time inventory and checkout flows.',
    'Designed and shipped a modular commerce stack with SSR storefront, inventory APIs, and admin dashboards. Focused on conversion-safe checkout, accessible UI, and observability across payment webhooks.',
    '2025',
    'Lead Full Stack Developer',
    '["React", "TypeScript", "Node.js", "PostgreSQL", "Redis"]'::jsonb,
    '["E-commerce", "Platform"]'::jsonb,
    '["Reduced checkout abandonment with progressive disclosure and resilient payment retries.", "Cut admin task time with role-based dashboards and bulk catalog tooling."]'::jsonb,
    true, true, 0
  ),
  (
    'atlas-design-system',
    'Atlas Design System',
    'Token-driven component library adopted across three product squads.',
    'Built an editorial-meets-product design system with semantic tokens, accessible primitives, and documentation that engineers could ship against without design bottlenecks.',
    '2025',
    'Frontend Engineer',
    '["React", "Storybook", "Tailwind CSS", "Figma"]'::jsonb,
    '["Design System", "UI"]'::jsonb,
    '["Unified visual language across marketing and app surfaces.", "Accelerated feature delivery with documented patterns and variants."]'::jsonb,
    true, true, 1
  ),
  (
    'pulse-analytics',
    'Pulse Analytics',
    'Operational dashboard for product metrics, cohorts, and experiment readouts.',
    'Delivered a performant analytics workspace with charting, saved views, and export pipelines. Optimized queries and caching so teams could explore data without waiting on batch jobs.',
    '2024',
    'Full Stack Developer',
    '["React", "TanStack Query", "Python", "BigQuery"]'::jsonb,
    '["Analytics", "Dashboard"]'::jsonb,
    '["Gave PMs self-serve experiment summaries within minutes of launch.", "Improved dashboard TTI with route-level code splitting and query prefetch."]'::jsonb,
    true, true, 2
  ),
  (
    'meridian-booking',
    'Meridian Booking',
    'Multi-tenant scheduling app with calendar sync and notification workflows.',
    'End-to-end booking product spanning availability rules, timezone-safe scheduling, email/SMS reminders, and Stripe-backed deposits for service businesses.',
    '2024',
    'Full Stack Developer',
    '["Next.js", "Prisma", "PostgreSQL", "Stripe"]'::jsonb,
    '["SaaS", "Scheduling"]'::jsonb,
    '["Launched MVP in eight weeks with validated booking flows on mobile.", "Handled double-booking edge cases with optimistic UI and server reconciliation."]'::jsonb,
    false, true, 3
  ),
  (
    'harbor-api-gateway',
    'Harbor API Gateway',
    'Internal gateway standardizing auth, rate limits, and service routing.',
    'Implemented a gateway layer with JWT validation, per-tenant quotas, structured logging, and OpenAPI-backed documentation for partner integrations.',
    '2023',
    'Backend Engineer',
    '["Node.js", "Express", "Redis", "Docker"]'::jsonb,
    '["API", "Infrastructure"]'::jsonb,
    '["Centralized auth patterns that removed duplicated middleware across services.", "Improved incident response with correlated request IDs and health probes."]'::jsonb,
    false, true, 4
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  year = excluded.year,
  role = excluded.role,
  stack = excluded.stack,
  tags = excluded.tags,
  outcomes = excluded.outcomes,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- experience_items
-- ---------------------------------------------------------------------------

insert into public.experience_items (
  id, company, role, period, location, summary, highlights,
  featured_on_home, published, sort_order
) values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'Northline Labs',
    'Senior Full Stack Developer',
    '2024 — Present',
    'Remote',
    'Owns product delivery across React frontends, Node APIs, and data layers for B2B SaaS clients.',
    '["Led rebuild of a legacy dashboard into a typed React + TanStack stack.", "Introduced CI quality gates, preview environments, and performance budgets.", "Mentored two mid-level engineers on system design and code review practices."]'::jsonb,
    true, true, 0
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'Studio Meridian',
    'Full Stack Developer',
    '2022 — 2024',
    'Nairobi, Kenya',
    'Shipped client platforms from discovery through launch with emphasis on maintainable architecture.',
    '["Delivered five production launches spanning commerce, booking, and internal tools.", "Standardized API contracts and shared UI primitives across engagements.", "Partnered with design on responsive systems that held up on low-end devices."]'::jsonb,
    true, true, 1
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'OpenCraft Agency',
    'Frontend Engineer',
    '2020 — 2022',
    'Nairobi, Kenya',
    'Built marketing sites and product shells with animation, accessibility, and SEO as first-class requirements.',
    '["Improved Core Web Vitals on flagship campaigns through image strategy and code splitting.", "Implemented accessible navigation patterns reused across client portfolios.", "Collaborated on component libraries that reduced handoff friction with design."]'::jsonb,
    false, true, 2
  )
on conflict (id) do update set
  company = excluded.company,
  role = excluded.role,
  period = excluded.period,
  location = excluded.location,
  summary = excluded.summary,
  highlights = excluded.highlights,
  featured_on_home = excluded.featured_on_home,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- skill_groups + skill_items
-- ---------------------------------------------------------------------------

insert into public.skill_groups (id, title, sort_order, published) values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Frontend', 0, true),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Backend', 1, true),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Product', 2, true)
on conflict (id) do update set
  title = excluded.title,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();

insert into public.skill_items (id, group_id, label, sort_order) values
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'React', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'TypeScript', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'TanStack Router', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd04', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Tailwind CSS', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd05', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Accessibility', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd06', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Performance', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd07', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Node.js', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd08', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'REST APIs', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd09', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'PostgreSQL', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd10', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Redis', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd11', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Auth & sessions', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd12', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Webhooks', 5),
  ('dddddddd-dddd-dddd-dddd-dddddddddd13', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'System design', 0),
  ('dddddddd-dddd-dddd-dddd-dddddddddd14', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Technical discovery', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd15', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Design systems', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd16', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'CI/CD', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddd17', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Observability', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddd18', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Documentation', 5)
on conflict (id) do update set
  group_id = excluded.group_id,
  label = excluded.label,
  sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- marketing_pages (page copy + home section headings)
-- ---------------------------------------------------------------------------

insert into public.marketing_pages (
  slug, title, eyebrow, description, body_html, sections, meta, published, sort_order
) values
  (
    'home',
    'Ian Sirya | Full Stack Developer',
    null,
    'Building reliable, fast and user-focused web experiences across the full stack.',
    '',
    '{
      "capabilities": {
        "eyebrow": "Capabilities",
        "headlines": ["Frontend systems", "Backend platforms", "Product engineering"],
        "description": "From editorial marketing experiences to multi-tenant SaaS — I design architectures that stay fast under real traffic and easy to extend after launch.",
        "primaryCta": {"label": "Explore projects", "to": "/projects"},
        "secondaryCta": {"label": "About Ian", "to": "/about"}
      },
      "contactCta": {
        "eyebrow": "Start a project",
        "title": "Let''s build something reliable and memorable.",
        "ctaLabel": "Contact Ian",
        "ctaTo": "/contact"
      },
      "workPreview": {
        "eyebrow": "Selected work",
        "title": "Projects built for scale, clarity and craft",
        "description": "A sample of full stack engagements spanning commerce, design systems, analytics, and platform APIs.",
        "actionLabel": "All projects",
        "actionTo": "/projects"
      },
      "experiencePreview": {
        "eyebrow": "Experience",
        "title": "Shipping products across agencies and product teams",
        "description": "From frontend craft to platform ownership — focused on reliable delivery and maintainable systems.",
        "actionLabel": "Full timeline",
        "actionTo": "/experience"
      },
      "stack": {
        "eyebrow": "Stack & craft",
        "title": "Tools chosen for velocity without sacrificing quality",
        "description": "Pragmatic full stack choices — typed frontends, dependable APIs, and observability from day one."
      },
      "aboutPreview": {
        "eyebrow": "About",
        "title": "Editorial craft meets production engineering",
        "descriptionTemplate": "I''m {{name}}, a {{role}} based in {{location}}. I partner with teams who want memorable interfaces backed by dependable systems.",
        "actionLabel": "About me",
        "actionTo": "/about",
        "linkLabel": "Learn more about my approach",
        "stats": [
          {"value": "5+", "label": "Years shipping production web products"},
          {"value": "20+", "label": "Launches across SaaS, commerce, and platforms"}
        ]
      }
    }'::jsonb,
    '{}'::jsonb,
    true, 0
  ),
  (
    'about',
    'Building memorable products with engineering discipline',
    'About',
    'Ian Sirya is a full stack developer who blends editorial design sensibility with production-grade architecture — from discovery through launch and iteration.',
    '',
    '{
      "paragraphs": [
        "I help teams ship web products that feel intentional — fast interfaces, clear information architecture, and backends that stay observable as complexity grows.",
        "My work spans agency delivery and in-house product teams. I care about the details users feel immediately: typography, motion, responsive layouts — and the details they never see: schema design, caching, testing, and deployment safety."
      ],
      "cards": [
        "Discovery workshops that align design, engineering, and stakeholders",
        "Typed React frontends with accessible, token-driven UI",
        "APIs and data models designed for change, not just launch day",
        "Documentation and handoff that keeps velocity after go-live"
      ],
      "primaryCta": {"label": "View projects", "to": "/projects"},
      "secondaryCta": {"label": "Start a project", "to": "/contact"}
    }'::jsonb,
    '{"metaDescription": "Learn about Ian Sirya, a full stack developer focused on editorial-quality interfaces and dependable full stack systems."}'::jsonb,
    true, 1
  ),
  (
    'contact',
    'Let''s build something reliable and memorable',
    'Contact',
    'Share your timeline, goals, and constraints. I typically reply within one business day.',
    '',
    '{
      "sidebarIntro": "Whether you need a full product build, a performance-focused frontend pass, or API/platform work — send context up front so we can move quickly on scope and fit.",
      "remoteNote": "Available for remote collaboration."
    }'::jsonb,
    '{"metaDescription": "Get in touch for full stack development and product engineering."}'::jsonb,
    true, 2
  ),
  (
    'projects',
    'Work that balances craft, performance and maintainability',
    'Projects',
    'Explore full stack case studies — from customer-facing products to internal platforms.',
    '',
    '{}'::jsonb,
    '{"metaDescription": "Case studies and selected projects."}'::jsonb,
    true, 3
  ),
  (
    'experience',
    'Roles that shaped a full stack practice',
    'Experience',
    'A timeline of product engineering across agencies, studios, and product-led teams.',
    '',
    '{
      "footerCta": {"label": "Discuss your next role or project", "to": "/contact"}
    }'::jsonb,
    '{"metaDescription": "Professional experience timeline."}'::jsonb,
    true, 4
  )
on conflict (slug) do update set
  title = excluded.title,
  eyebrow = excluded.eyebrow,
  description = excluded.description,
  body_html = excluded.body_html,
  sections = excluded.sections,
  meta = excluded.meta,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();
