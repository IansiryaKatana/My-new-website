import { ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { SectionLabel } from '@/components/ui/section-label'
import { treatments } from '@/data/wellness'
import { cn } from '@/lib/utils'

export function TreatmentSection() {
  const [activeId, setActiveId] = useState(treatments[0].id)
  const active = useMemo(() => treatments.find((treatment) => treatment.id === activeId) ?? treatments[0], [activeId])

  return (
    <section id="treatments" className="section-reveal page-container py-20 md:py-28">
      <SectionLabel>Treatment discovery</SectionLabel>
      <div className="mb-12 grid gap-8 lg:grid-cols-[0.75fr_0.45fr] lg:items-end">
        <h2 className="text-[clamp(2.4rem,5vw,5rem)] font-light leading-[0.94] tracking-[-0.06em] text-charcoal">
          Find the pathway your body is asking for now.
        </h2>
        <p className="text-sm leading-6 text-muted">
          Compare guided care options across weight, hormones, gut health, aging, and overall balance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <article className="relative min-h-[34rem] overflow-hidden rounded-[1.6rem] bg-stone">
          <img
            key={active.id}
            src={active.image}
            alt={active.title}
            className="image-treatment absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-aurora-white md:p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-aurora-white px-4 py-2 text-xs text-forest">${active.price}</span>
              <span className="rounded-full bg-white/16 px-4 py-2 text-xs backdrop-blur">{active.duration}</span>
              <Rating value={active.rating} count={active.reviewCount} tone="light" />
            </div>
            <h3 className="mb-4 text-4xl font-light tracking-[-0.055em]">{active.title}</h3>
            <p className="max-w-md text-sm leading-6 text-aurora-white/78">{active.description}</p>
          </div>
        </article>

        <div className="rounded-[1.6rem] bg-warm-white p-3">
          {treatments.map((treatment, index) => {
            const isActive = treatment.id === active.id

            return (
              <button
                key={treatment.id}
                type="button"
                onClick={() => setActiveId(treatment.id)}
                className={cn(
                  'group mb-3 w-full rounded-[1.25rem] p-5 text-left transition-all duration-700 last:mb-0',
                  isActive ? 'bg-forest text-aurora-white' : 'bg-aurora-white text-charcoal hover:bg-stone',
                )}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className={cn('grid size-9 place-items-center rounded-full text-xs', isActive ? 'bg-lime-card text-deep-green' : 'bg-stone text-muted')}>
                    0{index + 1}
                  </span>
                  <ArrowUpRight className={cn('size-4 transition-transform duration-500', isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-30 group-hover:translate-x-0')} />
                </div>
                <h3 className="mb-3 text-2xl font-light tracking-[-0.05em]">{treatment.title}</h3>
                <p className={cn('text-sm leading-6', isActive ? 'text-aurora-white/72' : 'text-muted')}>{treatment.description}</p>
                {isActive ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {treatment.benefits.map((benefit) => (
                      <span key={benefit} className="rounded-full bg-white/10 px-3 py-1 text-xs text-cream-green">
                        {benefit}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
