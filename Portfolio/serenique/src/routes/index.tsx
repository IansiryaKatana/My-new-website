import * as Accordion from '@radix-ui/react-accordion'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Send,
} from 'lucide-react'
import { FormEvent, ReactNode, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
})

import { publicAsset } from '../../../demo-assets'

const image = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

const heroImage = publicAsset('images/grainy-hero.png')
const cinematicImage = publicAsset('images/other-grainy.png')

const services = [
  {
    id: 'guided-meditation',
    eyebrow: '01 / mental clarity',
    title: 'Guided Meditation',
    tags: ['Focus', 'Serenity', 'Stillness', 'Tranquility'],
    description:
      'Private guided practices shaped around breath, quiet attention, and the first soft return to yourself.',
    images: [
      image('photo-1506126613408-eca07ce68773'),
      image('photo-1545389336-cf090694435e'),
      image('photo-1506905925346-21bda4d32df4'),
    ],
  },
  {
    id: 'private-mind-therapy',
    eyebrow: '02 / safe space',
    title: 'Private Mind Therapy',
    tags: ['Emotional', 'Support', 'Purity', 'Restoration'],
    description:
      'One-to-one sessions in calm rooms where expert practitioners help restore clarity, safety, and emotional balance.',
    images: [
      image('photo-1512290923902-8a9f81dc236c'),
      image('photo-1519823551278-64ac92734fb1'),
      image('photo-1515377905703-c4788e51af15'),
    ],
  },
  {
    id: 'mindful-retreats',
    eyebrow: '03 / tranquil escape',
    title: 'Mindful Retreats',
    tags: ['Luxury', 'Healing', 'Insight', 'Awareness'],
    description:
      'Immersive retreats that pair restorative rituals, quiet architecture, and deeply intentional care.',
    images: [
      image('photo-1500530855697-b586d89ba3ee'),
      image('photo-1506744038136-46273834b3fb'),
      image('photo-1518005020951-eccb494ad742'),
    ],
  },
  {
    id: 'holistic-wellness-program',
    eyebrow: '04 / total alignment',
    title: 'Holistic Wellness Program',
    tags: ['Movement', 'Wholeness', 'Balance', 'Calm'],
    description:
      'A complete path of movement, mindful therapy, nervous-system reset, and refined personal guidance.',
    images: [
      image('photo-1518611012118-696072aa579a'),
      image('photo-1506126613408-eca07ce68773'),
      image('photo-1544161515-4ab6ce6db874'),
    ],
  },
]

const faqs = [
  {
    question: 'What makes Serenique different from others?',
    answer:
      'Serenique blends refined spaces, expert practitioners, and deeply personal care into a calm wellness experience.',
  },
  {
    question: 'How long is a typical session?',
    answer:
      'Sessions usually last 60 to 90 minutes, depending on the treatment and your personal wellness goals.',
  },
  {
    question: 'Do I need prior experience with meditation?',
    answer:
      'No prior experience is needed. Every session is guided according to your comfort level and current state.',
  },
  {
    question: 'Can I book private experiences?',
    answer:
      'Yes. Private wellness experiences can be arranged for individuals, couples, and small groups.',
  },
  {
    question: 'Where is Serenique located?',
    answer:
      'Serenique is located in a calm, private wellness space designed for restoration and relaxation.',
  },
]

const testimonials = [
  {
    quote:
      "Stepping into Serenique felt like entering another world. Every detail is crafted with such care & calm - I've never experienced such profound relaxation.",
    author: 'Brenda C.',
    role: 'Private Therapy Guest',
    image: image('photo-1524504388940-b1c1722653e1', 900),
  },
  {
    quote:
      'The atmosphere softened my whole nervous system before the session even began. It is therapy, ritual, and quiet luxury in one place.',
    author: 'Mara L.',
    role: 'Retreat Member',
    image: image('photo-1494790108377-be9c29b29330', 900),
  },
  {
    quote:
      'I arrived overwhelmed and left feeling clear, grounded, and personally cared for. Serenique has a rare kind of stillness.',
    author: 'Nadine R.',
    role: 'Meditation Client',
    image: image('photo-1508214751196-bcfd4ca60f91', 900),
  },
]

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Questions', href: '#faq' },
]

function HomePage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <div className="noise" aria-hidden="true" />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CinematicFeature />
      <TestimonialSection />
      <FAQSection />
      <SiteFooter />
    </main>
  )
}

