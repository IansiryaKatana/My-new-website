import { useSkillGroups } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { SectionHeading } from '../layout/SectionHeading'

type StackSection = {
  eyebrow: string
  title: string
  description: string
}

export function SkillsSection() {
  const skillGroups = useSkillGroups()
  const homePage = useMarketingPage('home')
  const section = getMarketingSection<StackSection>(homePage, 'stack', {
    eyebrow: 'Stack & craft',
    title: 'Tools chosen for velocity without sacrificing quality',
    description:
      'Pragmatic full stack choices — typed frontends, dependable APIs, and observability from day one.',
  })

  return (
    <section
      id="stack"
      className="bg-[#765F47] px-6 py-20 text-[#D8D7C3] sm:px-10 lg:px-16"
      aria-labelledby="stack-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="border border-[#D8D7C3]/20 bg-[#10140D]/20 p-6 sm:p-8"
            >
              <h3 className="font-display text-2xl font-black uppercase">{group.title}</h3>
              <ul className="mt-6 grid gap-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between border-b border-[#D8D7C3]/15 pb-3 font-display text-sm font-black uppercase tracking-[0.08em]"
                  >
                    {item}
                    <span aria-hidden="true" className="text-[#D8D7C3]/40">
                      +
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
