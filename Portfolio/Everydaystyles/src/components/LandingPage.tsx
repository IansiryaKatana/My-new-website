import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Menu,
  Quote,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  footerLinks,
  imagery,
  navItems,
  partners,
  testimonials,
} from '@/lib/landing-content'
import { Button } from '@/components/ui/button'
import { SignupDialog } from '@/components/SignupDialog'

const revealViewport = { once: true, margin: '-80px' } as const
const revealTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroMode, setHeroMode] = useState<'Light' | 'Dark'>('Light')
  const [activeStory, setActiveStory] = useState(0)
  const story = testimonials[activeStory]

  function showPreviousStory() {
    setActiveStory((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    )
  }

  function showNextStory() {
    setActiveStory((current) => (current + 1) % testimonials.length)
  }

  return (
    <main id="top" className="min-h-screen bg-page text-ink">
      <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-10 lg:pt-8">
        <header className="grid min-h-12 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <a
            href="#top"
            className="font-display text-xl font-black uppercase tracking-[-0.06em]"
          >
            Everydaystyles
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group inline-flex items-center gap-2 text-neutral-800 transition hover:text-black"
              >
                {item.label}
                {item.badge ? (
                  <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>

          <div className="justify-self-end">
            <div className="hidden lg:block">
              <SignupDialog>
                <Button variant="light" size="sm">
                  Join The Hub
                </Button>
              </SignupDialog>
            </div>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </header>

        {menuOpen ? (
          <nav
            id="mobile-nav"
            className="mt-4 grid gap-2 rounded-[24px] bg-white p-3 text-sm font-semibold shadow-sm lg:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-4 py-3 hover:bg-neutral-100"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                {item.badge ? (
                  <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] uppercase text-white">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            ))}
            <SignupDialog>
              <Button className="mt-1 w-full">Join The Hub</Button>
            </SignupDialog>
          </nav>
        ) : null}

        <section className="pt-8 lg:pt-10" aria-labelledby="hero-title">
          <motion.h1
            id="hero-title"
            className="hero-title font-display text-[21vw] font-black uppercase leading-[0.76] tracking-[-0.075em] sm:text-[18vw] lg:text-[13.5vw]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            You Own The Mood
          </motion.h1>

          <motion.div
            className={`hero-card relative -mt-2 min-h-[520px] overflow-hidden rounded-[28px] bg-neutral-950 shadow-sm sm:min-h-[580px] lg:-mt-7 lg:min-h-[470px] ${
              heroMode === 'Dark' ? 'is-dark' : ''
            }`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={imagery.hero}
              alt="Cyclist moving through a quiet outdoor road"
              className="absolute inset-0 size-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65" />
            <div className="absolute left-5 top-5 rounded-full border border-white/35 px-4 py-2 text-xs font-semibold text-white/90">
              Since 2025
            </div>
            <div className="absolute right-5 top-5 flex rounded-full bg-black/35 p-1 text-xs font-semibold text-white backdrop-blur">
              {(['Light', 'Dark'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setHeroMode(mode)}
                  className={`rounded-full px-3 py-1.5 transition ${
                    heroMode === mode
                      ? 'bg-white text-neutral-950'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="absolute inset-x-6 bottom-16 mx-auto max-w-xl text-center text-white sm:bottom-20">
              <motion.p
                className="text-balance text-lg font-semibold leading-7 sm:text-xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
              >
                We are a sex-positive space with a mission to help every adult
                build healthier intimacy!
              </motion.p>
              <SignupDialog>
                <Button className="mt-6 bg-white text-neutral-950 hover:bg-neutral-100">
                  Start Your Learning
                  <ArrowRight className="size-4" />
                </Button>
              </SignupDialog>
            </div>
          </motion.div>
        </section>

        <section
          id="about"
          className="section-grid relative mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12"
          aria-labelledby="purpose-title"
        >
          <SectionNumber number="/01" className="lg:col-span-12" />
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={revealTransition}
          >
            <SectionBadge>Build the Connection</SectionBadge>
            <h2 id="purpose-title" className="section-heading mt-6">
              More Than Just Sex
              <br />
              <span>- Attain Intimacy.</span>
            </h2>
            <DividerText>Trust, pleasure, and connection.</DividerText>

            <div className="mt-8 grid min-h-[230px] gap-5 rounded-[24px] bg-neutral-950 p-6 text-white sm:grid-cols-[1fr_190px] sm:p-7">
              <div className="flex flex-col justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Our Purpose
                </p>
                <p className="max-w-xs text-balance text-lg font-medium leading-7">
                  Helping people understand desire, safety, and enjoy healthy
                  intimacy.
                </p>
              </div>
              <div className="rounded-[22px] bg-white p-4 text-neutral-950">
                <div className="mb-4 flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-neutral-950 text-white">
                    <BarChart3 className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Total Insights</p>
                    <p className="text-[11px] text-neutral-500">
                      13 insights this week
                    </p>
                  </div>
                </div>
                <MiniChart />
              </div>
            </div>
          </motion.div>

          <ImageCard
            src={imagery.purpose}
            alt="Close-up lifestyle image suggesting calm confidence"
            className="min-h-[460px] lg:col-span-6"
          >
            <div className="overlay-card bottom-5 right-5 w-[190px]">
              <p className="text-xs text-neutral-500">Confidence Built</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <strong className="text-2xl tracking-[-0.04em]">1,498</strong>
                <span className="grid size-10 place-items-center rounded-full border-4 border-neutral-950 border-l-neutral-200 text-[10px]">
                  74%
                </span>
              </div>
              <p className="text-xs text-neutral-500">readers</p>
            </div>
          </ImageCard>
        </section>

        <section
          id="learning"
          className="mt-16 rounded-[32px] bg-card p-4 shadow-sm sm:p-6 lg:mt-20 lg:p-10"
          aria-labelledby="learning-title"
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionBadge>Learn with Purpose</SectionBadge>
            </div>
            <SectionNumber number="/02" className="lg:col-span-1 lg:justify-self-center" />
            <motion.div
              className="lg:col-span-6 lg:text-right"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={revealTransition}
            >
              <h2 id="learning-title" className="section-heading">
                Join Intimacy Lessons
                <br />
                <span>- For Every Adult.</span>
              </h2>
              <DividerText align="right">
                Learn at your pace, one step at a time.
              </DividerText>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <ImageCard
              src={imagery.learning}
              alt="Two adults outdoors in a supportive learning metaphor"
              className="min-h-[420px] lg:col-span-5"
            >
              <div className="overlay-card bottom-5 left-5 right-5 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-950 text-white">
                  <BadgeCheck className="size-4" />
                </span>
                <p className="text-sm font-semibold leading-5">
                  Gain practical guidance, reassurance, and supportive insight!
                </p>
              </div>
            </ImageCard>

            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ ...revealTransition, delay: 0.1 }}
            >
              <Quote className="mb-8 size-8 fill-neutral-950 text-neutral-950" />
              <p className="text-balance text-xl font-medium leading-8">
                Track your growth and see how far your confidence has come.
              </p>
              <SignupDialog>
                <Button className="mt-7">
                  Explore A Topic
                  <ArrowRight className="size-4" />
                </Button>
              </SignupDialog>
            </motion.div>

            <motion.article
              className="rounded-[26px] bg-neutral-950 p-4 text-white lg:col-span-4"
              initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={revealViewport}
              transition={{ ...revealTransition, delay: 0.2 }}
            >
              <img
                src={imagery.module}
                alt="Warm editorial image for the consent guide"
                className="h-52 w-full rounded-[20px] object-cover grayscale"
              />
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Consent Guide</h3>
                  <p className="mt-1 text-sm leading-5 text-white/60">
                    15 modules with 160 expert takeaways
                  </p>
                </div>
                <SignupDialog>
                  <Button size="icon" className="shrink-0 bg-white text-neutral-950">
                    <ArrowRight className="size-4" />
                  </Button>
                </SignupDialog>
              </div>
            </motion.article>
          </div>
        </section>

        <section
          id="stories"
          className="relative mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12"
          aria-labelledby="stories-title"
        >
          <SectionNumber number="/03" className="lg:col-span-12" />
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={revealTransition}
          >
            <SectionBadge>Reader Testimony</SectionBadge>
            <h2 id="stories-title" className="section-heading mt-6">
              Your Intimacy Journey
              <br />
              <span>- Into Confidence.</span>
            </h2>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <DividerText className="mt-0 flex-1">Listen to these real stories</DividerText>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="light"
                  size="icon"
                  onClick={showPreviousStory}
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  onClick={showNextStory}
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <article className="mt-8 rounded-[26px] bg-white p-5 shadow-sm sm:p-7">
              <Quote className="mb-6 size-7 fill-neutral-950 text-neutral-950" />
              <div className="grid gap-5 sm:grid-cols-[1fr_150px] sm:items-center">
                <div>
                  <p className="text-balance text-2xl font-black leading-8 tracking-[-0.04em]">
                    "{story.quote}"
                  </p>
                  <p className="mt-5 text-sm font-semibold text-neutral-500">
                    - {story.name}, {story.age}
                  </p>
                </div>
                <img
                  src={story.image}
                  alt={`${story.name} testimonial`}
                  className="h-36 w-full rounded-[20px] object-cover grayscale sm:h-40"
                />
              </div>
            </article>
          </motion.div>

          <ImageCard
            src={imagery.story}
            alt="Smiling adult outdoors, representing learner confidence"
            className="min-h-[520px] lg:col-span-6"
          >
            <div className="overlay-card bottom-5 left-5 flex items-center gap-3">
              <strong className="font-display text-4xl font-black tracking-[-0.05em]">
                1,500+
              </strong>
              <span className="max-w-[70px] text-xs font-semibold leading-4">
                learners have joined
              </span>
            </div>
          </ImageCard>
        </section>

        <section className="my-12 flex flex-col gap-5 border-y border-line py-7 text-sm text-neutral-500 lg:my-16 lg:flex-row lg:items-center">
          <p>In Conversation with</p>
          <div className="grid flex-1 grid-cols-2 gap-5 text-center font-display text-2xl font-black uppercase tracking-[-0.04em] text-neutral-500/80 sm:grid-cols-4">
            {partners.map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </section>
      </div>

      <footer id="footer" className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_repeat(3,1fr)]">
            <div>
              <p className="max-w-sm text-balance text-2xl font-semibold leading-9">
                Join us and start discovering the value of healthier, more
                connected intimacy.
              </p>
              <div className="mt-6 flex gap-2">
                {[imagery.thumbOne, imagery.thumbTwo, imagery.thumbThree].map(
                  (src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="size-14 rounded-2xl object-cover grayscale"
                    />
                  ),
                )}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-white/90">{title}</h3>
                <ul className="mt-4 grid gap-3 text-sm text-white/55">
                  {links.map((link) => {
                    const href = getFooterHref(title, link)
                    const isExternal = href.startsWith('http')

                    return (
                      <li key={link}>
                        <a
                          href={href}
                          className="footer-link hover:text-white"
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noreferrer' : undefined}
                        >
                          {link}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <motion.p
            className="mt-14 overflow-hidden font-display text-[18vw] font-black uppercase leading-[0.75] tracking-[-0.075em] lg:mt-20 lg:text-[12.6vw]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={revealTransition}
          >
            Everydaystyles
          </motion.p>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright ©2025 All Rights Reserved.</p>
            <div className="flex gap-5">
              <a href="#top" className="footer-link">
                Terms & Conditions
              </a>
              <a href="#top" className="footer-link">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function SectionBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-line bg-white/70 px-4 py-2 text-xs font-semibold text-neutral-600">
      {children}
    </span>
  )
}

function SectionNumber({
  number,
  className,
}: {
  number: string
  className?: string
}) {
  return (
    <div className={`flex justify-end ${className ?? ''}`}>
      <span className="font-display text-4xl font-light tracking-[-0.05em] text-neutral-400">
        {number}
      </span>
    </div>
  )
}

function DividerText({
  children,
  align = 'left',
  className = '',
}: {
  children: string
  align?: 'left' | 'right'
  className?: string
}) {
  return (
    <div
      className={`mt-5 flex items-center gap-4 text-sm text-neutral-500 ${
        align === 'right' ? 'justify-end' : ''
      } ${className}`}
    >
      {align === 'right' ? <span className="h-px flex-1 bg-line" /> : null}
      <span>{children}</span>
      {align === 'left' ? <span className="h-px flex-1 bg-line" /> : null}
    </div>
  )
}

function ImageCard({
  src,
  alt,
  className,
  children,
}: {
  src: string
  alt: string
  className?: string
  children?: ReactNode
}) {
  return (
    <motion.figure
      className={`image-card relative overflow-hidden rounded-[28px] bg-neutral-200 ${className ?? ''}`}
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/15" />
      {children}
    </motion.figure>
  )
}

function MiniChart() {
  return (
    <div className="flex h-24 items-end justify-between gap-1">
      {[36, 58, 44, 76, 62, 90, 54].map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-full rounded-t bg-neutral-300"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}

function getFooterHref(group: string, label: string) {
  const navigation: Record<string, string> = {
    Home: '#top',
    About: '#about',
    'Topics Hub': '#learning',
    'Real Stories': '#stories',
    Tips: '#footer',
  }

  const socials: Record<string, string> = {
    Instagram: 'https://www.instagram.com/',
    Facebook: 'https://www.facebook.com/',
    'Twitter (X)': 'https://x.com/',
    LinkedIn: 'https://www.linkedin.com/',
  }

  if (group === 'Navigation') {
    return navigation[label] ?? '#top'
  }

  if (group === 'Socials') {
    return socials[label] ?? '#footer'
  }

  if (label.includes('@')) {
    return `mailto:${label}`
  }

  if (label.startsWith('(')) {
    return `tel:${label.replace(/\D/g, '')}`
  }

  return '#footer'
}
