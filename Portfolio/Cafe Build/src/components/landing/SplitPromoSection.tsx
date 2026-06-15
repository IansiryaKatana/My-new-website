import { CTAButton } from '@/components/landing/CTAButton'
import { CurvedMarquee } from '@/components/landing/CurvedMarquee'
import type { PromoSectionPayload } from '@/lib/cms/types'

type SplitPromoSectionProps = {
  promo: PromoSectionPayload
}

export function SplitPromoSection({ promo }: SplitPromoSectionProps) {
  const marqueeLabels =
    promo.marqueeWords.length > 0
      ? promo.marqueeWords
      : ['Ceremonial Grade', 'Green Every Day']

  return (
    <section className="relative overflow-hidden bg-[var(--cream)] py-16 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl sm:rounded-[2.5rem]">
          <div className="grid min-h-[28rem] md:grid-cols-2 md:min-h-[32rem]">
            <div className="relative flex flex-col justify-between bg-[var(--deep-green)] p-8 text-white sm:p-10 lg:p-12">
              <div>
                <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  {promo.leftTitle}
                  <span className="block text-[var(--lime)]">{promo.leftAccent}</span>
                </h2>
                <ul className="mt-6 space-y-2 text-sm text-white/75 sm:text-base">
                  {promo.supportLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <CTAButton href={promo.ctaHref} variant="matcha">
                  {promo.ctaText}
                </CTAButton>
              </div>
              {promo.productImageUrl && (
                <img
                  src={promo.productImageUrl}
                  alt={promo.leftTitle}
                  className="pointer-events-none absolute -bottom-6 right-4 w-36 opacity-90 sm:w-44"
                />
              )}
            </div>

            <div className="relative min-h-[16rem] md:min-h-full">
              {promo.lifestyleImageUrl ? (
                <img
                  src={promo.lifestyleImageUrl}
                  alt="Matcha lifestyle"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[var(--matcha)]/20 text-[var(--deep-green)]">
                  Lifestyle
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-2 sm:px-4">
            <CurvedMarquee labels={marqueeLabels} />
          </div>
        </div>
      </div>
    </section>
  )
}
