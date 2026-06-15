import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { useHeroContent } from '../../contexts/CmsContext'
import { heroRoleTitle } from '../../data/hero-content'
import { isInquiryHref } from '../../lib/inquiry/types'
import { InquiryLinkTrigger, InquiryTrigger } from '../inquiry/InquiryTrigger'
import { Button } from '../ui/button'
import { HeroBackground } from './HeroBackground'
import { HeroCopyBlock } from './HeroCopyBlock'
import { HeroNavigation } from './HeroNavigation'
import { HeroSubject } from './HeroSubject'
import { HeroTicker } from './HeroTicker'
import { HeroTypography } from './HeroTypography'

const heroCtaClass =
  'hero-cta group mt-0 w-full bg-[#D8D7C3] text-[#11140F] hover:bg-[#D8D7C3] hover:text-[#11140F] sm:mt-6 sm:w-[10.5rem] sm:bg-transparent sm:text-[#D8D7C3] sm:hover:bg-[#D8D7C3] sm:hover:text-[#11140F]'

export function HeroSection() {
  const heroContent = useHeroContent()

  return (
    <section
      id="hero"
      className="hero-scene relative min-h-screen w-full overflow-hidden bg-[#34392E]"
      aria-labelledby="hero-title"
    >
      <HeroBackground />
      <HeroNavigation />

      <HeroTypography name={heroContent.name} role={heroRoleTitle} />
      <HeroSubject src={heroContent.subject.src} alt={heroContent.subject.alt} />

      <div className="hero-copy-shell absolute inset-x-0 bottom-24 z-[7] grid grid-cols-1 items-end gap-3 px-4 sm:bottom-28 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5 sm:px-8 lg:bottom-[112px] lg:grid-cols-[30%_40%_30%] lg:gap-0">
        <div className="hero-copy-cluster w-full max-w-none sm:max-w-[18rem] lg:self-end">
          <div className="hidden sm:block">
            <HeroCopyBlock
              lines={heroContent.leftIntro}
              secondary={[heroContent.expertise]}
            />
          </div>
          {isInquiryHref(heroContent.cta.href) ? (
            <InquiryTrigger
              variant="light"
              className={heroCtaClass}
              inquiry={{ source: 'hero', title: heroContent.cta.label }}
            >
              {heroContent.cta.label}
              <ArrowRight
                className="ml-5 h-4 w-4 text-current transition-transform duration-300 group-hover:translate-x-2"
                aria-hidden="true"
              />
            </InquiryTrigger>
          ) : (
            <Button asChild variant="light" className={heroCtaClass}>
              <Link to={heroContent.cta.href}>
                {heroContent.cta.label}
                <ArrowRight
                  className="ml-5 h-4 w-4 text-current transition-transform duration-300 group-hover:translate-x-2"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          )}
        </div>

        <div className="hidden lg:block" aria-hidden="true" />

        <div className="hero-copy-cluster hidden justify-self-start sm:block lg:justify-self-end">
          <HeroCopyBlock
            lines={heroContent.rightIntro}
            secondary={heroContent.rightSecondary}
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {heroContent.tags.map((tag, index) => (
              <span
                className={
                  index === 0
                    ? 'rounded-full bg-[#D8D7C3] px-4 py-2 font-display text-xs font-black uppercase text-[#11140F]'
                    : 'rounded-full border border-[#D8D7C3]/45 bg-[#10140D] px-4 py-2 font-display text-xs font-black uppercase text-[#D8D7C3]'
                }
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <HeroTicker items={heroContent.ticker} />
    </section>
  )
}

