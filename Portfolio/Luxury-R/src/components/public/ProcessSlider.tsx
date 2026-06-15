import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCms } from '@/contexts/CmsContext'
import { useCarousel } from '@/hooks/useEmblaCarousel'
import { Button } from '@/components/ui/button'

export function ProcessSlider() {
  const { data } = useCms()
  const { emblaRef, scrollPrev, scrollNext } = useCarousel()

  return (
    <section className="overflow-hidden bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="section-heading">
            From request
            <span className="block">to result</span>
            <span className="font-serif-accent block normal-case text-base md:text-lg">
              all under control
            </span>
          </h2>
          <p className="text-sm text-muted">
            From request to result — our work, we make planning simple for you.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {data.processSteps.map((step) => (
                <div
                  key={step.id}
                  className="min-w-[75%] flex-[0_0_75%] border border-line bg-white p-8 md:min-w-[50%] md:flex-[0_0_50%] lg:min-w-[40%] lg:flex-[0_0_40%]"
                >
                  <span className="text-5xl font-light text-line md:text-7xl">
                    {step.stepNumber}
                  </span>
                  <h3 className="mt-4 font-display text-2xl uppercase tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                  {step.image && (
                    <img
                      src={step.image}
                      alt=""
                      className="mt-6 h-32 w-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
