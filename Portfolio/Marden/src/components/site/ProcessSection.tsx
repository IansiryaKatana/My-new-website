import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { useCms } from '#/contexts/CmsContext'

export function ProcessSection() {
  const { snapshot } = useCms()
  if (!snapshot) return null
  const { processSection, processStages } = snapshot

  return (
    <section id="process" className="bg-white section-pad">
      <div className="max-editorial grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-[120px]">
        <div>
          {processSection.eyebrow && (
            <p className="text-[11px] uppercase tracking-widest text-verden-muted">
              {processSection.eyebrow}
            </p>
          )}
          {processSection.body && (
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-verden-muted">
              {processSection.body}
            </p>
          )}
          {processSection.image_url && (
            <div
              className="mt-8 hidden h-48 w-32 rounded bg-cover bg-center image-cinematic md:block"
              style={{ backgroundImage: `url(${processSection.image_url})` }}
            />
          )}
        </div>

        <div>
          {processSection.heading && (
            <h2 className="mb-8 text-[clamp(1.5rem,3vw,2rem)] font-normal tracking-[-0.035em] text-verden-deep">
              {processSection.heading}
            </h2>
          )}
          <Accordion type="single" collapsible defaultValue={processStages[0]?.id}>
            {processStages.map((stage) => (
              <AccordionItem key={stage.id} value={stage.id}>
                <AccordionTrigger>
                  <span className="flex w-full items-center justify-between gap-4 pr-4">
                    <span>{stage.title}</span>
                    <span className="text-verden-muted">{stage.number}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>{stage.description}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
