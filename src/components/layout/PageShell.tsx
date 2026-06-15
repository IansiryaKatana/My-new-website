import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { textCopyLg } from '../../lib/typography'
import { cn } from '../../lib/utils'
import { SiteFooter } from './SiteFooter'
import { SiteNavigation } from './SiteNavigation'
import { pageThemes, type PageThemeName } from './page-themes'

type PageShellProps = {
  children: ReactNode
  eyebrow: string
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  theme?: PageThemeName
}

export function PageShell({
  children,
  eyebrow,
  title,
  description,
  backTo = '/',
  backLabel = 'Back home',
  theme = 'dark',
}: PageShellProps) {
  const colors = pageThemes[theme]
  const showBack = backTo !== '/' || backLabel !== 'Back home'

  return (
    <div className={cn('min-h-screen', colors.pageBg, colors.pageText)}>
      <SiteNavigation theme={colors} />

      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {showBack ? (
            <Link
              to={backTo}
              className={cn(
                'group mb-6 inline-flex items-center gap-2 font-display text-xs font-black uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
                colors.eyebrow,
                colors.navOutline,
                colors.navHover,
              )}
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                ←
              </span>
              {backLabel}
            </Link>
          ) : null}
          <p
            className={cn(
              'font-display text-sm uppercase tracking-[0.2em]',
              colors.eyebrow,
            )}
          >
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.85] sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                'mt-6 max-w-3xl',
                textCopyLg,
                colors.description,
              )}
            >
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
