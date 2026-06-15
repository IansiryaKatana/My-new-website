import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useSiteConfig } from '../../contexts/CmsContext'
import { SiteFooter } from './SiteFooter'

type PageShellProps = {
  children: ReactNode
  eyebrow: string
  title: string
  description?: string
  backTo?: string
  backLabel?: string
}

export function PageShell({
  children,
  eyebrow,
  title,
  description,
  backTo = '/',
  backLabel = 'Back home',
}: PageShellProps) {
  const siteConfig = useSiteConfig()

  return (
    <div className="min-h-screen bg-[#10140D] text-[#D8D7C3]">
      <header className="border-b border-[#D8D7C3]/10 px-6 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-6">
          <Link
            to="/"
            className="font-display text-xl font-black uppercase tracking-[-0.02em] transition-colors hover:text-white"
          >
            {siteConfig.name}
          </Link>

          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Primary"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="font-display text-xs font-black uppercase tracking-[0.12em] text-[#D8D7C3]/80 transition-colors hover:text-white"
                activeProps={{
                  className: 'text-white underline underline-offset-4',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to={backTo}
            className="group ml-auto inline-flex shrink-0 items-center gap-2 font-display text-xs font-black uppercase tracking-[0.12em] text-[#D8D7C3] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8D7C3]"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
            {backLabel}
          </Link>
        </div>

        <nav
          className="mx-auto mt-6 flex max-w-6xl gap-4 overflow-x-auto pb-1 md:hidden"
          aria-label="Mobile primary"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="shrink-0 font-display text-xs font-black uppercase tracking-[0.12em] text-[#D8D7C3]/80 transition-colors hover:text-white"
              activeProps={{ className: 'text-white underline underline-offset-4' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-[#D8D7C3]/70">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.85] sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#D8D7C3]/80 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </section>

      <div className="px-6 pb-20 sm:px-10 lg:px-16">{children}</div>
      <SiteFooter />
    </div>
  )
}

