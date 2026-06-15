import * as Dialog from '@radix-ui/react-dialog'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'

import { useHeroContent, useSiteConfig } from '../../contexts/CmsContext'
import { Button } from '../ui/button'

export function HeroNavigation() {
  const heroContent = useHeroContent()
  const siteConfig = useSiteConfig()

  return (
    <header className="hero-nav absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-6 pt-6 text-[#D8D7C3] sm:px-8 sm:pt-7">
      <Link
        to={heroContent.startProject.href}
        className="group font-display text-sm font-black uppercase underline decoration-[#D8D7C3]/80 underline-offset-4 transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8D7C3]"
      >
        {heroContent.startProject.label}
        <span
          aria-hidden="true"
          className="inline-block pl-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </Link>

      <Link
        to="/"
        className="absolute left-1/2 top-6 -translate-x-1/2 font-display text-xl font-black uppercase leading-none tracking-[-0.02em] transition-colors hover:text-white sm:top-7"
      >
        {heroContent.name}
      </Link>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="group grid h-9 w-9 grid-cols-2 place-items-center gap-1 transition-transform duration-300 hover:rotate-[5deg] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8D7C3]"
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
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-[#34392E] p-6 text-[#D8D7C3] data-[state=open]:animate-in data-[state=closed]:animate-out sm:p-8">
            <div className="flex items-center justify-between">
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

            <Dialog.Description className="mt-10 max-w-md font-display text-sm font-bold uppercase leading-tight tracking-[0.12em] text-[#D8D7C3]/80">
              Navigate the portfolio identity page or jump straight into a
              project inquiry.
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

            <div className="mt-auto flex flex-col gap-4 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <Dialog.Close asChild>
                <Button type="button" variant="light">
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

