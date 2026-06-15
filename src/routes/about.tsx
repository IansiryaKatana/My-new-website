import { createFileRoute, Link } from '@tanstack/react-router'

import { JsonLd } from '../components/seo/JsonLd'
import { AboutCredentials } from '../components/about/AboutCredentials'
import { PageShell } from '../components/layout/PageShell'
import { InquiryOrLink } from '../components/inquiry/InquiryTrigger'
import { buttonVariants } from '../components/ui/button'
import { useSiteConfig } from '../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../lib/cms/useMarketingPage'
import { textCopyLg, textCopySm } from '../lib/typography'
import { breadcrumbJsonLd, createPageMeta, personJsonLd } from '../lib/seo'

export const Route = createFileRoute('/about')({
  head: () =>
    createPageMeta({
      title: 'About Ian Sirya | Lead Full-Stack Developer',
      description:
        'Learn about Ian Sirya — Lead Full-Stack Developer and Digital Systems Lead in Dubai, focused on CRM systems, booking platforms, and multi-brand digital products.',
      path: '/about',
    }),
  component: AboutPage,
})

const ABOUT_BIO_BACKGROUND_IMAGE =
  'https://ezipzzupoalntcxngfua.supabase.co/storage/v1/object/public/cms-media/library/1781534942516-ian_portfolio.webp'

type AboutSections = {
  paragraphs: string[]
  cards: string[]
  primaryCta: { label: string; to: string }
  secondaryCta: { label: string; to: string }
}

const defaultAboutSections: AboutSections = {
  paragraphs: [
    'I build and improve business-critical web platforms, CRM systems, dashboards, booking workflows, internal tools, and multi-brand digital products across real estate, student accommodation, staffing, e-commerce, nonprofit, and corporate environments.',
    'I combine hands-on development with stakeholder communication and technical leadership — designing role-based systems, payment integrations, e-signature workflows, analytics tracking, and workflow automation that replace manual processes with structured, scalable business systems.',
  ],
  cards: [
    'CRM workflows, booking journeys, and role-based admin tools',
    'React, TypeScript, Node.js, Laravel, Supabase, and PostgreSQL platforms',
    'WordPress, Shopify, and multi-brand website management',
    'Payment gateways, e-signature flows, analytics, and API integrations',
  ],
  primaryCta: { label: 'View projects', to: '/portfolio' },
  secondaryCta: { label: 'Start a project', to: '/contact' },
}

function AboutPage() {
  const siteConfig = useSiteConfig()
  const page = useMarketingPage('about')
  const sections: AboutSections = {
    paragraphs: getMarketingSection(page, 'paragraphs', defaultAboutSections.paragraphs),
    cards: getMarketingSection(page, 'cards', defaultAboutSections.cards),
    primaryCta: getMarketingSection(page, 'primaryCta', defaultAboutSections.primaryCta),
    secondaryCta: getMarketingSection(
      page,
      'secondaryCta',
      defaultAboutSections.secondaryCta,
    ),
  }

  const title =
    page?.title ?? 'Building memorable products with engineering discipline'
  const description =
    page?.description ??
    `${siteConfig.name} is a ${siteConfig.role.toLowerCase()} who blends editorial design sensibility with production-grade architecture — from discovery through launch and iteration.`

  return (
    <PageShell
      eyebrow={page?.eyebrow ?? 'About'}
      title={title}
      description={description}
      backTo="/"
    >
      <JsonLd
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <section
        aria-labelledby="about-bio-heading"
        className="relative -mx-6 flex min-h-0 items-center border-t border-[#D8D7C3]/15 bg-[#10140D] px-6 py-16 sm:-mx-10 sm:px-10 lg:-mx-16 lg:min-h-screen lg:px-16"
      >
        <div
          className="pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
          style={{ backgroundImage: `url('${ABOUT_BIO_BACKGROUND_IMAGE}')` }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#10140D]/20 via-[#10140D]/55 to-[#10140D]/90 lg:block"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="hidden lg:block" aria-hidden />

            <div className="grid gap-8 text-[#D8D7C3]/85">
              <h2 id="about-bio-heading" className="sr-only">
                Background
              </h2>
              {sections.paragraphs.map((paragraph) => (
                <p key={paragraph} className={textCopyLg}>
                  {paragraph}
                </p>
              ))}

              <div>
                <h3
                  id="about-capabilities-heading"
                  className="sr-only"
                >
                  Capabilities
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {sections.cards.map((item) => (
                    <li key={item} className={`flex gap-3 ${textCopySm}`}>
                      <span aria-hidden="true" className="text-[#D8D7C3]/40">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to={sections.primaryCta.to}
                  className={buttonVariants({ variant: 'accent' })}
                >
                  {sections.primaryCta.label}
                </Link>
                <InquiryOrLink
                  to={sections.secondaryCta.to}
                  className={buttonVariants({ variant: 'forest' })}
                  inquiry={{ source: 'about' }}
                >
                  {sections.secondaryCta.label}
                </InquiryOrLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-certifications-teaser-heading"
        className="-mx-6 border-t border-[#11140F]/15 bg-[#D8D7C3] px-6 py-16 text-[#11140F] sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16"
      >
        <AboutCredentials />
      </section>
    </PageShell>
  )
}
