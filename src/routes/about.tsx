import { createFileRoute, Link } from '@tanstack/react-router'

import { JsonLd } from '../components/seo/JsonLd'
import { AboutCredentials } from '../components/about/AboutCredentials'
import { PageShell } from '../components/layout/PageShell'
import { buttonVariants } from '../components/ui/button'
import { useHeroContent, useSiteConfig } from '../contexts/CmsContext'
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
  const hero = useHeroContent()
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

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="aspect-[4/5] overflow-hidden border border-[#D8D7C3]/15 bg-[#34392E]">
          <img
            src={hero.subject.src}
            alt={hero.subject.alt || `Portrait of ${siteConfig.name}`}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="grid gap-8 text-[#D8D7C3]/85">
          {sections.paragraphs.map((paragraph) => (
            <p key={paragraph} className={textCopyLg}>
              {paragraph}
            </p>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            {sections.cards.map((item) => (
              <div
                key={item}
                className={`border border-[#D8D7C3]/15 p-5 ${textCopySm}`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to={sections.primaryCta.to}
              className={buttonVariants({ variant: 'light' })}
            >
              {sections.primaryCta.label}
            </Link>
            <Link
              to={sections.secondaryCta.to}
              className={buttonVariants({ variant: 'lightMuted' })}
            >
              {sections.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <AboutCredentials />
    </PageShell>
  )
}
