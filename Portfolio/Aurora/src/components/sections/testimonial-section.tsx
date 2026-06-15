import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { testimonials } from '@/data/wellness'

export function TestimonialSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selected, setSelected] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <section className="bg-forest py-20 text-aurora-white md:py-28">
      <div className="section-reveal page-container">
        <SectionLabel className="text-aurora-white/58">Member stories</SectionLabel>
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-4xl text-[clamp(2.4rem,5vw,5rem)] font-light leading-[0.94] tracking-[-0.06em]">
            Our care members put calm in the center.
          </h2>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/18" onClick={scrollPrev} aria-label="Previous testimonial">
              <ArrowLeft className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/18" onClick={scrollNext} aria-label="Next testimonial">
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <article key={testimonial.id} className="min-w-0 flex-[0_0_100%] pr-4">
                <div className="grid gap-5 lg:grid-cols-[0.34fr_0.66fr]">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="image-treatment h-[24rem] w-full rounded-[1.5rem] object-cover lg:h-[31rem]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="flex min-h-[24rem] flex-col justify-between rounded-[1.5rem] bg-cream-green p-7 text-deep-green md:p-10">
                    <p className="text-[clamp(2rem,4vw,4.5rem)] font-light leading-[0.98] tracking-[-0.065em]">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-10 flex items-center justify-between border-t border-deep-green/15 pt-5">
                      <div>
                        <p className="text-lg tracking-[-0.04em]">{testimonial.name}</p>
                        <p className="text-sm text-deep-green/62">{testimonial.role}</p>
                      </div>
                      <span className="text-xs text-deep-green/50">
                        {String(selected + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
