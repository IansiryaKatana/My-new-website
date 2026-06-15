import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  HeartPulse,
  Leaf,
  Menu,
  Sparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Button } from './ui/button'
import { LogoMark } from './logo-mark'
import { MetricPill } from './metric-pill'
import { SectionLabel } from './section-label'
import {
  avatars,
  faqs,
  footerLinks,
  imagery,
  introStats,
  navLinks,
  packages,
  services,
  testimonial,
} from '../data/staybil-content'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const slowViewport = { once: true, amount: 0.24 }

export function StaybilLanding() {
  return (
    <main className="min-h-screen overflow-hidden bg-page text-black">
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <WellnessSection />
      <ProofSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden rounded-b-[2rem] bg-black text-white md:m-3 md:rounded-[2rem]"
    >
      <motion.img
        src={imagery.hero}
        alt="Woman resting in warm sunlight during a wellness session"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.02)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.2),transparent_32%)]" />

      <Header />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col px-5 pb-8 pt-28 sm:px-8 lg:px-12">
        <div className="mt-[8vh] max-w-[38rem]">
          <motion.p
            className="mb-5 text-xs uppercase tracking-[0.24em] text-white/70"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            soft body-care intelligence
          </motion.p>
          <h1 className="text-[clamp(3.2rem,8.6vw,7.8rem)] font-light leading-[0.87] tracking-[-0.075em]">
            {['Personal wellness', 'for a stronger', 'body'].map(
              (line, index) => (
                <motion.span
                  className="block"
                  key={line}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  transition={{
                    duration: 0.75,
                    delay: 0.18 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              ),
            )}
          </h1>
        </div>

        <div className="mt-auto grid gap-7 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <img
                  src={avatar}
                  alt=""
                  className="size-10 rounded-full border-2 border-white object-cover"
                  key={avatar}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <p className="max-w-[13rem] text-xs leading-snug text-white/72">
              5,000 happy members signed up for guided body relief.
            </p>
          </motion.div>

          <motion.div
            className="justify-self-start rounded-[1.45rem] bg-white/88 p-3 text-black shadow-2xl shadow-black/20 backdrop-blur-xl sm:w-[14.5rem] lg:justify-self-center"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 text-[1.08rem] font-light leading-[0.96] tracking-[-0.055em]">
              Discover what your personal needs
            </p>
            <div className="relative overflow-hidden rounded-[1rem]">
              <img
                src={imagery.floating}
                alt="Personal wellness plan preview"
                className="h-32 w-full object-cover"
                loading="eager"
              />
              <span className="absolute right-2 top-2 rounded-full bg-warm-white px-2 py-1 text-[0.58rem] uppercase tracking-[0.18em]">
                plan
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-xs leading-tight text-muted">
                Our 6 session plan built around you
              </p>
              <Button size="icon" aria-label="Open plan preview">
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </motion.div>

          <motion.a
            href="#about"
            className="hidden justify-self-end rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70 backdrop-blur-md transition hover:bg-white/10 lg:inline-flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            View the journey
          </motion.a>
        </div>
      </div>
    </section>
  )
}

