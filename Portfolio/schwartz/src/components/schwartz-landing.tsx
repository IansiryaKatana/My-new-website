import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Grid2X2,
  MoveUpRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  contactHref,
  featuredProject,
  heroChips,
  images,
  metrics,
  navItems,
  services,
  testimonials,
  type Service,
} from '@/data/schwartz'
import { cn, trackEvent } from '@/lib/utils'

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p
      className={cn(
        'text-[7px] font-medium uppercase tracking-[0.18em]',
        light ? 'text-white/60' : 'text-neutral-500',
      )}
    >
      {children}
    </p>
  )
}

function BlueDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-5 place-items-center rounded-full bg-accent text-[10px] text-accent-foreground transition-transform duration-200 group-hover/button:translate-x-0.5',
        className,
      )}
    >
      <ArrowRight className="size-3" />
    </span>
  )
}

function serviceIcon(service: Service) {
  const iconClass = 'size-3'

  if (service.icon === 'grid') return <Grid2X2 className={iconClass} />
  if (service.icon === 'spark') return <Sparkles className={iconClass} />
  if (service.icon === 'circle') return <CircleDot className={iconClass} />

  return <MoveUpRight className={iconClass} />
}

function handleTrack(eventName: string, payload?: Record<string, string>) {
  trackEvent(eventName, payload)
}

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-[var(--page-padding)] pt-2 text-white">
      <div className="flex items-center justify-between border-b border-white/20 pb-1 text-[6px] uppercase tracking-[0.18em] text-white/75">
        <span>Schwartz Estates</span>
        <span>Luxury advisory / since 2014</span>
      </div>
      <nav className="flex items-center justify-between py-3 text-[8px] uppercase tracking-[0.14em] text-white/85">
        <a href="#home" aria-label="Schwartz home">
          SE / 14
        </a>
        <div className="flex gap-3">
          {navItems.slice(0, 3).map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white">
              {item}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative min-h-[300px] overflow-hidden bg-black text-white sm:min-h-[420px] md:min-h-[720px]">
      <img
        src={images.hero}
        alt="Modern concrete residence over calm water"
        className="hero-image-motion architectural-image absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/55" />
      <Header />
      <div className="relative z-10 flex min-h-[300px] flex-col justify-end px-[var(--page-padding)] pb-3 pt-20 sm:min-h-[420px] md:min-h-[720px] md:pb-8">
        <div className="reveal mb-4 flex items-start justify-between gap-4 md:mb-8">
          <p className="max-w-[10rem] text-[6px] uppercase leading-tight tracking-[0.16em] text-white/75 md:text-[8px]">
            A new way to making owned experience through architecture and real-estate intelligence.
          </p>
          <span className="pr-[9vw] pt-2 text-[14px] font-light italic tracking-[-0.05em] text-white/80">
            estates
          </span>
        </div>
        <h1 className="reveal text-[clamp(4.7rem,20vw,12rem)] font-light lowercase leading-[0.72] tracking-[-0.095em] text-white/90 [animation-delay:120ms]">
          schwartz
        </h1>
        <div className="mt-3 flex items-end justify-between gap-3 md:mt-6">
          <div className="grid flex-1 grid-cols-2 gap-1.5 md:max-w-xl md:grid-cols-4">
            {heroChips.map((chip, index) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleTrack('hero_chip_click', { chip })}
                className="reveal rounded-full border border-white/25 bg-white/10 px-2.5 py-1.5 text-left text-[6px] uppercase tracking-[0.12em] text-white/80 backdrop-blur transition hover:bg-white/20 md:px-3 md:py-2 md:text-[7px]"
                style={{ animationDelay: `${260 + index * 70}ms` }}
              >
                {chip}
              </button>
            ))}
          </div>
          <Button asChild size="sm" onClick={() => handleTrack('hero_book_call_click')}>
            <a href={contactHref} className="shrink-0">
              Book a call
              <BlueDot />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function IntroServices() {
  return (
    <section id="architecture" className="px-[var(--page-padding)] py-8 md:py-16">
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div className="flex items-center gap-3">
          <SectionLabel># we create</SectionLabel>
          <span className="grid size-5 place-items-center rounded-full bg-accent text-[9px] text-accent-foreground">
            01
          </span>
        </div>
        <h2 className="max-w-2xl text-[1.45rem] font-normal leading-[0.95] tracking-[-0.065em] text-balance md:text-[clamp(2.8rem,5.5vw,4.5rem)]">
          We believe that buying or selling a home is not just a transaction.
          It is a life-changing experience.
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-1.5 md:grid-cols-4">
        {services.map((service, index) => (
          <button
            key={service.id}
            type="button"
            onClick={() => {
              handleTrack('service_card_click', { service: service.id })
              window.location.href = contactHref
            }}
            className="reveal group min-h-[108px] border border-border bg-white p-3 text-left transition duration-200 hover:border-neutral-900 hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] md:min-h-[180px]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="text-[8px] text-neutral-500">{service.number}</span>
              <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-foreground transition group-hover:scale-105">
                {serviceIcon(service)}
              </span>
            </div>
            <div className="mt-8 md:mt-20">
              <h3 className="text-[13px] font-medium tracking-[-0.04em] md:text-base">
                {service.title}
              </h3>
              <p className="mt-2 text-[8px] leading-snug text-muted-foreground md:text-[11px]">
                {service.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function ExperienceStatement() {
  return (
    <section className="relative overflow-hidden px-[var(--page-padding)] py-[var(--section-gap)] text-center">
      <SectionLabel># since 2014</SectionLabel>
      <h2 className="mx-auto mt-5 max-w-4xl text-[1.45rem] font-normal leading-[0.92] tracking-[-0.075em] text-balance md:text-[clamp(3rem,6vw,5.5rem)]">
        We have developed more than 250 million square meters in several highly
        relevant and successful projects in UK and abroad.
      </h2>
      <img
        src={images.fragmentLeft}
        alt=""
        loading="lazy"
        className="architectural-image absolute bottom-8 left-4 h-16 w-24 object-cover md:h-28 md:w-44"
      />
      <img
        src={images.fragmentRight}
        alt=""
        loading="lazy"
        className="architectural-image absolute bottom-6 right-4 h-16 w-24 object-cover md:h-28 md:w-44"
      />
    </section>
  )
}

function FeaturedProject() {
  return (
    <section id="residences" className="px-[var(--page-padding)] py-3">
      <div className="grid overflow-hidden rounded-md bg-[#030303] p-3 text-white md:grid-cols-[0.85fr_1.15fr] md:p-5">
        <div className="flex min-h-[420px] flex-col justify-between pr-2 md:min-h-[620px] md:pr-8">
          <div>
            <SectionLabel light># investment</SectionLabel>
            <h2 className="mt-6 max-w-lg text-[1.35rem] font-normal leading-[0.9] tracking-[-0.07em] text-balance md:text-[clamp(3rem,5.4vw,4.9rem)]">
              We believe that buying or selling a home is not just a transaction.
            </h2>
          </div>
          <div className="grid grid-cols-[1fr_1.1fr] gap-3 md:items-end">
            <div>
              <span className="text-[9px] text-white/50">03</span>
              <h3 className="mt-5 text-base font-medium tracking-[-0.04em]">
                {featuredProject.title}
              </h3>
              <p className="mt-2 text-[9px] leading-snug text-white/55 md:text-xs">
                {featuredProject.description}
              </p>
              <Button
                asChild
                size="sm"
                className="mt-5"
                onClick={() => handleTrack('project_book_call_click')}
              >
                <a href={contactHref}>
                  {featuredProject.ctaLabel}
                  <BlueDot />
                </a>
              </Button>
            </div>
            <img
              src={featuredProject.secondaryImage}
              alt="Interior detail of Riverside residence"
              loading="lazy"
              className="cinematic-image h-32 w-full object-cover md:h-56"
            />
          </div>
        </div>
        <div className="relative mt-3 min-h-[420px] overflow-hidden rounded-sm md:mt-0 md:min-h-[620px]">
          <img
            src={featuredProject.mainImage}
            alt="Featured modern residence in Barcelona"
            loading="lazy"
            className="cinematic-image mask-reveal h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 rounded-full bg-white/12 px-3 py-1 text-[7px] uppercase tracking-[0.16em] text-white backdrop-blur">
            {featuredProject.location}
          </div>
          <div className="absolute right-3 top-3 text-[24px] font-light tracking-[-0.08em] text-white/80">
            {featuredProject.priceLabel}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const testimonial = testimonials[activeIndex]
  const stars = useMemo(() => '*'.repeat(testimonial.rating), [testimonial.rating])

  function move(direction: 1 | -1) {
    handleTrack('testimonial_navigation_click', { direction: String(direction) })
    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length)
  }

  return (
    <section className="grid gap-6 px-[var(--page-padding)] py-10 md:grid-cols-[0.85fr_1.15fr] md:items-center md:py-20">
      <div>
        <SectionLabel># what clients say</SectionLabel>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous testimonial"
            className="grid size-8 place-items-center border border-border bg-white text-neutral-900 transition hover:bg-neutral-100"
          >
            <ArrowLeft className="size-3" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next testimonial"
            className="grid size-8 place-items-center bg-accent text-accent-foreground transition hover:brightness-95"
          >
            <ArrowRight className="size-3" />
          </button>
        </div>
        <Card className="mt-4 overflow-hidden bg-[#d7e0df]">
          <CardContent className="relative min-h-[210px] p-5 md:min-h-[340px]">
            <img
              src={testimonial.image}
              alt={`${testimonial.clientName} portrait`}
              loading="lazy"
              className="architectural-image mx-auto h-36 w-28 object-cover md:h-56 md:w-40"
            />
            <p className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.14em]">
              {testimonial.clientName}
            </p>
            <span className="absolute bottom-5 right-5 text-[9px] text-red-600">
              +{testimonial.rating}
            </span>
          </CardContent>
        </Card>
      </div>
      <div>
        <blockquote className="text-[1.4rem] font-normal leading-[0.92] tracking-[-0.07em] text-balance md:text-[clamp(2.8rem,5.5vw,4.4rem)]">
          {testimonial.quote}
        </blockquote>
        <div className="mt-8">
          <p className="text-sm font-medium">{testimonial.clientName}</p>
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            {testimonial.clientRole}
          </p>
          <p aria-label={`${testimonial.rating} star rating`} className="mt-4 text-sm text-accent">
            {stars}
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Market expertise review
          </p>
        </div>
      </div>
    </section>
  )
}

function MetricsStrip() {
  return (
    <section id="investments" className="grid grid-cols-3 border-y border-border bg-white">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={cn(
            'min-h-[125px] px-3 py-5 md:min-h-[190px] md:px-8 md:py-8',
            index < metrics.length - 1 && 'border-r border-border',
          )}
        >
          <p className="text-[clamp(2rem,8vw,5rem)] font-light leading-none tracking-[-0.08em]">
            {metric.value}
          </p>
          <h3 className="mt-5 text-[9px] font-medium uppercase tracking-[0.1em] md:text-xs">
            {metric.label}
          </h3>
          <p className="mt-2 text-[7px] leading-snug text-muted-foreground md:text-[11px]">
            {metric.description}
          </p>
        </div>
      ))}
    </section>
  )
}

function FinalCta() {
  return (
    <section className="px-[var(--page-padding)] py-3">
      <div className="relative min-h-[420px] overflow-hidden rounded-sm bg-black md:min-h-[650px]">
        <img
          src={images.cta}
          alt="Cinematic glass residence at dusk"
          loading="lazy"
          className="cinematic-image h-full min-h-[420px] w-full object-cover md:min-h-[650px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35" />
        <div className="absolute left-4 top-4 text-white">
          <SectionLabel light># end-to-end real-estate operation</SectionLabel>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
          <Button asChild size="sm" onClick={() => handleTrack('final_cta_click')}>
            <a href={contactHref}>
              Let's talk
              <BlueDot />
            </a>
          </Button>
          <h2 className="max-w-4xl text-right text-[1.35rem] font-normal leading-[0.88] tracking-[-0.075em] text-balance md:text-[clamp(3rem,6vw,5rem)]">
            Gain end-to-end visibility of your entire operation for smarter
            decision-making, today and tomorrow.
          </h2>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="overflow-hidden bg-[#030303] px-[var(--page-padding)] pt-7 text-white">
      <div className="grid gap-8 border-t border-white/15 pt-6 md:grid-cols-[1.15fr_0.65fr_0.8fr_0.8fr]">
        <div>
          <SectionLabel light># schwartz</SectionLabel>
          <p className="mt-5 max-w-xs text-[11px] leading-snug text-white/60">
            A luxury real-estate and architecture advisory for exceptional homes,
            refined developments, and private acquisition briefs.
          </p>
          <p className="mt-8 text-[9px] uppercase tracking-[0.12em] text-white/35">
            (c) Copyright 2026. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5 text-[10px] uppercase tracking-[0.12em] text-white/70 md:block">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block py-1 hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <address className="not-italic text-[11px] leading-snug text-white/60">
          Spreeban 15, 2450 Meerhacht ANT,
          <br />
          Belgium.
        </address>
        <a href="tel:+32478121805" className="text-[11px] text-white/75 hover:text-white">
          +324 78 12 18 05
        </a>
      </div>
      <a
        href={contactHref}
        onClick={() => handleTrack('footer_email_click')}
        className="mask-reveal mt-12 block pb-2 text-[clamp(4rem,16vw,13rem)] font-light leading-[0.78] tracking-[-0.095em] text-white"
      >
        hello@schwartz.com
      </a>
    </footer>
  )
}

export function SchwartzLanding() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <IntroServices />
      <ExperienceStatement />
      <FeaturedProject />
      <TestimonialSection />
      <MetricsStrip />
      <FinalCta />
      <Footer />
    </main>
  )
}
