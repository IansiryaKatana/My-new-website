import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { JsonLd } from '../../components/seo/JsonLd'
import { PageShell } from '../../components/layout/PageShell'
import { buttonVariants } from '../../components/ui/button'
import { useProjects, useSiteConfig } from '../../contexts/CmsContext'
import { fetchProjectBySlug } from '../../lib/cms/fetchProject'
import { projectCaseStudyPath, resolveProjectHref } from '../../lib/projectLinks'
import { fontCopy, textCopyLg } from '../../lib/typography'
import { breadcrumbJsonLd, createPageMeta } from '../../lib/seo'

export const Route = createFileRoute('/portfolio/$slug')({
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug(params.slug)
    if (!project) {
      throw notFound()
    }
    return project
  },
  head: ({ loaderData }) => {
    const project = loaderData
    if (!project) {
      return createPageMeta({
        title: 'Project not found',
        description: 'The requested project could not be found.',
        path: '/portfolio',
      })
    }

    const description = project.seoDescription ?? project.summary
    const ogImage =
      project.coverImageUrl ??
      project.featuredImageUrl ??
      project.thumbnailUrls?.[0] ??
      '/images/ian-cutout.svg'

    return createPageMeta({
      title: `${project.title} | Ian Sirya`,
      description,
      path: projectCaseStudyPath(project.slug),
      image: ogImage,
      type: 'article',
    })
  },
  component: PortfolioDetailPage,
})

function ProjectReferenceLink({
  href,
  isExternal,
  kind,
  className,
}: {
  href: string
  isExternal: boolean
  kind: 'external' | 'demo' | 'internal'
  className?: string
}) {
  const label =
    kind === 'demo' ? 'Launch demo' : isExternal ? 'View live site' : 'View project'

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        <span aria-hidden="true" className="ml-2">
          ↗
        </span>
      </a>
    )
  }

  return (
    <a href={href} className={className}>
      {label}
      <span aria-hidden="true" className="ml-2">
        →
      </span>
    </a>
  )
}

function PortfolioDetailPage() {
  const project = Route.useLoaderData()
  const projects = useProjects()
  const siteConfig = useSiteConfig()
  const referenceLink = resolveProjectHref(project.href)
  const gallery = project.thumbnailUrls ?? []

  return (
    <PageShell
      eyebrow={`Case study · ${project.year}`}
      title={project.title}
      description={project.summary}
      backTo="/portfolio"
      backLabel="All work"
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Portfolio', path: '/portfolio' },
            { name: project.title, path: projectCaseStudyPath(project.slug) },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.seoDescription ?? project.description,
            author: {
              '@type': 'Person',
              name: siteConfig.name,
            },
            datePublished: project.year,
            keywords: [...project.stack, ...project.tags].join(', '),
            ...(project.coverImageUrl ? { image: project.coverImageUrl } : {}),
            ...(referenceLink
              ? { url: referenceLink.isExternal ? referenceLink.href : `${siteConfig.url}${referenceLink.href}` }
              : {}),
          },
        ]}
      />

      <div className="mx-auto grid max-w-6xl gap-10">
        {project.coverImageUrl ? (
          <figure className="overflow-hidden border border-[#D8D7C3]/15">
            <img
              src={project.coverImageUrl}
              alt={`${project.title} cover`}
              className="aspect-[16/9] w-full object-cover"
              loading="eager"
            />
          </figure>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-3">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#D8D7C3]/25 px-4 py-2 font-display text-xs font-black uppercase tracking-[0.12em]"
              >
                {tech}
              </span>
            ))}
          </div>
          {referenceLink ? (
            <ProjectReferenceLink
              href={referenceLink.href}
              isExternal={referenceLink.isExternal}
              kind={referenceLink.kind}
              className={buttonVariants({ variant: 'light' })}
            />
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 text-[#D8D7C3]/85">
            <p className={textCopyLg}>{project.description}</p>

            {gallery.length > 0 ? (
              <div>
                <h2 className="font-display text-2xl font-black uppercase">Gallery</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {gallery.map((url) => (
                    <figure
                      key={url}
                      className="overflow-hidden border border-[#D8D7C3]/15"
                    >
                      <img
                        src={url}
                        alt=""
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            {project.outcomes.length > 0 ? (
              <div>
                <h2 className="font-display text-2xl font-black uppercase">Outcomes</h2>
                <ul className={`mt-4 grid gap-3 text-sm sm:text-base ${fontCopy}`}>
                  {project.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3">
                      <span aria-hidden="true" className="text-[#D8D7C3]/35">
                        —
                      </span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="grid gap-4 self-start border border-[#D8D7C3]/15 p-6">
            <div>
              <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                Role
              </p>
              <p className="mt-2 font-display text-xl font-black uppercase">{project.role}</p>
            </div>
            <div>
              <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                Year
              </p>
              <p className="mt-2 font-display text-xl font-black uppercase">{project.year}</p>
            </div>
            {project.tags.length > 0 ? (
              <div>
                <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                  Tags
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#D8D7C3]/25 px-3 py-1 font-display text-[0.65rem] font-black uppercase tracking-[0.12em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {referenceLink ? (
              <div className="border-t border-[#D8D7C3]/10 pt-4">
                <ProjectReferenceLink
                  href={referenceLink.href}
                  isExternal={referenceLink.isExternal}
                  kind={referenceLink.kind}
                  className={`${buttonVariants({ variant: 'outline' })} w-full justify-center`}
                />
              </div>
            ) : null}
          </aside>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#D8D7C3]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/portfolio"
            className="font-display text-sm font-black uppercase underline underline-offset-4 transition-colors hover:text-white"
          >
            Back to portfolio
          </Link>
          <Link to="/contact" className={buttonVariants({ variant: 'light' })}>
            Discuss a similar build
          </Link>
        </div>

        <div className="grid gap-4 border-t border-[#D8D7C3]/10 pt-8 md:grid-cols-2">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#D8D7C3]/65">
            More work
          </h2>
          <div className="grid gap-3">
            {projects
              .filter((item) => item.slug !== project.slug)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.slug}
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="group flex items-center justify-between border-b border-[#D8D7C3]/15 py-3 font-display text-xl font-black uppercase transition-colors hover:text-white"
                >
                  {item.title}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
