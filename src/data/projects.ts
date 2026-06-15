export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  year: string
  role: string
  stack: string[]
  tags: string[]
  featured: boolean
  href?: string
  coverImageUrl?: string
  featuredImageUrl?: string
  thumbnailUrls?: string[]
  seoDescription?: string
  outcomes: string[]
}

export const projects: Project[] = [
  {
    slug: 'nexus-commerce',
    title: 'Nexus Commerce',
    summary:
      'Headless e-commerce platform with real-time inventory and checkout flows.',
    description:
      'Designed and shipped a modular commerce stack with SSR storefront, inventory APIs, and admin dashboards. Focused on conversion-safe checkout, accessible UI, and observability across payment webhooks.',
    year: '2025',
    role: 'Lead Full Stack Developer',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    tags: ['E-commerce', 'Platform'],
    featured: true,
    outcomes: [
      'Reduced checkout abandonment with progressive disclosure and resilient payment retries.',
      'Cut admin task time with role-based dashboards and bulk catalog tooling.',
    ],
  },
  {
    slug: 'atlas-design-system',
    title: 'Atlas Design System',
    summary:
      'Token-driven component library adopted across three product squads.',
    description:
      'Built an editorial-meets-product design system with semantic tokens, accessible primitives, and documentation that engineers could ship against without design bottlenecks.',
    year: '2025',
    role: 'Frontend Engineer',
    stack: ['React', 'Storybook', 'Tailwind CSS', 'Figma'],
    tags: ['Design System', 'UI'],
    featured: true,
    outcomes: [
      'Unified visual language across marketing and app surfaces.',
      'Accelerated feature delivery with documented patterns and variants.',
    ],
  },
  {
    slug: 'pulse-analytics',
    title: 'Pulse Analytics',
    summary:
      'Operational dashboard for product metrics, cohorts, and experiment readouts.',
    description:
      'Delivered a performant analytics workspace with charting, saved views, and export pipelines. Optimized queries and caching so teams could explore data without waiting on batch jobs.',
    year: '2024',
    role: 'Full Stack Developer',
    stack: ['React', 'TanStack Query', 'Python', 'BigQuery'],
    tags: ['Analytics', 'Dashboard'],
    featured: true,
    outcomes: [
      'Gave PMs self-serve experiment summaries within minutes of launch.',
      'Improved dashboard TTI with route-level code splitting and query prefetch.',
    ],
  },
  {
    slug: 'meridian-booking',
    title: 'Meridian Booking',
    summary:
      'Multi-tenant scheduling app with calendar sync and notification workflows.',
    description:
      'End-to-end booking product spanning availability rules, timezone-safe scheduling, email/SMS reminders, and Stripe-backed deposits for service businesses.',
    year: '2024',
    role: 'Full Stack Developer',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    tags: ['SaaS', 'Scheduling'],
    featured: false,
    outcomes: [
      'Launched MVP in eight weeks with validated booking flows on mobile.',
      'Handled double-booking edge cases with optimistic UI and server reconciliation.',
    ],
  },
  {
    slug: 'harbor-api-gateway',
    title: 'Harbor API Gateway',
    summary:
      'Internal gateway standardizing auth, rate limits, and service routing.',
    description:
      'Implemented a gateway layer with JWT validation, per-tenant quotas, structured logging, and OpenAPI-backed documentation for partner integrations.',
    year: '2023',
    role: 'Backend Engineer',
    stack: ['Node.js', 'Express', 'Redis', 'Docker'],
    tags: ['API', 'Infrastructure'],
    featured: false,
    outcomes: [
      'Centralized auth patterns that removed duplicated middleware across services.',
      'Improved incident response with correlated request IDs and health probes.',
    ],
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured)
}

