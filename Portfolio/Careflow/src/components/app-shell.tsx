import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Bell, Search, Stethoscope } from 'lucide-react'
import { publicAsset } from '../../../demo-assets'
import { careFlowRoutes } from '../lib/navigation'

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsCleared, setNotificationsCleared] = useState(false)
  const searchResults = careFlowRoutes.filter((route) =>
    route.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  )
  const visibleSearchResults = searchQuery.trim() ? searchResults : careFlowRoutes

  return (
    <div className="min-h-dvh bg-care-bg text-care-ink">
      <div className="grid min-h-dvh grid-rows-[auto_1fr]">
        <header className="sticky top-0 z-40 border-b border-white/35 bg-care-bg/92 px-3 py-3 backdrop-blur-xl sm:px-5 lg:px-7">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Open CareFlow dashboard"
              className="flex items-center gap-3 rounded-2xl bg-white/78 p-1.5 pr-4 shadow-[0_10px_30px_rgb(26_40_32/0.08)] outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-care-ink/25"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-care-green">
                <Stethoscope className="size-5" aria-hidden />
              </span>
              <span className="text-base font-bold tracking-[-0.04em]">
                CareFlow
              </span>
            </Link>

            <nav
              aria-label="Primary navigation"
              className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            >
              {careFlowRoutes.map((route) => (
                <Link
                  key={route.to}
                  to={route.to}
                  activeOptions={{ exact: route.to === '/' }}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-care-ink/76 outline-none transition hover:bg-white/72 focus-visible:ring-2 focus-visible:ring-care-ink/25"
                  activeProps={{
                    className:
                      'bg-care-green text-care-ink shadow-[0_8px_18px_rgb(30_48_38/0.08)]',
                  }}
                >
                  <route.icon className="size-4" aria-hidden />
                  {route.label}
                </Link>
              ))}
            </nav>

            <form
              className="relative ml-auto hidden min-w-[260px] md:block"
              onSubmit={(event) => {
                event.preventDefault()
                const target = visibleSearchResults[0] ?? careFlowRoutes[0]
                setSearchFocused(false)
                navigate({ to: target.to })
              }}
            >
              <label className="flex items-center gap-2 rounded-2xl bg-white/72 px-3 py-2 text-care-muted transition-all duration-200 hover:bg-white hover:shadow-[0_10px_28px_rgb(31_47_37/0.1)] focus-within:bg-white focus-within:ring-2 focus-within:ring-care-ink/15">
              <Search className="size-4" aria-hidden />
                <span className="sr-only">Search care activity</span>
                <input
                  value={searchQuery}
                  onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search care activity"
                  className="w-full bg-transparent text-sm text-care-ink outline-none placeholder:text-care-muted"
                />
              </label>
              {searchFocused && (
                <div className="absolute right-0 top-12 z-50 w-full rounded-2xl border border-care-line bg-white p-1 shadow-[0_18px_55px_rgb(31_47_37/0.18)]">
                  {visibleSearchResults.length > 0 ? (
                    visibleSearchResults.map((route) => (
                      <Link
                        key={route.to}
                        to={route.to}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-care-green-soft"
                        onClick={() => {
                          setSearchFocused(false)
                          setSearchQuery('')
                        }}
                      >
                        <route.icon className="size-4" aria-hidden />
                        {route.label}
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-care-muted">
                      No module found.
                    </p>
                  )}
                </div>
              )}
            </form>

            <div className="relative">
              <button
                type="button"
                aria-expanded={notificationsOpen}
                aria-label="Open notifications"
                className="relative flex size-11 items-center justify-center rounded-2xl bg-white/72 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_28px_rgb(31_47_37/0.12)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-care-ink/25"
                onClick={() => setNotificationsOpen((current) => !current)}
              >
                <Bell className="size-4" aria-hidden />
                {!notificationsCleared && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-care-danger" />
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-13 z-50 w-80 rounded-3xl border border-care-line bg-white p-3 shadow-[0_18px_55px_rgb(31_47_37/0.18)]">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-bold">Care notifications</p>
                    <button
                      type="button"
                      className="rounded-full px-2 py-1 text-xs font-semibold text-care-muted transition hover:bg-care-green-soft hover:text-care-ink"
                      onClick={() => setNotificationsCleared(true)}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid gap-2">
                    {(notificationsCleared
                      ? ['No new notifications.']
                      : [
                          'Dermatology review is scheduled for Oct 20.',
                          'Glucose trend remains within target range.',
                          'Pro plan upgrade is available for priority care.',
                        ]
                    ).map((notification) => (
                      <p
                        key={notification}
                        className="rounded-2xl bg-care-green-soft px-3 py-2 text-sm text-care-ink/75"
                      >
                        {notification}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/78 p-1.5 pr-3 transition-all duration-200 hover:bg-white hover:shadow-[0_10px_28px_rgb(31_47_37/0.1)]">
              <img
                src={publicAsset('hero.png')}
                alt="Geoffrey Kingi profile"
                className="size-9 rounded-full object-cover"
              />
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold">Geoffrey Kingi</p>
                <p className="text-[11px] text-care-muted">Patient portal</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 lg:grid-cols-[88px_1fr]">
          <aside className="hidden border-r border-white/35 bg-care-bg/70 p-3 lg:block">
            <nav
              aria-label="Section navigation"
              className="sticky top-[88px] grid gap-2"
            >
              {careFlowRoutes.map((route) => (
                <Link
                  key={route.to}
                  to={route.to}
                  activeOptions={{ exact: route.to === '/' }}
                  aria-label={route.label}
                  className="flex size-14 items-center justify-center rounded-2xl bg-white/40 text-care-ink/70 outline-none transition hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-care-ink/25"
                  activeProps={{ className: 'bg-care-green text-care-ink' }}
                >
                  <route.icon className="size-5" aria-hidden />
                </Link>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 p-3 pb-24 sm:p-5 lg:p-7">
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-3xl bg-white/94 p-1.5 shadow-[0_18px_50px_rgb(31_47_37/0.2)] backdrop-blur lg:hidden"
      >
        {careFlowRoutes.map((route) => (
          <Link
            key={route.to}
            to={route.to}
            activeOptions={{ exact: route.to === '/' }}
            className="flex h-13 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-semibold text-care-muted outline-none transition focus-visible:ring-2 focus-visible:ring-care-ink/25"
            activeProps={{ className: 'bg-care-green text-care-ink' }}
          >
            <route.icon className="size-4" aria-hidden />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