function Header() {
  return (
    <motion.header
      className="absolute left-0 right-0 top-0 z-20 px-5 pt-5 sm:px-8 lg:px-12"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 rounded-full border border-white/14 bg-white/8 px-4 py-3 text-white backdrop-blur-xl">
        <a href="#home" className="flex items-center gap-3 text-sm font-medium">
          <LogoMark tone="light" className="size-8" />
          <span>Staybil</span>
        </a>
        <div className="hidden items-center gap-7 text-xs text-white/72 lg:flex">
          {navLinks.map((link) => (
            <a
              href={link.href}
              className="transition hover:text-white"
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button variant="cream" size="sm" className="hidden lg:inline-flex">
          Join waitlist
        </Button>
        <button
          className="grid size-9 place-items-center rounded-full bg-white text-black lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </button>
      </nav>
    </motion.header>
  )
}

function IntroSection() {
  return (
    <motion.section
      id="about"
      className="mx-auto grid max-w-[1400px] gap-10 px-5 py-section sm:px-8 lg:grid-cols-[0.7fr_2fr] lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={slowViewport}
      transition={{ staggerChildren: 0.12 }}
    >
      <motion.div variants={fadeUp}>
        <SectionLabel>About</SectionLabel>
      </motion.div>
      <div>
        <motion.p
          className="max-w-[63rem] text-[clamp(2rem,5vw,4.4rem)] font-light leading-[0.95] tracking-[-0.06em]"
          variants={fadeUp}
        >
          If you&apos;re beginning or considering a wellness journey with
          Staybil, it&apos;s helpful to understand what to expect and how it
          works.
        </motion.p>
        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-3"
          variants={fadeUp}
        >
          {introStats.map((stat, index) => (
            <div
              className="rounded-[1.5rem] border border-black/10 bg-card p-5"
              key={stat.label}
            >
              <div className="mb-5 flex items-center justify-between">
                {[Leaf, Activity, Sparkles][index] &&
                  (() => {
                    const Icon = [Leaf, Activity, Sparkles][index]
                    return <Icon className="size-5 text-soft-green" />
                  })()}
                <span className="text-[0.66rem] uppercase tracking-[0.18em] text-muted">
                  0{index + 1}
                </span>
              </div>
              <p className="text-3xl font-light tracking-[-0.06em]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="px-3 pb-section">
      <motion.div
        className="mx-auto max-w-[1480px] rounded-[1.9rem] bg-black p-5 text-white sm:p-8 lg:p-12"
        initial="hidden"
        whileInView="visible"
        viewport={slowViewport}
        variants={fadeUp}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8 grid gap-7 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
          <h2 className="max-w-[48rem] text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-[0.9] tracking-[-0.07em]">
            We&apos;ve created services to relieve all sorts of pain in the
            body.
          </h2>
          <span className="h-fit rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-black">
            app-led care
          </span>
          <LogoMark tone="light" className="justify-self-start lg:justify-self-end" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              className="group flex min-h-[26rem] flex-col overflow-hidden rounded-[1.45rem] bg-charcoal p-5"
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={slowViewport}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mb-5 flex items-start justify-between gap-5">
                <h3 className="max-w-[16rem] text-[1.55rem] font-light leading-[0.96] tracking-[-0.055em]">
                  {service.title}
                </h3>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[0.62rem] text-white/58">
                  00{index + 1}
                </span>
              </div>
              <div className="relative mb-5 flex-1 overflow-hidden rounded-[1.2rem]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full min-h-52 w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute left-3 top-3 grid gap-2">
                  {service.metrics.map((metric) => (
                    <span
                      className="w-fit rounded-full bg-white/90 px-3 py-1 text-[0.68rem] text-black backdrop-blur"
                      key={metric.label}
                    >
                      {metric.value} {metric.label}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 right-3 rounded-[1rem] bg-black/82 p-3 text-white backdrop-blur-md">
                  <HeartPulse className="mb-4 size-5 text-accent" />
                  <p className="text-xs text-white/64">care path updated</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/58">
                {service.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function WellnessSection() {
  return (
    <section
      id="treatments"
      className="mx-auto max-w-[1400px] px-5 pb-section sm:px-8 lg:px-12"
    >
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <SectionLabel>Wellness package</SectionLabel>
          <h2 className="mt-7 max-w-[42rem] text-[clamp(2.35rem,5.4vw,5rem)] font-light leading-[0.9] tracking-[-0.07em]">
            Thoughtful wellness packages, designed to feel deeply personal.
          </h2>
        </div>
        <LogoMark className="hidden sm:inline-grid" />
      </div>

      <Accordion type="single" defaultValue="002" collapsible>
        {packages.map((item, index) => (
          <AccordionItem value={item.number} key={item.number}>
            <AccordionTrigger>
              <span className="grid flex-1 gap-2 sm:grid-cols-[7rem_1fr]">
                <span className="text-sm uppercase tracking-[0.2em] text-muted">
                  {item.number}
                </span>
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-7 lg:grid-cols-[0.85fr_1.35fr_0.8fr] lg:items-center">
                <p className="max-w-md text-base leading-relaxed text-muted">
                  {item.description}
                </p>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[18rem] w-full rounded-[1.6rem] object-cover sm:h-[22rem]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="rounded-[1.35rem] bg-black p-4 text-white">
                  <div className="mb-10 flex items-center justify-between">
                    <p className="text-sm text-white/62">Today&apos;s body map</p>
                    <ArrowDownRight className="size-4 text-accent" />
                  </div>
                  <div className="grid gap-3">
                    {item.stats.map((stat, statIndex) => (
                      <MetricPill
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        progress={statIndex === 0 ? 84 : 62}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function ProofSection() {
  return (
    <section id="app" className="px-3 pb-section">
      <motion.div
        className="relative mx-auto min-h-[36rem] max-w-[1480px] overflow-hidden rounded-[2rem] bg-black p-6 text-white sm:p-10 lg:p-12"
        initial="hidden"
        whileInView="visible"
        viewport={slowViewport}
        variants={fadeUp}
      >
        <img
          src={imagery.proof}
          alt="Calm natural landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.58))]" />
        <div className="relative z-10 flex min-h-[31rem] flex-col">
          <SectionLabel tone="light">Proven treatments</SectionLabel>
          <h2 className="mx-auto mt-8 max-w-[44rem] text-center text-[clamp(2.4rem,5.8vw,5.2rem)] font-light leading-[0.9] tracking-[-0.07em]">
            Proven treatments tailored to your needs.
          </h2>
          <div className="mt-auto grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="rounded-[1.5rem] bg-black/82 p-5 backdrop-blur-xl sm:grid sm:grid-cols-[10rem_1fr] sm:gap-5">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-44 w-full rounded-[1.15rem] object-cover sm:h-full"
                loading="lazy"
              />
              <div className="mt-5 sm:mt-0">
                <p className="text-[clamp(1.35rem,3vw,2.2rem)] font-light leading-[1] tracking-[-0.055em]">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-9 flex items-end justify-between gap-4">
                  <p>
                    <span className="block text-sm">{testimonial.name}</span>
                    <span className="text-xs text-white/52">
                      {testimonial.role}
                    </span>
                  </p>
                  <span className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-white" />
                    <span className="size-2 rounded-full bg-white/32" />
                    <span className="size-2 rounded-full bg-white/32" />
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-warm-white p-5 text-black">
              <p className="mb-8 text-sm text-muted">Nutrition tracking</p>
              <div className="grid gap-3">
                <MetricPill label="protein rhythm" value="112g" progress={76} />
                <MetricPill label="recovery score" value="89%" progress={89} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function FAQSection() {
  return (
    <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-section sm:px-8 lg:grid-cols-[0.9fr_1.2fr] lg:gap-24 lg:px-12">
      <div>
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="mt-7 max-w-[32rem] text-[clamp(2.3rem,5.2vw,4.8rem)] font-light leading-[0.9] tracking-[-0.07em]">
          Here are a few things you might be wondering.
        </h2>
        <img
          src={imagery.faq}
          alt="Relaxing massage detail"
          className="mt-10 h-44 w-full rounded-[1.5rem] object-cover sm:w-72"
          loading="lazy"
        />
      </div>
      <Accordion type="single" collapsible className="self-start">
        {faqs.map((faq) => (
          <AccordionItem value={faq.question} key={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="max-w-2xl text-base leading-relaxed text-muted">
                {faq.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function CTASection() {
  return (
    <section className="px-3 pb-3">
      <div className="relative mx-auto grid min-h-[34rem] max-w-[1480px] place-items-center overflow-hidden rounded-[2rem] p-6 text-center">
        <img
          src={imagery.cta}
          alt="Mountain lake landscape"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative max-w-[48rem]">
          <h2 className="text-[clamp(2.4rem,5.8vw,5.4rem)] font-light leading-[0.9] tracking-[-0.07em]">
            Affordable, enjoyable wellness for everyone. Experience the
            difference today.
          </h2>
          <Button className="mt-7">Join waitlist</Button>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="px-3 pb-3">
      <div className="mx-auto max-w-[1480px] overflow-hidden rounded-t-[2rem] bg-black px-5 pb-2 pt-10 text-warm-white sm:px-8 lg:px-12">
        <div className="grid gap-9 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Contact">
            <a href="mailto:hello@staybil.com">hello@staybil.com</a>
            <a href="tel:+15550194840">+1 555 019 4840</a>
            <span>Mon-Fri, 8am-6pm</span>
          </FooterColumn>
          <FooterColumn title="Services" items={footerLinks.services} />
          <FooterColumn title="Company" items={footerLinks.company} />
          <FooterColumn title="Studio">
            <span>34 Warmline Avenue</span>
            <span>Wellness District</span>
            <span>New York, NY</span>
          </FooterColumn>
        </div>
        <div className="flex flex-col gap-5 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>2026 Staybil. Wellness guidance, not emergency medical care.</p>
          <div className="flex gap-4">
            {footerLinks.social.map((item) => (
              <a className="transition hover:text-white" href="#home" key={item}>
                {item}
              </a>
            ))}
          </div>
        </div>
        <p className="select-none text-[clamp(5.2rem,21vw,18.5rem)] font-light leading-[0.72] tracking-[-0.095em]">
          Staybil
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  items,
  children,
}: {
  title: string
  items?: string[]
  children?: ReactNode
}) {
  return (
    <div>
      <p className="mb-5 text-[0.68rem] uppercase tracking-[0.22em] text-white/36">
        {title}
      </p>
      <div className="grid gap-2 text-sm text-white/68">
        {items?.map((item) => (
          <a className="transition hover:text-white" href="#home" key={item}>
            {item}
          </a>
        ))}
        {children}
      </div>
    </div>
  )
}
