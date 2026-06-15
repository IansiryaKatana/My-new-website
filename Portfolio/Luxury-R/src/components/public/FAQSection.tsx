import { useCms } from '@/contexts/CmsContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQSection() {
  const { data } = useCms()

  return (
    <section id="faq" className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="section-heading">
            Got questions?
            <span className="font-serif-accent block normal-case">
              we've got you
            </span>
          </h2>
          <img
            src={data.siteSettings.faqImage}
            alt="Luxury interior"
            className="mt-8 aspect-[4/5] w-full object-cover"
          />
          <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-muted">
            Verified properties · Legal clarity
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {data.faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
