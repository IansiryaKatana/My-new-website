import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCms } from '@/contexts/CmsContext'
import { useCarousel } from '@/hooks/useEmblaCarousel'
import { Button } from '@/components/ui/button'

export function TestimonialsCarousel() {
  const { data } = useCms()
  const { emblaRef, scrollPrev, scrollNext } = useCarousel()

  return (
    <section className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
        <h2 className="section-heading">
          Real stories
          <span className="font-serif-accent block normal-case">
            & real results
          </span>
        </h2>
        <p className="text-sm text-muted">
          What clients want and go from request to keys in our care.
        </p>
      </div>

      <div className="relative mt-12">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {data.testimonials.map((t) => (
              <div
                key={t.id}
                className="min-w-[85%] flex-[0_0_85%] border border-line bg-white p-6 md:min-w-[45%] md:flex-[0_0_45%] lg:min-w-[24%] lg:flex-[0_0_24%]"
              >
                {t.cardType === 'image' && t.propertyImage ? (
                  <img
                    src={t.propertyImage}
                    alt={t.title}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {t.avatar && (
                        <img
                          src={t.avatar}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted">{t.location}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted">
                      {t.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-olive-dark">
                      {t.quote}
                    </p>
                    {t.assignedAgent && (
                      <p className="mt-6 text-[10px] uppercase tracking-[0.12em] text-muted">
                        — {t.assignedAgent}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
