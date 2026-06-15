import { Link } from '@tanstack/react-router'

import { useSiteConfig } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { textCopySm } from '../../lib/typography'
import { cn } from '../../lib/utils'
import { SectionHeading } from '../layout/SectionHeading'
import { buttonVariants } from '../ui/button'

const ABOUT_BACKGROUND_IMAGE =
  'https://ezipzzupoalntcxngfua.supabase.co/storage/v1/object/public/cms-media/library/1781532678619-ian__6_.webp'

type AboutPreviewSection = {
  eyebrow: string
  title: string
  descriptionTemplate: string
  actionLabel: string
  actionTo: string
  stats: Array<{ value: string; label: string }>
}

export function AboutPreview() {
  const siteConfig = useSiteConfig()
  const homePage = useMarketingPage('home')
  const section = getMarketingSection<AboutPreviewSection>(homePage, 'aboutPreview', {
    eyebrow: 'About',
    title: 'Editorial craft meets production engineering',
    descriptionTemplate:
      "I'm {{name}}, a {{role}} based in {{location}}. I partner with teams who want memorable interfaces backed by dependable systems.",
    actionLabel: 'About me',
    actionTo: '/about',
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
      className="relative flex min-h-0 items-center bg-cover bg-center bg-no-repeat px-6 py-20 text-[#D8D7C3] sm:px-10 lg:min-h-screen lg:px-16"
      style={{ backgroundImage: `url('${ABOUT_BACKGROUND_IMAGE}')` }}
      aria-labelledby="about-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#10140D]/25 via-[#10140D]/60 to-[#10140D]/88"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="hidden lg:block" aria-hidden />

          <div>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={description}
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
            className={cn(
              buttonVariants({ variant: 'accent', size: 'default' }),
              'group mt-8 w-fit',
            )}
          >
            {section.actionLabel}
            <span
              aria-hidden="true"
              className="ml-4 transition-[color,transform] duration-300 group-hover:translate-x-2"
            >
              ↗
            </span>
          </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
