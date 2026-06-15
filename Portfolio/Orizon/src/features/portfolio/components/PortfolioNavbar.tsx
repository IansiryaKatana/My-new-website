import { Link } from '@tanstack/react-router'
import { Bell, Gift, Menu, Plus, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Spending', href: '#spending' },
  { label: 'Portfolio', href: '/portfolio', active: true, isRoute: true },
  { label: 'Invest', href: '#invest' },
  { label: 'Advice', href: '#advice' },
  { label: 'Estate planning', href: '#estate-planning' },
]

export function PortfolioNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-11 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex min-w-0 items-center gap-2 text-white">
          <div className="flex size-7 items-center justify-center rounded-full border border-white/30 bg-white/10">
            <div className="size-3 rounded-full border border-white/80" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Orizon</span>
        </div>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) =>
            item.isRoute ? (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'relative text-[13px] text-white/70 transition hover:-translate-y-px hover:text-white',
                  item.active &&
                    'text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-white/90',
                )}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'relative text-[13px] text-white/70 no-underline transition hover:-translate-y-px hover:text-white',
                  item.active &&
                    'text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-white/90',
                )}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="pillWhite" size="sm" className="hidden sm:inline-flex">
            <Gift className="size-3.5" />
            Get $25
          </Button>
          <Button variant="pill" size="sm" className="hidden md:inline-flex">
            <Plus className="size-3.5" />
            Account
          </Button>
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex size-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Bell className="size-4" strokeWidth={1.7} />
          </button>
          <Avatar className="size-8 border border-white/20">
            <AvatarImage src="https://i.pravatar.cc/80?u=orizon-user" alt="User avatar" />
            <AvatarFallback>OR</AvatarFallback>
          </Avatar>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex size-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white xl:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-4" strokeWidth={1.7} />
            ) : (
              <Menu className="size-4" strokeWidth={1.7} />
            )}
          </button>
        </div>
      </motion.header>

      {mobileOpen ? (
        <div className="border-t border-white/10 px-4 py-3 xl:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm text-white/80 no-underline transition hover:bg-white/10',
                    item.active && 'bg-white/12 text-white',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-white/80 no-underline transition hover:bg-white/10"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </>
  )
}
