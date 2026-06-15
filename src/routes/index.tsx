import { createFileRoute } from '@tanstack/react-router'

import { HeroSection } from '../components/Hero/HeroSection'
import { SiteFooter } from '../components/layout/SiteFooter'
import { JsonLd } from '../components/seo/JsonLd'
import { AboutPreview } from '../components/sections/AboutPreview'
import { ExperiencePreview } from '../components/sections/ExperiencePreview'
import { LiveDemosSection } from '../components/sections/LiveDemosSection'
import { ProjectsPreview } from '../components/sections/ProjectsPreview'
import { SkillsSection } from '../components/sections/SkillsSection'
import { useSiteConfig } from '../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../lib/cms/useMarketingPage'
import { createPageMeta, personJsonLd, websiteJsonLd } from '../lib/seo'
import { InquiryOrLink } from '../components/inquiry/InquiryTrigger'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/')({
  head: () =>
    createPageMeta({
      title: 'Ian Sirya | Full Stack Developer',
      description:
        'Building reliable, fast and user-focused web experiences across the full stack.',
      path: '/',
    }),
  component: HomePage,
})

type ContactCtaSection = {
  eyebrow: string
  title: string
  ctaLabel: string
  ctaTo: string
}

function HomePage() {
  const siteConfig = useSiteConfig()
  const homePage = useMarketingPage('home')
  const contactCta = getMarketingSection<ContactCtaSection>(homePage, 'contactCta', {
    eyebrow: 'Start a project',
    title: "Let's build something reliable and memorable.",
    ctaLabel: 'Contact Ian',
    ctaTo: '/contact',
  })

  return (
    <>
      <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
      <main>
        <HeroSection />
        <ProjectsPreview />
        <LiveDemosSection />
        <ExperiencePreview />
        <SkillsSection />
        <AboutPreview />

        <section
          id="contact"
          className="bg-[#D8D7C3] px-6 py-20 text-[#11140F] sm:px-10 lg:px-16"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                id="contact-heading"
                className="font-display text-sm uppercase tracking-[0.2em]"
              >
                {contactCta.eyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-[0.85] sm:text-7xl">
                {contactCta.title}
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:items-end">
              <InquiryOrLink
                to={contactCta.ctaTo}
                className={cn(
                  buttonVariants({ variant: 'dark' }),
                  'group w-fit text-base',
                )}
                inquiry={{ source: 'home' }}
              >
                {contactCta.ctaLabel}
                <span
                  aria-hidden="true"
                  className="ml-4 transition-transform duration-300 group-hover:translate-x-2"
                >
                  ↗
                </span>
              </InquiryOrLink>
              <a
                href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
                className="font-display text-sm font-black uppercase underline underline-offset-4"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
