import { Link } from '@tanstack/react-router'

import { useHeroContent, useSiteConfig } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { textCopySm } from '../../lib/typography'
import { SectionHeading } from '../layout/SectionHeading'

type AboutPreviewSection = {
  eyebrow: string
  title: string
  descriptionTemplate: string
  actionLabel: string
  actionTo: string
  linkLabel: string
  stats: Array<{ value: string; label: string }>
}

export function AboutPreview() {
  const siteConfig = useSiteConfig()
  const hero = useHeroContent()
  const homePage = useMarketingPage('home')
  const section = getMarketingSection<AboutPreviewSection>(homePage, 'aboutPreview', {
    eyebrow: 'About',
    title: 'Editorial craft meets production engineering',
    descriptionTemplate:
      "I'm {{name}}, a {{role}} based in {{location}}. I partner with teams who want memorable interfaces backed by dependable systems.",
    actionLabel: 'About me',
    actionTo: '/about',
    linkLabel: 'Learn more about my approach',
    stats: [
      { value: '7+', label: 'Years building production web platforms' },
      { value: '15+', label: 'Multi-brand websites and digital systems managed' },
    ],
  })

  const description = section.descriptionTemplate
    .replace('{{name}}', siteConfig.name)
    .replace('{{role}}', siteConfig.role.toLowerCase())
    .replace('{{location}}', siteConfig.location)

  return (
    <section
      id="about"
      className="bg-[#10140D] px-6 py-20 text-[#D8D7C3] sm:px-10 lg:px-16"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden border border-[#D8D7C3]/15 bg-[#34392E]">
            <img
              src={hero.subject.src}
              alt={`Portrait of ${siteConfig.name}, ${siteConfig.role}`}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={description}
            action={{ label: section.actionLabel, to: section.actionTo }}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {section.stats.map((stat) => (
              <div key={stat.label} className="border border-[#D8D7C3]/15 p-5">
                <p className="font-display text-4xl font-black uppercase">{stat.value}</p>
                <p className={`mt-2 ${textCopySm} text-[#D8D7C3]/75`}>{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            to={section.actionTo}
            className="mt-8 inline-flex font-display text-sm font-black uppercase underline underline-offset-4 transition-colors hover:text-white"
          >
            {section.linkLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
