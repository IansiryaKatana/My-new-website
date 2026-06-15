import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
} from "../components/ui/section";
import { faqs } from "../lib/content";

export function FAQSection() {
  return (
    <Section className="bg-paper-soft">
      <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading className="max-w-md">
            Answers to common questions before the first call
          </SectionHeading>
          <p className="mt-6 max-w-sm text-sm leading-6 text-ink-soft">
            Practical details about fit, timeline, CMS readiness, responsive
            behavior, and post-launch care.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
