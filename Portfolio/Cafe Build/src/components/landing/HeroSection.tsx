import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import { CTAButton } from '@/components/landing/CTAButton'
import { MobileMenu } from '@/components/landing/MobileMenu'
import { SiteLogo } from '@/components/landing/SiteLogo'
import type { HeroSectionPayload } from '@/lib/cms/types'
import type { Product } from '@/lib/cms/types'

type HeroSectionProps = {
  hero: HeroSectionPayload
  featuredProducts: Product[]
}

export function HeroSection({ hero, featuredProducts }: HeroSectionProps) {
  const { navItems } = useCms()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
      />

      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--deep-green)] text-white">
        {hero.bgImageUrl && (
          <img
            src={hero.bgImageUrl}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-green)]/70 via-[var(--deep-green)]/85 to-[var(--deep-green)]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-10 pt-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between">
            <SiteLogo size="lg" />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={
                    item.isHighlighted
                      ? 'text-sm font-bold uppercase tracking-wide text-[var(--lime)] no-underline'
                      : 'text-sm font-semibold uppercase tracking-wide text-white/80 no-underline transition hover:text-white'
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="mt-auto flex flex-col gap-8 pb-6 pt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              {hero.badgeText && (
                <p className="mb-4 inline-block rounded-full border border-[var(--lime)]/40 bg-[var(--lime)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--lime)]">
                  {hero.badgeText}
                </p>
              )}
              <h1 className="font-serif text-[clamp(3.5rem,14vw,9rem)] leading-[0.9] font-bold tracking-tight">
                <span className="block">{hero.headlineMain}</span>
                <span className="block text-[var(--lime)]">{hero.headlineSub}</span>
              </h1>
              <div className="mt-8">
                <CTAButton href={hero.ctaHref}>{hero.ctaText}</CTAButton>
              </div>
            </div>

            {hero.showFrame && (
              <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm lg:mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--lime)]">
                  Featured
                </p>
                <p className="mt-2 text-xl font-bold">{hero.microCardTitle}</p>
                <p className="mt-1 text-sm text-white/75">
                  {hero.microCardDescription}
                </p>
              </div>
            )}
          </div>

          {featuredProducts.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.slice(0, 3).map((product) => (
                <a
                  key={product.id}
                  href={product.ctaHref}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 no-underline transition hover:border-[var(--lime)]/40 hover:bg-white/10"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-16 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-white/65">
                      {product.shortDescription}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
