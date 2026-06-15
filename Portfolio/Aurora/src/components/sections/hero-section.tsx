import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { images } from '@/data/wellness'

const navItems = [
  ['Approach', '#philosophy'],
  ['Nutrition', '#nutrition'],
  ['Treatments', '#treatments'],
  ['Formulas', '#formulas'],
]

export function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-forest text-aurora-white md:h-screen">
      <img
        src={images.hero}
        alt="Soft morning wellness ritual"
        className="slow-zoom image-treatment absolute inset-0 h-full w-full object-cover opacity-80"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-forest/25 to-ink/55" />

      <div className="page-container relative z-10 flex min-h-[760px] flex-col justify-between py-6 md:h-screen md:py-8">
        <header className="flex items-center justify-between gap-6 text-xs">
          <a href="#top" className="font-semibold uppercase tracking-[0.34em]">
            Aurora
          </a>
          <nav className="hidden items-center gap-8 text-aurora-white/78 md:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <Button asChild variant="cream" size="sm">
            <a href="#consult">
              Begin
              <ArrowUpRight className="size-3" />
            </a>
          </Button>
        </header>

        <div className="grid gap-8 pb-10 md:grid-cols-[1.1fr_0.52fr] md:items-end md:pb-16">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs uppercase tracking-[0.32em] text-aurora-white/70">Personal self-care studio</p>
            <h1 className="max-w-5xl text-[clamp(3rem,8vw,7.2rem)] font-light leading-[0.88] tracking-[-0.07em]">
              Thoughtful care for your body, made naturally gentle.
            </h1>
          </div>
          <div className="max-w-sm justify-self-start md:justify-self-end">
            <p className="mb-6 text-sm leading-6 text-aurora-white/78">
              Guided nutrition, daily formulas, and clinician-backed routines designed to bring balance into ordinary life.
            </p>
            <Button asChild variant="lime">
              <a href="#treatments">
                Explore care
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/18 pt-5 text-[11px] uppercase tracking-[0.26em] text-white/65">
          <span>Calm clinical support</span>
          <span>01 / 08</span>
        </div>
      </div>
    </section>
  )
}
