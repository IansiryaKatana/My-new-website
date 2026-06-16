import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { JsonLd } from '../../components/seo/JsonLd'
import { PageShell } from '../../components/layout/PageShell'
import { InquiryTrigger } from '../../components/inquiry/InquiryTrigger'
import { buttonVariants } from '../../components/ui/button'
import { useCms } from '../../contexts/CmsContext'
import type { ExperienceItem } from '../../data/experience'
import { fetchExperienceBySlug } from '../../lib/cms/fetchExperience'
import { getSupabase } from '../../integrations/supabase/client'
import {
  experienceDetailPath,
  formatEmploymentMeta,
} from '../../lib/experienceLinks'
import { fontCopy, textCopyLg } from '../../lib/typography'
import { breadcrumbJsonLd, createPageMeta } from '../../lib/seo'

export const Route = createFileRoute('/experience/$slug')({
  loader: async ({ params }) => {
    const supabase = getSupabase()
    const item = supabase
      ? await fetchExperienceBySlug(supabase, params.slug)
      : null

    if (!item) {
      throw notFound()
    }

    return item
  },
  head: ({ loaderData }) => {
    const item = loaderData
    if (!item) {
      return createPageMeta({
        title: 'Experience not found',
        description: 'The requested role could not be found.',
        path: '/experience',
      })
    }

    return createPageMeta({
      title: `${item.role} at ${item.company} | Ian Sirya`,
      description: item.seoDescription || item.summary,
      path: experienceDetailPath(item.slug),
    })
  },
  component: ExperienceDetailPage,
})

function ExperienceDetailPage() {
  const item: ExperienceItem = Route.useLoaderData()
  const { snapshot } = useCms()
  const employmentMeta = formatEmploymentMeta(item)
  const responsibilities =
    item.responsibilities.length > 0 ? item.responsibilities : item.highlights
  const intentPages = Object.values(snapshot.marketingPages)
    .filter((page) => page.intentPage)
    .filter((page) => {
      const combined = `${page.title} ${page.description} ${page.targetService} ${page.targetKeyword}`.toLowerCase()
      return (
        combined.includes(item.role.toLowerCase()) ||
        combined.includes(item.company.toLowerCase()) ||
        combined.includes(item.location.toLowerCase())
      )
    })
    .slice(0, 3)

  return (
    <PageShell
      eyebrow={item.period}
      title={item.role}
      description={`${item.company} · ${item.location}${employmentMeta ? ` · ${employmentMeta}` : ''}`}
      backTo="/experience"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Experience', path: '/experience' },
          { name: item.role, path: experienceDetailPath(item.slug) },
        ])}
      />

      <div className="mx-auto grid max-w-6xl gap-10">
        <div className="grid gap-6 border border-[#D8D7C3]/15 p-6 sm:p-8">
          {item.isCurrent ? (
            <p className="w-fit border border-[#D8D7C3]/25 px-3 py-1 font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/75">
              Current role
            </p>
          ) : null}

          <p className={`${textCopyLg} text-[#D8D7C3]/85`}>
            {item.detailIntro || item.summary}
          </p>

          {item.technologies.length > 0 ? (
            <div>
              <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/60">
                Technologies & tools
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <li
                    key={tech}
                    className={`border border-[#D8D7C3]/15 px-3 py-1 text-sm text-[#D8D7C3]/80 ${fontCopy}`}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="border border-[#D8D7C3]/15 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-black uppercase sm:text-3xl">
            Responsibilities
          </h2>
          <ul className={`mt-6 grid gap-4 text-sm text-[#D8D7C3]/80 sm:text-base ${fontCopy}`}>
            {responsibilities.map((responsibility) => (
              <li key={responsibility} className="flex gap-3 leading-relaxed">
                <span aria-hidden="true" className="text-[#D8D7C3]/35">
                  —
                </span>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to="/experience" className={buttonVariants({ variant: 'lightMuted' })}>
            Back to experience
          </Link>
          <InquiryTrigger
            variant="light"
            inquiry={{
              source: 'experience',
              sourceRef: item.slug ?? item.company,
              prefillMessage: `I'd like to discuss a project related to my ${item.role} experience at ${item.company}.`,
            }}
          >
            Discuss a project
          </InquiryTrigger>
        </div>
        {intentPages.length > 0 ? (
          <div className="grid gap-4 border-t border-[#D8D7C3]/10 pt-8 md:grid-cols-2">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[#D8D7C3]/65">
              Related services
            </h2>
            <div className="grid gap-3">
              {intentPages.map((page) => (
                <Link
                  key={page.slug}
                  to="/i/$slug"
                  params={{ slug: page.slug }}
                  className="group flex items-center justify-between border-b border-[#D8D7C3]/15 py-3 font-display text-xl font-black uppercase transition-colors hover:text-white"
                >
                  {page.title}
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
        ) : null}
      </div>
    </PageShell>
  )
}
