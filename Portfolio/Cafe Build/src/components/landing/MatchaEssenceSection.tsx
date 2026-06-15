import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { EssenceSectionPayload } from '@/lib/cms/types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type MatchaEssenceSectionProps = {
  essence: EssenceSectionPayload
}

export function MatchaEssenceSection({ essence }: MatchaEssenceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const captionLeftRef = useRef<HTMLParagraphElement>(null)
  const captionRightRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from(headingRef.current, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          imageRef.current,
          { scale: 0.85, opacity: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.4',
        )
        .from(
          [captionLeftRef.current, captionRightRef.current],
          { y: 24, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
          '-=0.3',
        )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--cream)] py-16 text-[var(--text-dark)] sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(var(--deep-green) 1px, transparent 1px), linear-gradient(90deg, var(--deep-green) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-5xl font-bold leading-none sm:text-7xl lg:text-8xl">
            <span className="block">{essence.headingMain}</span>
            <span className="block italic text-[var(--matcha)]">
              {essence.headingAccent}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-dark)]/70 sm:text-sm">
            {essence.subheading}
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-xl sm:mt-16">
          <div
            ref={imageRef}
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[50%] border-4 border-[var(--deep-green)]/10 bg-white shadow-xl"
          >
            {essence.imageUrl ? (
              <img
                src={essence.imageUrl}
                alt={`${essence.headingMain} ${essence.headingAccent}`}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[var(--matcha)]/10 text-sm font-semibold text-[var(--deep-green)]">
                Matcha
              </div>
            )}
          </div>

          <p
            ref={captionLeftRef}
            className="absolute left-0 top-1/4 max-w-[8rem] text-xs font-bold uppercase tracking-wide text-[var(--matcha)] sm:max-w-[10rem] sm:text-sm"
          >
            {essence.captionLeft}
          </p>
          <p
            ref={captionRightRef}
            className="absolute right-0 bottom-1/4 max-w-[8rem] text-right text-xs font-bold uppercase tracking-wide text-[var(--matcha)] sm:max-w-[10rem] sm:text-sm"
          >
            {essence.captionRight}
          </p>
        </div>
      </div>
    </section>
  )
}
