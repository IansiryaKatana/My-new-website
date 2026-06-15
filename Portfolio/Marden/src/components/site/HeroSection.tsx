import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCms } from '#/contexts/CmsContext'
import { CTAButton } from './CTAButton'
import { MetricsCard } from './MetricsCard'

export function HeroSection() {
  const { snapshot } = useCms()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !snapshot) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-bg', { scale: 1.08, duration: 1.2, ease: 'power3.out' })
      gsap.from('.hero-nav', { y: -12, opacity: 0, duration: 0.7, delay: 0.2 })
      gsap.from('.hero-line1', { y: 24, opacity: 0, duration: 0.8, delay: 0.45 })
      gsap.from('.hero-line2', { y: 24, opacity: 0, duration: 0.8, delay: 0.65 })
      gsap.from('.hero-sub', { opacity: 0, duration: 0.6, delay: 0.85 })
      gsap.from('.hero-cta', { y: 12, opacity: 0, duration: 0.6, delay: 0.9 })
      gsap.from('.hero-metrics', { x: 24, opacity: 0, duration: 0.8, delay: 1 })
    }, sectionRef)
    return () => ctx.revert()
  }, [snapshot])

  if (!snapshot) return null
  const { hero, metrics } = snapshot

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="relative min-h-[100svh] overflow-hidden md:min-h-[720px]"
    >
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center image-cinematic"
        style={{ backgroundImage: `url(${hero.background_image_url})` }}
        role="img"
        aria-label="Wind farm aerial landscape"
      />
      <div className="hero-gradient absolute inset-0" />

      <div className="hero-nav relative z-10">
        {/* Header rendered separately at page level */}
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-[1440px] flex-col justify-end px-6 pb-24 pt-32 md:px-12 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[460px]">
            <h1 className="text-[clamp(2.25rem,6vw,2.75rem)] font-normal leading-[1.05] tracking-[-0.03em] text-white">
              <span className="hero-line1 block">{hero.headline_line1}</span>
              <span className="hero-line2 block">{hero.headline_line2}</span>
            </h1>
            {hero.subcopy && (
              <p className="hero-sub mt-4 max-w-sm text-[11px] leading-relaxed text-white/75">
                {hero.subcopy}
              </p>
            )}
            <div className="hero-cta mt-6">
              <CTAButton label={hero.cta_label} href={hero.cta_url} />
            </div>
          </div>
          <div className="hero-metrics justify-self-end">
            <MetricsCard
              metrics={metrics}
              thumbnailUrl={hero.thumbnail_image_url}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
