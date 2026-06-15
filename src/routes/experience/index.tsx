import { createFileRoute, Link } from '@tanstack/react-router'

import { JsonLd } from '../../components/seo/JsonLd'
import { PageShell } from '../../components/layout/PageShell'
import { useExperience } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { fontCopy, textCopySmResponsive } from '../../lib/typography'
import { breadcrumbJsonLd, createPageMeta } from '../../lib/seo'

export const Route = createFileRoute('/experience/')({
  head: () =>
    createPageMeta({
      title: 'Experience',
      description: 'Professional experience timeline.',
      path: '/experience',
    }),
  component: ExperiencePage,
})

function ExperiencePage() {
  const experience = useExperience()
  const page = useMarketingPage('experience')
  const footerCta = getMarketingSection(page, 'footerCta', {
    label: 'Discuss your next role or project',
    to: '/contact',
  })

  return (
    <PageShell
      eyebrow={page?.eyebrow ?? 'Experience'}
      title={page?.title ?? 'Roles that shaped a full stack practice'}
      description={
        page?.description ??
        'A timeline of product engineering across agencies, studios, and product-led teams.'
      }
      backTo="/"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Experience', path: '/experience' },
        ])}
      />

      <div className="mx-auto grid max-w-6xl gap-6">
        {experience.map((item) => (
          <article
            key={item.slug || `${item.company}-${item.period}`}
            className="grid gap-6 border border-[#D8D7C3]/15 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]"
          >
            <div>
              <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/65">
                {item.period}
              </p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] sm:text-5xl">
                {item.role}
              </h2>
              <p className="mt-2 font-display text-xl font-black uppercase text-[#D8D7C3]/80">
                {item.company}
              </p>
              <p className={`mt-2 text-sm text-[#D8D7C3]/65 ${fontCopy}`}>{item.location}</p>
            </div>
            <div>
              <p className={`${textCopySmResponsive} text-[#D8D7C3]/85`}>
                {item.summary}
              </p>
              <ul className={`mt-5 grid gap-3 text-sm text-[#D8D7C3]/75 ${fontCopy}`}>
                {item.highlights.slice(0, item.previewLimit).map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span aria-hidden="true" className="text-[#D8D7C3]/35">
                      —
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              {item.slug ? (
                <Link
                  to="/experience/$slug"
                  params={{ slug: item.slug }}
                  className="mt-6 inline-flex font-display text-sm font-black uppercase underline underline-offset-4 transition-colors hover:text-white"
                >
                  View full role details
                </Link>
              ) : null}
            </div>
          </article>
        ))}

        <Link
          to={footerCta.to}
          className="mt-4 inline-flex w-fit font-display text-sm font-black uppercase underline underline-offset-4 transition-colors hover:text-white"
        >
          {footerCta.label}
        </Link>
      </div>
    </PageShell>
  )
}