function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-paper/15 text-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10">
        <a href="#top" className="font-serif text-2xl tracking-[0.08em]">
          Serenique
        </a>
        <nav className="hidden items-center gap-7 text-[0.68rem] uppercase tracking-[0.28em] md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-sage"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-3">
          <a
            href="tel:+9715550148"
            className="hidden items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] lg:flex"
          >
            <Phone className="size-3" />
            +971 555 0148
          </a>
          <BookingDialog>
            <Button size="sm" className="hidden sm:inline-flex">
              Reserve
            </Button>
          </BookingDialog>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-ink text-paper">
      <SiteHeader />
      <div
        className="absolute inset-0 scale-[1.04] animate-hero-image bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(16,18,12,.18), rgba(16,18,12,0)), url(${heroImage})`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,239,228,.08),transparent_32%),linear-gradient(to_top,rgba(20,22,15,.78)_0%,rgba(20,22,15,.36)_32%,rgba(20,22,15,0)_68%,rgba(20,22,15,.16)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-end px-5 pb-8 pt-28 md:px-10 md:pb-10">
        <div className="mb-auto mt-28 hidden justify-between text-[0.62rem] uppercase tracking-[0.34em] text-paper/70 md:flex">
          <span>Private mental wellness</span>
          <span className="max-w-52 text-right leading-5">
            Therapy, meditation, retreats, and holistic restoration
          </span>
        </div>
        <div className="grid items-end gap-8 border-t border-paper/20 pt-8 md:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
          <h1 className="animate-soft-rise font-serif text-[clamp(4rem,13vw,10rem)] leading-[0.82] tracking-[-0.07em]">
            Elevating Your Mind to a State of{' '}
            <span className="italic text-sage">Calm Luxury.</span>
          </h1>
          <div className="animate-soft-rise-delayed max-w-sm space-y-6 md:justify-self-end">
            <p className="text-sm leading-7 text-paper/76">
              At Serenique, we see mental wellness as the finest form of self-care,
              shaped through quiet spaces, expert attention, and deeply personal rituals.
            </p>
            <BookingDialog>
              <Button size="lg">
                Begin Your Journey <ArrowUpRight className="size-4" />
              </Button>
            </BookingDialog>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="section-shell border-b border-line">
      <div className="editorial-grid">
        <SectionLabel>About Serenique</SectionLabel>
        <div className="md:col-span-2">
          <p className="max-w-5xl font-serif text-[clamp(2.6rem,6vw,5.3rem)] leading-[0.95] tracking-[-0.055em]">
            At Serenique, we see mental wellness as the finest form of
            self-care. Every element of our approach is designed to make calm
            feel personal, elevated, and deeply safe.
          </p>
        </div>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-[1fr_1.1fr_.8fr] md:items-end">
        <ImageCard
          src={image('photo-1544161515-4ab6ce6db874')}
          alt="Soft spa interior with warm muted light"
          className="aspect-[4/5]"
        />
        <ImageCard
          src={image('photo-1519823551278-64ac92734fb1')}
          alt="Quiet wellness room with refined natural textures"
          className="aspect-[5/6] md:translate-y-12"
        />
        <div className="space-y-10 border-t border-line pt-8 md:border-l md:border-t-0 md:pl-8">
          <p className="text-sm leading-7 text-muted">
            From the architecture of our rooms to the sensitivity of each session,
            Serenique is built for guests who want restoration without noise,
            pressure, or performance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Stat value="94%" label="Felt more safe" />
            <Stat value="97%" label="Felt more balanced" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="section-shell border-b border-line">
      <div className="mb-12 grid gap-8 md:grid-cols-[.75fr_1.25fr]">
        <SectionLabel>Curated Services</SectionLabel>
        <h2 className="font-serif text-[clamp(3.4rem,8vw,8rem)] leading-[0.86] tracking-[-0.07em]">
          The Art of Inner Refinement.
        </h2>
      </div>
      <Accordion.Root
        type="single"
        defaultValue="private-mind-therapy"
        collapsible
        className="border-t border-line"
      >
        {services.map((service) => (
          <Accordion.Item
            key={service.id}
            value={service.id}
            className="group border-b border-line"
          >
            <Accordion.Header>
              <Accordion.Trigger className="grid w-full gap-5 py-6 text-left md:grid-cols-[.45fr_1fr_.75fr_auto] md:items-center">
                <span className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">
                  {service.eyebrow}
                </span>
                <span className="font-serif text-4xl leading-none tracking-[-0.04em] md:text-6xl">
                  {service.title}
                </span>
                <span className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="flex size-11 items-center justify-center rounded-full border border-line transition group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-paper md:justify-self-end">
                  <Plus className="size-4" />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="grid gap-6 pb-8 md:grid-cols-[.45fr_1.55fr]">
                <p className="max-w-sm text-sm leading-7 text-muted">
                  {service.description}
                </p>
                <div className="service-gallery">
                  {service.images.map((src, index) => (
                    <ImageCard
                      key={src}
                      src={src}
                      alt={`${service.title} atmosphere ${index + 1}`}
                      className="service-gallery-card"
                    />
                  ))}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}

function CinematicFeature() {
  return (
    <section
      id="experience"
      className="relative min-h-[85vh] overflow-hidden bg-ink text-paper"
    >
      <img
        src={cinematicImage}
        alt=""
        className="absolute inset-0 size-full object-cover object-[center_42%]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,22,15,.78)_0%,rgba(20,22,15,.46)_34%,rgba(20,22,15,0)_72%)]" />
      <div className="absolute left-[62%] top-[34%] hidden md:block">
        <Marker />
      </div>
      <div className="absolute right-[18%] top-[46%] hidden rounded-3xl border border-paper/20 bg-paper/12 p-4 text-xs uppercase tracking-[0.24em] backdrop-blur md:block">
        Mental Clarity
      </div>
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1440px] flex-col justify-end px-5 py-10 md:px-10">
        <div className="max-w-4xl border-t border-paper/20 pt-8">
          <h2 className="font-serif text-[clamp(3.8rem,8vw,8.4rem)] leading-[0.88] tracking-[-0.07em]">
            Crafted to Elevate both <span className="italic text-sage">Body</span>{' '}
            and <span className="italic text-sage">Mind.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-paper/74">
            Each room, ritual, and guided exchange is composed to soften the
            senses and bring the whole self back into quiet alignment.
          </p>
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const [index, setIndex] = useState(0)
  const testimonial = testimonials[index]
  const next = () => setIndex((current) => (current + 1) % testimonials.length)
  const previous = () =>
    setIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    )

  return (
    <section className="section-shell border-b border-line">
      <div className="grid gap-10 md:grid-cols-[.45fr_1.1fr_.45fr] md:items-center">
        <div className="space-y-8">
          <SectionLabel>In Their Words</SectionLabel>
          <ImageCard
            src={testimonial.image}
            alt={`${testimonial.author} portrait`}
            className="aspect-[4/5] max-w-56"
          />
        </div>
        <blockquote className="min-h-[420px] content-center border-y border-line py-10 md:border-x md:px-10">
          <span className="font-serif text-7xl leading-none text-sage">"</span>
          <p className="mt-4 font-serif text-[clamp(2.5rem,5vw,5.6rem)] leading-[0.98] tracking-[-0.055em]">
            {testimonial.quote}
          </p>
          <footer className="mt-8 text-sm uppercase tracking-[0.24em] text-muted">
            - {testimonial.author} / {testimonial.role}
          </footer>
        </blockquote>
        <div className="flex items-end justify-between gap-6 md:block md:space-y-8">
          <ImageCard
            src={image('photo-1506126613408-eca07ce68773', 900)}
            alt="Meditation in warm natural light"
            className="aspect-square max-w-44"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={previous}
              className="control-button"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="control-button"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  return (
    <section id="faq" className="section-shell border-b border-line">
      <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
        <div className="flex flex-col justify-between gap-16">
          <div>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-8 max-w-lg font-serif text-[clamp(3.4rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em]">
              Eternal Questions & Answer
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted">
            If you need a more personal recommendation, our care team can help
            match your state of mind with the right Serenique experience.
          </p>
        </div>
        <Accordion.Root
          type="single"
          defaultValue="How long is a typical session?"
          collapsible
          className="border-t border-line"
        >
          {faqs.map((faq) => (
            <Accordion.Item
              key={faq.question}
              value={faq.question}
              className="border-b border-line"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="font-serif text-3xl leading-none tracking-[-0.035em] md:text-4xl">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-muted transition group-data-[state=open]:rotate-180">
                    <Plus className="block size-4 group-data-[state=open]:hidden" />
                    <Minus className="hidden size-4 group-data-[state=open]:block" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="max-w-xl pb-6 text-sm leading-7 text-muted">
                  {faq.answer}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="min-h-[500px] bg-olive px-5 py-10 text-paper md:min-h-[70vh] md:px-10">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-between gap-16">
        <div className="grid gap-12 border-b border-paper/15 pb-12 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <h2 className="max-w-3xl font-serif text-[clamp(3.4rem,8vw,8.2rem)] leading-[0.86] tracking-[-0.07em]">
              Begin Your Journey Into Inner Serenity.
            </h2>
            <div className="mt-8 flex gap-3">
              {[
                { icon: Globe, label: 'Instagram', href: 'https://instagram.com' },
                { icon: MessageCircle, label: 'Facebook', href: 'https://facebook.com' },
                { icon: Send, label: 'LinkedIn', href: 'https://linkedin.com' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="control-button border-paper/25 text-paper hover:bg-paper hover:text-ink"
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterBlock title="Location" lines={['Al Wasl Wellness House', 'Dubai, UAE']} />
          <FooterBlock
            title="Call Us"
            lines={['+971 555 0148', 'hello@serenique.studio']}
          />
        </div>
        <div className="grid gap-8 text-[0.68rem] uppercase tracking-[0.24em] text-paper/66 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <p>Open Monday to Saturday / 9:00 - 20:00</p>
          <a href="#top" className="font-serif text-4xl normal-case tracking-[0.08em] text-paper">
            Serenique
          </a>
          <nav className="flex flex-wrap gap-4 md:justify-end">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-paper">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

function BookingDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const serviceOptions = useMemo(
    () => services.map((service) => service.title),
    [],
  )

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSubmitted(false)
      setErrors({})
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const booking = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      service: String(formData.get('service') ?? ''),
      intent: String(formData.get('intent') ?? '').trim(),
    }
    const nextErrors: Record<string, string> = {}

    if (booking.name.length < 2) {
      nextErrors.name = 'Please enter your full name.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!booking.service) {
      nextErrors.service = 'Please choose a preferred experience.'
    }
    if (booking.intent.length < 12) {
      nextErrors.intent = 'Share a little more about what you need.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      event.currentTarget.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve a Quiet Consultation</DialogTitle>
          <DialogDescription>
            Tell us what kind of support you are seeking. Our care team will
            respond with a considered recommendation and availability.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="mt-8 rounded-[1.5rem] border border-line bg-background p-6">
            <p className="font-serif text-3xl leading-tight text-ink">
              Thank you. Your request has been prepared for the Serenique care team.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              A concierge reply will follow with thoughtful recommendations and
              the next available appointment times.
            </p>
            <DialogClose asChild>
              <Button variant="dark" className="mt-6">
                Close
              </Button>
            </DialogClose>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <Field label="Full name" error={errors.name}>
              <input name="name" autoComplete="name" className="field-input" />
            </Field>
            <Field label="Email address" error={errors.email}>
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="field-input"
              />
            </Field>
            <Field label="Preferred experience" error={errors.service}>
              <select name="service" className="field-input">
                <option value="">Select an experience</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="What would you like support with?" error={errors.intent}>
              <textarea name="intent" rows={4} className="field-input resize-none" />
            </Field>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Maybe Later
                </Button>
              </DialogClose>
              <Button type="submit" variant="dark">
                Send Request
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-xs text-red-700">{error}</span> : null}
    </label>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-muted">
      {children}
    </p>
  )
}

function ImageCard({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <figure className={cn('image-frame overflow-hidden bg-sage/20', className)}>
      <img src={src} alt={alt} className="size-full object-cover" loading="lazy" />
    </figure>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="font-serif text-5xl leading-none tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
    </div>
  )
}

function Marker() {
  return (
    <span className="relative flex size-12 items-center justify-center rounded-full border border-paper/40">
      <span className="size-3 rounded-full bg-paper" />
      <span className="absolute inset-0 animate-ping rounded-full border border-paper/35" />
    </span>
  )
}

function FooterBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="border-t border-paper/15 pt-6">
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-paper/54">
        {title}
      </p>
      <div className="mt-5 space-y-2 font-serif text-3xl leading-tight">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}
