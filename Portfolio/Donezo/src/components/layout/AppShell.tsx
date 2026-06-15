import type { ReactNode } from 'react'
import { Bell, Download, Mail, Menu, Search } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { generalNav, mainNav, type NavItem } from '@/components/dashboard/data'
import { cn } from '@/lib/utils'

type AppShellProps = {
  title: string
  subtitle: string
  actions?: ReactNode
  children: ReactNode
}

export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  return (
    <main className="min-h-dvh p-3 pb-24 sm:p-6 lg:p-0">
      <div className="animate-shell mx-auto grid min-h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-[24px] bg-donezo-shell shadow-shell lg:min-h-dvh lg:max-w-none lg:grid-cols-[230px_1fr] lg:rounded-none lg:shadow-none">
        <Sidebar />
        <section className="min-w-0 px-4 py-4 sm:px-5 lg:px-8 lg:py-7 xl:px-10">
          <TopBar />
          <PageHeader title={title} subtitle={subtitle} actions={actions} />
          {children}
        </section>
      </div>
      <MobileNav />
    </main>
  )
}

function Sidebar() {
  return (
    <aside className="reveal-left hidden bg-[#f7f8f6] px-7 py-8 lg:flex lg:flex-col">
      <BrandLogo className="mb-10" />
      <SidebarSection label="Menu" items={mainNav} />
      <SidebarSection label="General" items={generalNav} className="mt-8" />
      <MobilePromoCard />
    </aside>
  )
}

function BrandLogo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)} aria-label="Marcian dashboard">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-donezo-green text-white shadow-[0_8px_18px_rgba(0,92,53,0.22)]">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-white after:mx-auto after:mt-[3px] after:block after:h-1 after:w-1 after:rounded-full after:bg-white" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em]">Marcian</span>
    </Link>
  )
}

function SidebarSection({
  label,
  items,
  className,
}: {
  label: string
  items: NavItem[]
  className?: string
}) {
  return (
    <nav className={className} aria-label={label}>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-donezo-muted">
        {label}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </div>
    </nav>
  )
}

function SidebarItem({ item }: { item: NavItem }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const active = pathname === item.to
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex h-10 items-center gap-3 rounded-xl px-2 text-[13px] font-medium text-donezo-muted transition-colors hover:bg-donezo-pale hover:text-donezo-ink',
        active && 'text-donezo-ink',
      )}
    >
      {active ? <span className="absolute -left-7 h-7 w-[5px] rounded-full bg-donezo-accent" /> : null}
      <Icon className="h-4 w-4" strokeWidth={1.9} />
      <span>{item.label}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full bg-donezo-pale px-1.5 py-0.5 text-[9px] font-semibold text-donezo-green">
          {item.badge}
        </span>
      ) : null}
    </Link>
  )
}

function MobilePromoCard() {
  return (
    <Card className="dark-pattern mt-auto min-h-[124px] rounded-[14px] p-3.5 text-white shadow-none">
      <p className="max-w-[90px] text-[13px] font-semibold leading-tight">
        Download our Mobile App
      </p>
      <p className="mt-1 text-[10px] text-white/60">Get easy in another way</p>
      <Button className="mt-4 h-8 w-full text-[10px]" size="sm">
        <Download className="h-3 w-3" />
        Download
      </Button>
    </Card>
  )
}

function TopBar() {
  return (
    <header className="reveal-up flex flex-col gap-3 [animation-delay:60ms] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 lg:hidden">
        <Button variant="ghost" size="icon" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
        <BrandLogo />
      </div>
      <form className="relative w-full sm:max-w-[390px]" role="search">
        <label className="sr-only" htmlFor="workspace-search">
          Search task
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-donezo-muted" />
        <Input id="workspace-search" placeholder="Search task" className="pl-11 pr-20" />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#f0f2f0] px-2 py-1 text-[10px] font-semibold text-donezo-muted">
          Cmd F
        </kbd>
      </form>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Open mail">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Open notifications">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/60 p-1 pr-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#f8c9a8] to-[#d9784d] text-xs font-bold text-white shadow-[0_8px_18px_rgba(217,120,77,0.22)]">
            MT
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-[13px] font-semibold">Marcel Thoya</p>
            <p className="text-[10px] text-donezo-muted">MarcelThoya@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}

function PageHeader({ title, subtitle, actions }: Omit<AppShellProps, 'children'>) {
  return (
    <section className="reveal-up mt-6 flex flex-col gap-4 [animation-delay:120ms] sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[30px] font-bold leading-none tracking-[-0.04em] text-donezo-ink">
          {title}
        </h1>
        <p className="mt-2 text-xs text-donezo-muted">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-col gap-2 xs:flex-row sm:flex-row">{actions}</div> : null}
    </section>
  )
}

function MobileNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 gap-1 rounded-[24px] border border-white/70 bg-white/90 p-2 shadow-card backdrop-blur lg:hidden"
      aria-label="Mobile navigation"
    >
      {mainNav.map((item) => {
        const Icon = item.icon
        const active = pathname === item.to

        return (
          <Link
            key={item.label}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold text-donezo-muted',
              active && 'bg-donezo-pale text-donezo-green',
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
