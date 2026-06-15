import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CTAButton } from '@/components/landing/CTAButton'
import type { FlavorSectionPayload } from '@/lib/cms/types'

gsap.registerPlugin(useGSAP)

type FlavorShowcaseSectionProps = {
  flavor: FlavorSectionPayload
}

const cardRotations = [-12, 8, -6]

export function FlavorShowcaseSection({ flavor }: FlavorShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const drinkRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.to(drinkRef.current, {
        y: -12,
        duration: 2.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      const cards = sectionRef.current?.querySelectorAll('[data-fruit-card]')
      cards?.forEach((card, i) => {
        gsap.to(card, {
          rotation: cardRotations[i % cardRotations.length] + 4,
          duration: 2 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    },
    { scope: sectionRef, dependencies: [flavor.fruitCards.length] },
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--deep-green)] py-20 text-white sm:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold sm:text-6xl lg:text-7xl">
            {flavor.headingMain}{' '}
            <span className="text-[var(--lime)]">{flavor.headingAccent}</span>
          </h2>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            {flavor.labelLeft} · {flavor.labelRight}
          </p>
        </div>

        <div className="relative mx-auto mt-12 flex min-h-[22rem] max-w-3xl items-end justify-center sm:min-h-[26rem]">
          {flavor.fruitCards.map((fruit, index) => (
            <div
              key={`${fruit.name}-${index}`}
              data-fruit-card
              className="absolute rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"
              style={{
                top: `${12 + index * 8}%`,
                left: index === 0 ? '4%' : index === 1 ? '72%' : '38%',
                transform: `rotate(${cardRotations[index % cardRotations.length]}deg)`,
              }}
            >
              {fruit.imageUrl && (
                <img
                  src={fruit.imageUrl}
                  alt={fruit.name}
                  className="size-16 rounded-xl object-cover sm:size-20"
                />
              )}
              <p className="mt-2 text-center text-xs font-bold uppercase tracking-wide">
                {fruit.name}
              </p>
            </div>
          ))}

          <div ref={drinkRef} className="relative z-10 text-center">
            {flavor.productImageUrl && (
              <img
                src={flavor.productImageUrl}
                alt={flavor.productLabel}
                className="mx-auto h-64 w-auto object-contain drop-shadow-2xl sm:h-80"
              />
            )}
            <p className="mt-4 text-lg font-bold uppercase tracking-wide text-[var(--lime)]">
              {flavor.productLabel}
            </p>
            <div className="mt-6">
              <CTAButton href={flavor.ctaHref}>{flavor.ctaText}</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
