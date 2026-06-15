import { Link } from '@tanstack/react-router'

import { useExperience } from '../../contexts/CmsContext'
import { getHomeExperiencePreview } from '../../lib/cms/queries'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { fontCopy, textCopySm } from '../../lib/typography'
import { SectionHeading } from '../layout/SectionHeading'

type ExperiencePreviewSection = {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionTo: string
}

export function ExperiencePreview() {
  const experience = useExperience()
  const preview = getHomeExperiencePreview(experience, 2)
  const homePage = useMarketingPage('home')
  const section = getMarketingSection<ExperiencePreviewSection>(
    homePage,
    'experiencePreview',
    {
      eyebrow: 'Experience',
      title: 'Shipping products across agencies and product teams',
      description:
        'From frontend craft to platform ownership — focused on reliable delivery and maintainable systems.',
      actionLabel: 'Full timeline',
      actionTo: '/experience',
    },
  )

  return (
    <section
      id="experience"
      className="bg-[#34392E] px-6 py-20 text-[#D8D7C3] sm:px-10 lg:px-16"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          action={{ label: section.actionLabel, to: section.actionTo }}
          actionVariant="accent"
        />

        <div className="mt-12 grid gap-6">
          {preview.map((item) => (
            <article
              key={item.slug || `${item.company}-${item.role}`}
              className="grid gap-6 border border-[#D8D7C3]/15 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div>
                <p className="font-display text-xs font-black uppercase tracking-[0.18em] text-[#D8D7C3]/65">
                  {item.period}
                </p>
                <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] sm:text-4xl">
                  {item.role}
                </h3>
                <p className="mt-2 font-display text-lg font-black uppercase text-[#D8D7C3]/80">
                  {item.company}
                </p>
                <p className={`mt-2 text-sm text-[#D8D7C3]/65 ${fontCopy}`}>{item.location}</p>
              </div>
              <div>
                <p className={`${textCopySm} text-[#D8D7C3]/85`}>{item.summary}</p>
                <ul className={`mt-4 grid gap-2 text-sm text-[#D8D7C3]/75 ${fontCopy}`}>
                  {item.highlights.slice(0, item.previewLimit).map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="text-[#D8D7C3]/40">
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
                    className="mt-4 inline-flex font-display text-sm font-black uppercase transition-colors hover:text-white"
                  >
                    View full role details
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
