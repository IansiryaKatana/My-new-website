import { ArrowUpRight } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { faqs } from '@/data/wellness'

export function FAQSection() {
  return (
    <section id="consult" className="section-reveal page-container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.28em] text-muted">Everything you need to know</p>
          <h2 className="mb-8 text-[clamp(2.4rem,5vw,4.7rem)] font-light leading-[0.94] tracking-[-0.06em] text-charcoal">
            Begin with clarity, not pressure.
          </h2>
          <Button asChild variant="outline">
            <a href="mailto:care@aurorawellness.example?subject=Aurora%20consultation">
              Ask care desk
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export function FooterSection() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.')
      return
    }

    setMessage('Thank you. Your Aurora welcome note is ready.')
    setEmail('')
  }

  return (
    <footer className="bg-ink py-14 text-aurora-white md:py-20">
      <div className="page-container">
        <div className="grid gap-12 lg:grid-cols-[0.52fr_0.48fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-aurora-white/48">Aurora Wellness</p>
            <h2 className="max-w-xl text-[clamp(2.2rem,4vw,4.7rem)] font-light leading-[0.95] tracking-[-0.06em]">
              Everything you need to begin gently.
            </h2>
            <form onSubmit={handleSubmit} className="mt-8 max-w-md" noValidate>
              <div className="flex flex-col gap-3 rounded-[1.4rem] bg-white/8 p-2 sm:flex-row">
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="min-h-12 flex-1 rounded-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/42"
                  aria-label="Email address"
                />
                <Button type="submit" variant="lime">
                  Join
                </Button>
              </div>
              {message ? <p className="mt-3 text-sm text-cream-green">{message}</p> : null}
            </form>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterList title="Services" items={['Nutrition', 'Treatments', 'Formulas', 'Coaching']} />
            <FooterList title="Company" items={['About', 'Care desk', 'Privacy', 'Terms']} />
            <div>
              <p className="mb-4 text-sm text-white">Contact</p>
              <div className="space-y-3 text-sm leading-6 text-white/52">
                <p>care@aurorawellness.example</p>
                <p>Virtual care studio</p>
                <p>Mon to Fri, 9am to 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Aurora Wellness. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#top" className="hover:text-white">Back to top</a>
            <a href="#nutrition" className="hover:text-white">Nutrition</a>
            <a href="#formulas" className="hover:text-white">Shop formulas</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-4 text-sm text-white">{title}</p>
      <ul className="space-y-3 text-sm text-white/52">
        {items.map((item) => (
          <li key={item}>
            <a href="#top" className="transition-colors hover:text-white">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
