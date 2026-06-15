import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { SectionLabel } from '@/components/ui/section-label'
import { images } from '@/data/wellness'

export function PhilosophySection() {
  return (
    <section id="philosophy" className="section-reveal page-container py-20 md:py-28">
      <SectionLabel>Mindful practice</SectionLabel>
      <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-start">
        <article className="card-hover overflow-hidden rounded-[1.5rem] bg-stone">
          <img
            src={images.portrait}
            alt="Aurora member in soft natural light"
            className="image-treatment h-[32rem] w-full object-cover"
            loading="lazy"
          />
          <div className="flex items-center justify-between p-5 text-xs text-muted">
            <span>Member story</span>
            <Rating value={4.9} count={218} />
          </div>
        </article>

        <div className="grid gap-8">
          <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.6rem)] font-light leading-[0.92] tracking-[-0.065em] text-charcoal">
            A self-help experience that feels human before it feels digital.
          </h2>
          <div className="grid gap-5 md:grid-cols-[0.85fr_0.65fr] md:items-end">
            <div className="overflow-hidden rounded-[1.35rem] bg-stone">
              <img
                src={images.ritual}
                alt="Slow wellness ritual with warm light"
                className="image-treatment h-72 w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="rounded-[1.35rem] bg-lime-card p-6 text-deep-green">
              <p className="mb-10 text-5xl font-light tracking-[-0.06em]">84%</p>
              <p className="text-sm leading-6">
                of members keep their daily check-in after the first month because it feels like a ritual, not a task.
              </p>
              <Button asChild variant="primary" size="sm" className="mt-6">
                <a href="#nutrition">
                  See method
                  <ArrowUpRight className="size-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
