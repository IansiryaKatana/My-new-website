import { createFileRoute } from '@tanstack/react-router'

import { JsonLd } from '../../components/seo/JsonLd'
import { PageShell } from '../../components/layout/PageShell'
import { ProjectCard } from '../../components/projects/ProjectCard'
import { useProjects, useSiteConfig } from '../../contexts/CmsContext'
import { useMarketingPage } from '../../lib/cms/useMarketingPage'
import { breadcrumbJsonLd, createPageMeta } from '../../lib/seo'
import { projectCaseStudyPath } from '../../lib/projectLinks'

export const Route = createFileRoute('/portfolio/')({
  head: () =>
    createPageMeta({
      title: 'Portfolio | Ian Sirya',
      description:
        'Selected full stack projects and case studies — commerce, design systems, analytics, and platform builds.',
      path: '/portfolio',
    }),
  component: PortfolioPage,
})

function PortfolioPage() {
  const projects = useProjects()
  const siteConfig = useSiteConfig()
  const page = useMarketingPage('projects')

  return (
    <PageShell
      eyebrow={page?.eyebrow ?? 'Portfolio'}
      title={page?.title ?? 'Work that balances craft, performance and maintainability'}
      description={
        page?.description ??
        'Explore full stack case studies — from customer-facing products to internal platforms.'
      }
      backTo="/"
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Portfolio', path: '/portfolio' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `Portfolio by ${siteConfig.name}`,
            url: `${siteConfig.url}/portfolio`,
            hasPart: projects.map((project) => ({
              '@type': 'CreativeWork',
              name: project.title,
              url: `${siteConfig.url}${projectCaseStudyPath(project.slug)}`,
              description: project.seoDescription ?? project.summary,
              ...(project.coverImageUrl ? { image: project.coverImageUrl } : {}),
            })),
          },
        ]}
      />

      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </PageShell>
  )
}
