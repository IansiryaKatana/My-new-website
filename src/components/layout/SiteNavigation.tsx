import * as Dialog from '@radix-ui/react-dialog'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useCallback, useState, type UIEvent } from 'react'

import { useHeroContent, useSiteConfig } from '../../contexts/CmsContext'
import { useInquiry } from '../../contexts/InquiryContext'
import { isInquiryHref } from '../../lib/inquiry/types'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import type { PageTheme } from './page-themes'

type SiteNavigationProps = {
  theme: PageTheme
}

export function SiteNavigation({ theme }: SiteNavigationProps) {
  const heroContent = useHeroContent()
  const siteConfig = useSiteConfig()
  const { openInquiry } = useInquiry()
  const [menuScrollProgress, setMenuScrollProgress] = useState(0)

  const handleMenuScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget
    const maxScroll = node.scrollHeight - node.clientHeight
    if (maxScroll <= 0) {
      setMenuScrollProgress(0)
      return
    }
    setMenuScrollProgress((node.scrollTop / maxScroll) * 100)
  }, [])

  return (
    <header
      className={cn(
        'site-nav sticky top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-6 py-5 sm:px-8 sm:py-6',
        theme.navBg,
        theme.navText,
        theme.borderSubtle,
      )}
    >
      {isInquiryHref(heroContent.startProject.href) ? (
        <button
          type="button"
          className={cn(
            'justify-self-start group inline-flex items-center font-display text-sm font-black uppercase underline underline-offset-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
            theme.navText,
            theme.navDecoration,
            theme.navOutline,
            theme.navHover,
          )}
          onClick={() => openInquiry({ source: 'site-nav' })}
        >
          {heroContent.startProject.label}
          <span
            aria-hidden="true"
            className="inline-block pl-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </button>
      ) : (
        <Link
          to={heroContent.startProject.href}
          className={cn(
            'justify-self-start group inline-flex items-center font-display text-sm font-black uppercase underline underline-offset-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
            theme.navDecoration,
            theme.navOutline,
            theme.navHover,
          )}
        >
          {heroContent.startProject.label}
          <span
            aria-hidden="true"
            className="inline-block pl-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </Link>
      )}

      <Link
        to="/"
        className={cn(
          'justify-self-center font-display text-xl font-black uppercase leading-none tracking-[-0.02em] transition-colors',
          theme.navHover,
        )}
      >
        {heroContent.name}
      </Link>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className={cn(
              'justify-self-end group grid h-9 w-9 grid-cols-2 place-items-center gap-1 transition-transform duration-300 hover:rotate-[5deg] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
              theme.navOutline,
            )}
            aria-label="Open site navigation"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <span
                className="h-1.5 w-1.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-125"
                aria-hidden="true"
                key={index}
              />
            ))}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-[#10140D]/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#34392E] text-[#D8D7C3] data-[state=open]:animate-in data-[state=closed]:animate-out">
            <div aria-hidden className="h-1 w-full bg-[#D8D7C3]/15">
              <div
                className="h-full bg-[#E98A15] transition-[width] duration-150"
                style={{ width: `${menuScrollProgress}%` }}
              />
            </div>
            <div className="flex shrink-0 items-center justify-between p-6 sm:p-8">
              <Dialog.Title className="font-display text-xl font-black uppercase">
                {heroContent.name}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#D8D7C3] text-[#D8D7C3] transition-[color,background-color] duration-300 hover:bg-[#D8D7C3] hover:text-[#11140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8D7C3]"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div
              className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 sm:px-8 sm:pb-8"
              onScroll={handleMenuScroll}
            >
              <Dialog.Description className="max-w-md font-display text-sm font-bold uppercase leading-tight tracking-[0.12em] text-[#D8D7C3]/80">
                Navigate the portfolio identity page or jump straight into a project
                inquiry.
              </Dialog.Description>

              <nav className="mt-12 grid gap-3">
                {heroContent.navigation.map((item) => (
                  <Dialog.Close asChild key={item.href}>
                    <Link
                      to={item.href}
                      className="group flex items-center justify-between border-b border-[#D8D7C3]/35 py-4 font-display text-5xl font-black uppercase leading-[0.85] tracking-[-0.04em] transition-colors hover:text-white sm:text-7xl"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </Link>
                  </Dialog.Close>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 flex-col gap-4 border-t border-[#D8D7C3]/15 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="light"
                  className="border-[#C62828] bg-[#C62828] text-[#D8D7C3] hover:border-[#A61E1E] hover:bg-[#A61E1E] hover:text-[#F5F0E8]"
                >
                  Close menu
                </Button>
              </Dialog.Close>
              <a
                href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
                className="font-display text-sm font-black uppercase underline underline-offset-4"
              >
                {siteConfig.email}
              </a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  )
}
