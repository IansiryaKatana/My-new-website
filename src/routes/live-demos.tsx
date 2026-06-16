import { createFileRoute, Link } from '@tanstack/react-router'

import { LiveDemosDisplay } from '../components/live-demos/LiveDemosDisplay'
import { JsonLd } from '../components/seo/JsonLd'
import { PageShell } from '../components/layout/PageShell'
import { useProjects } from '../contexts/CmsContext'
import { getLiveDemoProjects } from '../lib/cms/queries'
import { getMarketingSection, useMarketingPage } from '../lib/cms/useMarketingPage'
import { breadcrumbJsonLd, createPageMeta } from '../lib/seo'
import { textCopySmResponsive } from '../lib/typography'

export const Route = createFileRoute('/live-demos')({
  head: () =>
    createPageMeta({
      title: 'Live demos | Ian Sirya',
      description:
        'Hosted project previews — launch interactive builds instantly without leaving the portfolio.',
      path: '/live-demos',
    }),
  component: LiveDemosPage,
})

const defaultSection = {
  eyebrow: 'Portfolio',
  title: 'Live demos',
  description:
    'Hosted previews of selected builds. Launch a demo directly — case studies with full write-ups live on the portfolio.',
}

function LiveDemosPage() {
  const projects = useProjects()
  const liveDemos = getLiveDemoProjects(projects)
  const page = useMarketingPage('live-demos')
  const section = getMarketingSection(page, 'hero', defaultSection)

  return (
    <PageShell
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      backTo="/"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Live demos', path: '/live-demos' },
        ])}
      />

      {liveDemos.length > 0 ? (
        <section
          aria-labelledby="live-demos-page-heading"
          className="-mx-6 bg-[#10140D] px-6 py-16 text-[#D8D7C3] sm:-mx-10 sm:px-10 sm:py-20 lg:-mx-16 lg:min-h-[calc(100svh-12rem)] lg:px-16"
        >
          <h2 id="live-demos-page-heading" className="sr-only">
            {section.title}
          </h2>
          <div className="mx-auto w-full max-w-[1440px]">
            <LiveDemosDisplay projects={liveDemos} />
          </div>

          <p className={`mx-auto mt-12 max-w-2xl ${textCopySmResponsive} text-[#D8D7C3]/70`}>
            Want the full story behind a build?{' '}
            <Link
              to="/portfolio"
              className="font-display font-black uppercase tracking-[0.08em] text-[#D8D7C3] underline underline-offset-4 transition-colors hover:text-white"
            >
              Browse case studies
            </Link>
            .
          </p>
        </section>
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="border border-[#D8D7C3]/15 bg-[#171B14] p-8 text-center sm:p-12">
            <p className={`mx-auto max-w-xl ${textCopySmResponsive} text-[#D8D7C3]/75`}>
              Live demo previews will appear here once projects have a cover image and a hosted
              demo link configured.
            </p>
            <Link
              to="/portfolio"
              className="mt-8 inline-flex font-display text-sm font-black uppercase tracking-[0.12em] text-[#D8D7C3] transition-colors hover:text-white"
            >
              View portfolio
              <span aria-hidden="true" className="ml-2">
                ↗
              </span>
            </Link>
          </div>
        </div>
      )}
    </PageShell>
  )
}
