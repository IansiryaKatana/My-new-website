import { createFileRoute, Link } from '@tanstack/react-router'

import { HeroSection } from '../components/Hero/HeroSection'
import { SiteFooter } from '../components/layout/SiteFooter'
import { JsonLd } from '../components/seo/JsonLd'
import { AboutPreview } from '../components/sections/AboutPreview'
import { ExperiencePreview } from '../components/sections/ExperiencePreview'
import { ProjectsPreview } from '../components/sections/ProjectsPreview'
import { SkillsSection } from '../components/sections/SkillsSection'
import { useSiteConfig } from '../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../lib/cms/useMarketingPage'
import { createPageMeta, personJsonLd, websiteJsonLd } from '../lib/seo'
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

type CapabilitiesSection = {
  eyebrow: string
  headlines: string[]
  description: string
  primaryCta: { label: string; to: string }
  secondaryCta: { label: string; to: string }
}

type ContactCtaSection = {
  eyebrow: string
  title: string
  ctaLabel: string
  ctaTo: string
}

function HomePage() {
  const siteConfig = useSiteConfig()
  const homePage = useMarketingPage('home')
  const capabilities = getMarketingSection<CapabilitiesSection>(homePage, 'capabilities', {
    eyebrow: 'Capabilities',
    headlines: ['Frontend systems', 'Backend platforms', 'Product engineering'],
    description:
      'From editorial marketing experiences to multi-tenant SaaS — I design architectures that stay fast under real traffic and easy to extend after launch.',
    primaryCta: { label: 'Explore projects', to: '/portfolio' },
    secondaryCta: { label: 'About Ian', to: '/about' },
  })
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

        <section
          id="capabilities"
          className="bg-[#10140D] px-6 py-20 text-[#D8D7C3] sm:px-10 lg:px-16"
          aria-labelledby="capabilities-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
              <p
                id="capabilities-heading"
                className="font-display text-sm uppercase tracking-[0.2em] text-[#D8D7C3]/70"
              >
                {capabilities.eyebrow}
              </p>
              <div className="grid gap-5 font-display text-3xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-6xl">
                {capabilities.headlines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-[#D8D7C3]/75 sm:text-base">
              {capabilities.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to={capabilities.primaryCta.to}
                className={buttonVariants({ variant: 'light' })}
              >
                {capabilities.primaryCta.label}
              </Link>
              <Link
                to={capabilities.secondaryCta.to}
                className={buttonVariants({ variant: 'lightMuted' })}
              >
                {capabilities.secondaryCta.label}
              </Link>
            </div>
          </div>
        </section>

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
              <Link
                to={contactCta.ctaTo}
                className={cn(
                  buttonVariants({ variant: 'dark' }),
                  'group w-fit text-base',
                )}
              >
                {contactCta.ctaLabel}
                <span
                  aria-hidden="true"
                  className="ml-4 transition-transform duration-300 group-hover:translate-x-2"
                >
                  ↗
                </span>
              </Link>
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
