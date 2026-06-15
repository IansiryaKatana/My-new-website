import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { images, nutritionCategories } from '@/data/wellness'
import { cn } from '@/lib/utils'

export function NutritionSection() {
  const [activeId, setActiveId] = useState(nutritionCategories[0].id)
  const active = useMemo(
    () => nutritionCategories.find((category) => category.id === activeId) ?? nutritionCategories[0],
    [activeId],
  )

  return (
    <section id="nutrition" className="bg-warm-white py-20 md:py-28">
      <div className="section-reveal page-container">
        <SectionLabel>Nutrition support</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-[0.78fr_0.42fr] lg:items-end">
          <h2 className="text-[clamp(2.4rem,5vw,4.8rem)] font-light leading-[0.95] tracking-[-0.06em] text-charcoal">
            Human-backed guidance for food, mood, digestion, and rest.
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted">
            Category filters update the expert card so members can understand what kind of care fits their current goal.
          </p>
        </div>

        <div className="my-10 flex gap-3 overflow-x-auto pb-2">
          {nutritionCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-xs transition-all duration-500',
                active.id === category.id
                  ? 'border-forest bg-forest text-aurora-white'
                  : 'border-charcoal/10 bg-aurora-white text-muted hover:border-forest/40 hover:text-forest',
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.48fr_0.52fr]">
          <article className="card-hover rounded-[1.5rem] bg-aurora-white p-6 shadow-[0_24px_80px_rgba(16,40,31,0.08)]">
            <div className="mb-12 flex items-center gap-4">
              <img src={images.doctor} alt={active.expert} className="size-16 rounded-full object-cover image-treatment" loading="lazy" />
              <div>
                <p className="text-lg tracking-[-0.04em] text-charcoal">{active.expert}</p>
                <p className="text-sm text-muted">{active.role}</p>
              </div>
            </div>
            <BadgeCheck className="mb-6 size-8 text-forest" />
            <h3 className="mb-4 max-w-xl text-4xl font-light leading-none tracking-[-0.055em] text-charcoal">{active.headline}</h3>
            <p className="max-w-md text-sm leading-6 text-muted">{active.description}</p>
            <Button asChild className="mt-8" size="sm">
              <a href="#consult">
                Book consult
                <ArrowUpRight className="size-3" />
              </a>
            </Button>
          </article>

          <div className="relative overflow-hidden rounded-[1.5rem] bg-stone">
            <img src={images.nutrition} alt="Balanced nourishing meal" className="image-treatment h-[34rem] w-full object-cover" loading="lazy" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.2rem] bg-aurora-white/92 p-5 backdrop-blur">
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted">Live care signal</p>
              <p className="text-2xl font-light tracking-[-0.045em] text-charcoal">{active.metric}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
