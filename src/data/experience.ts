export type ExperienceItem = {
  slug: string
  company: string
  role: string
  period: string
  location: string
  employmentType: string
  workMode: string
  summary: string
  detailIntro: string
  highlights: string[]
  responsibilities: string[]
  technologies: string[]
  seoDescription: string
  isCurrent: boolean
  previewLimit: number
}

export const experience: ExperienceItem[] = [
  {
    slug: 'giovanni-lead-full-stack-digital-systems-lead',
    company: 'GIOVANNI',
    role: 'Lead Full-Stack Developer & Digital Systems Lead',
    period: 'Oct 2025 — Present',
    location: 'Dubai, United Arab Emirates',
    employmentType: 'Full-time',
    workMode: 'On-site',
    summary:
      'Leading business-critical digital systems, internal platforms, CRM workflows, dashboards, booking journeys, and multi-brand web applications.',
    detailIntro:
      'Promoted into a wider technical leadership role focused on building and improving business-critical digital systems, internal platforms, CRM workflows, dashboards, booking journeys, and multi-brand web applications.',
    highlights: [
      'Lead full-stack development across company websites, internal systems, dashboards, and operational platforms.',
      'Design and improve CRM workflows, booking processes, student accommodation journeys, payment flows, and role-based admin tools.',
      'Translate requirements from directors, operations, sales, finance, marketing, and customer service teams into scalable technical solutions.',
    ],
    responsibilities: [
      'Lead full-stack development across company websites, internal systems, dashboards, and operational platforms.',
      'Design and improve CRM workflows, booking processes, student accommodation journeys, payment flows, and role-based admin tools.',
      'Translate requirements from directors, operations, sales, finance, marketing, and customer service teams into scalable technical solutions.',
      'Work across React, TypeScript, Node.js, Laravel, WordPress, Shopify, Supabase, APIs, analytics tools, and cloud-based environments.',
      'Manage integrations including payment gateways, CRM workflows, analytics tracking, Google Tag Manager, email systems, and third-party APIs.',
      'Identify operational gaps and manual processes, then design improved software workflows to increase efficiency, visibility, and control.',
      'Support digital transformation initiatives by replacing disconnected manual processes with structured, scalable business systems.',
      'Improve UI/UX for complex systems including dashboards, booking interfaces, form journeys, cancelled-state handling, admin workflows, and role-based access.',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'Laravel',
      'WordPress',
      'Shopify',
      'Supabase',
      'PostgreSQL',
      'REST APIs',
      'Stripe',
      'Google Tag Manager',
      'Google Analytics',
    ],
    seoDescription:
      'Lead Full-Stack Developer & Digital Systems Lead at GIOVANNI in Dubai — CRM workflows, booking platforms, dashboards, and multi-brand digital systems.',
    isCurrent: true,
    previewLimit: 3,
  },
  {
    slug: 'giovanni-lead-web-developer',
    company: 'GIOVANNI',
    role: 'Lead Web Developer',
    period: 'Oct 2024 — Sep 2025',
    location: 'Dubai, United Arab Emirates',
    employmentType: 'Full-time',
    workMode: 'On-site',
    summary:
      'Promoted to Lead Web Developer after taking ownership of multiple company websites, integrations, technical workflows, and delivery coordination across business units.',
    detailIntro:
      'Promoted from Web Developer to Lead Web Developer after taking ownership of multiple company websites, integrations, technical workflows, and delivery coordination across business units.',
    highlights: [
      'Led development and maintenance of subsidiary websites, landing pages, CMS platforms, and digital assets.',
      'Coordinated with designers, developers, marketers, and stakeholders to deliver technical updates and campaign requirements.',
      'Managed website performance, mobile responsiveness, SEO structure, bug fixes, plugin updates, hosting support, and security improvements.',
    ],
    responsibilities: [
      'Led development and maintenance of subsidiary websites, landing pages, CMS platforms, and digital assets.',
      'Coordinated with designers, developers, marketers, and stakeholders to deliver technical updates and campaign requirements.',
      'Managed website performance, mobile responsiveness, SEO structure, bug fixes, plugin updates, hosting support, and security improvements.',
      'Implemented API connections, form workflows, CRM integrations, analytics tracking, and marketing tool setups.',
      'Supported project planning, task allocation, delivery timelines, QA reviews, and technical troubleshooting.',
      'Improved website quality, user experience, speed, scalability, and reliability across multiple business brands.',
      'Built investor-focused websites and microsites to showcase real estate, business, and corporate projects.',
      'Provided advanced technical support for website issues and collaborated with customer service and operations teams.',
    ],
    technologies: [
      'WordPress',
      'Elementor',
      'Shopify',
      'Google Analytics',
      'Google Tag Manager',
      'SEO',
      'API Integrations',
      'CRM Workflows',
    ],
    seoDescription:
      'Lead Web Developer at GIOVANNI — multi-brand website delivery, integrations, SEO, performance, and technical coordination in Dubai.',
    isCurrent: false,
    previewLimit: 3,
  },
]
