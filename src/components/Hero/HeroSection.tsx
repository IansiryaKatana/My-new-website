import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { useHeroContent } from '../../contexts/CmsContext'
import { Button } from '../ui/button'
import { HeroBackground } from './HeroBackground'
import { HeroBadge } from './HeroBadge'
import { HeroCopyBlock } from './HeroCopyBlock'
import { HeroNavigation } from './HeroNavigation'
import { HeroSubject } from './HeroSubject'
import { HeroTicker } from './HeroTicker'
import { HeroTypography } from './HeroTypography'

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

      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_20%,rgba(218,216,197,0.16),transparent_25%),linear-gradient(90deg,rgba(16,20,13,0.2),transparent_45%,rgba(16,20,13,0.25))]" />

      <HeroTypography name={heroContent.name} role={heroContent.role} />
      <HeroSubject src={heroContent.subject.src} alt={heroContent.subject.alt} />
      {heroContent.badge ? <HeroBadge text={heroContent.badge} /> : null}

      <div className="hero-copy-shell absolute inset-x-0 bottom-24 z-[7] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end gap-3 px-4 sm:bottom-28 sm:gap-5 sm:px-8 lg:bottom-[112px] lg:grid-cols-[30%_40%_30%] lg:gap-0">
        <div className="hero-copy-cluster max-w-[18rem] lg:self-end">
          <HeroCopyBlock
            lines={heroContent.leftIntro}
            secondary={[heroContent.expertise]}
          />
          <Button
            asChild
            variant="light"
            className="hero-cta group mt-6 w-[10.5rem]"
          >
            <Link to={heroContent.cta.href}>
              {heroContent.cta.label}
              <ArrowRight
                className="ml-5 h-4 w-4 text-current transition-transform duration-300 group-hover:translate-x-2"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />

        <div className="hero-copy-cluster justify-self-start lg:justify-self-end">
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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[30] opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:4px_4px]"
      />
    </section>
  )
}

