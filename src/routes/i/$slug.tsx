import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { JsonLd } from '../../components/seo/JsonLd'
import { PageShell } from '../../components/layout/PageShell'
import { InquiryTrigger } from '../../components/inquiry/InquiryTrigger'
import { buttonVariants } from '../../components/ui/button'
import { fetchMarketingPageBySlug } from '../../lib/cms/fetchMarketingPage'
import {
  getMarketingFaq,
  getMarketingInternalLinks,
  getMarketingSeoMeta,
} from '../../lib/seo/marketingSeo'
import { breadcrumbJsonLd, createPageMeta } from '../../lib/seo'
import { fontCopy } from '../../lib/typography'

function intentPagePath(slug: string) {
  return `/i/${slug}`
}

export const Route = createFileRoute('/i/$slug')({
  loader: async ({ params }) => {
    const page = await fetchMarketingPageBySlug(params.slug)
    if (!page || !page.intentPage) {
      throw notFound()
    }
    return page
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return createPageMeta({
        title: 'Page not found',
        description: 'The requested page could not be found.',
        path: '/portfolio',
      })
    }

    const seoMeta = getMarketingSeoMeta(loaderData)
    const canonicalPath =
      seoMeta.canonicalPath && seoMeta.canonicalPath.startsWith('/')
        ? seoMeta.canonicalPath
        : intentPagePath(loaderData.slug)

    return {
      ...createPageMeta({
        title: seoMeta.title || `${loaderData.title} | Ian Sirya`,
        description: seoMeta.description || loaderData.description,
        path: canonicalPath,
      }),
      meta: seoMeta.noindex
        ? [{ name: 'robots', content: 'noindex, nofollow' }]
        : [{ name: 'robots', content: 'index, follow' }],
    }
  },
  component: IntentPage,
})

function IntentPage() {
  const page = Route.useLoaderData()
  const faqItems = getMarketingFaq(page)
  const internalLinks = getMarketingInternalLinks(page)

  return (
    <PageShell
      eyebrow={page.eyebrow || 'Dubai corporate focus'}
      title={page.title}
      description={page.description}
      backTo="/portfolio"
      backLabel="Back to portfolio"
      headerAction={
        <InquiryTrigger
          variant="light"
          inquiry={{
            source: 'intent-page',
            sourceRef: page.slug,
            prefillMessage: `I want to discuss ${page.targetService || 'a digital systems project'} in ${page.targetLocation || 'Dubai'}.`,
          }}
        >
          Discuss this use case
        </InquiryTrigger>
      }
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Portfolio', path: '/portfolio' },
            { name: page.title, path: intentPagePath(page.slug) },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.description,
            about: page.targetKeyword || page.targetService || 'Corporate web systems',
            areaServed: page.targetLocation || 'Dubai, United Arab Emirates',
          },
          ...(faqItems.length > 0
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: item.answer,
                    },
                  })),
                },
              ]
            : []),
        ]}
      />

      <div className="mx-auto grid max-w-6xl gap-10">
        {page.bodyHtml ? (
          <article
            className={`prose prose-invert max-w-none text-[#D8D7C3]/85 ${fontCopy}`}
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
        ) : null}

        {internalLinks.length > 0 ? (
          <section className="grid gap-4 border-t border-[#D8D7C3]/15 pt-8">
            <h2 className="font-display text-sm font-black uppercase tracking-[0.2em] text-[#D8D7C3]/65">
              Related pages
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {internalLinks.map((item) => {
                const isInternal = item.href.startsWith('/')
                const className =
                  'group flex items-center justify-between border-b border-[#D8D7C3]/15 py-3 font-display text-xl font-black uppercase transition-colors hover:text-white'
                if (isInternal) {
                  return (
                    <Link key={item.href + item.label} to={item.href} className={className}>
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </Link>
                  )
                }
                return (
                  <a
                    key={item.href + item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </a>
                )
              })}
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link to="/portfolio" className={buttonVariants({ variant: 'lightMuted' })}>
            Explore case studies
          </Link>
          <Link to="/experience" className={buttonVariants({ variant: 'lightMuted' })}>
            View experience
          </Link>
          <Link to="/contact" className={buttonVariants({ variant: 'light' })}>
            Start a project
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
