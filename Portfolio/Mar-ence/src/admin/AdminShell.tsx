import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X, LogOut } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { cn } from '#/lib/utils'

const NAV = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/hero', label: 'Hero' },
  { to: '/admin/navigation', label: 'Navigation' },
  { to: '/admin/logos', label: 'Trusted Logos' },
  { to: '/admin/perspective', label: 'Perspective' },
  { to: '/admin/principles', label: 'Principles' },
  { to: '/admin/portfolio', label: 'Portfolio' },
  { to: '/admin/approach', label: 'Investment Approach' },
  { to: '/admin/cta', label: 'Final CTA' },
  { to: '/admin/footer', label: 'Footer' },
  { to: '/admin/submissions', label: 'Submissions' },
  { to: '/admin/site', label: 'Site Settings' },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { signOut, adminUser } = useAdminAuth()
  const role = adminUser?.role ?? 'editor'
  const filteredNav = NAV.filter(
    (item) => role !== 'viewer' || item.to === '/admin/submissions',
  )

  return (
    <div className="admin-root min-h-screen bg-[var(--admin-surface)] flex">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          'fixed md:sticky top-0 z-50 h-screen w-64 shrink-0 bg-[var(--admin-primary)] text-white flex flex-col transition-transform md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-semibold text-sm">Valence CMS</span>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {filteredNav.map((item) => {
            const active =
              item.exact ? pathname === item.to : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  active ? 'bg-white/15' : 'hover:bg-white/10 text-white/85',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/60 mb-2 truncate">
            {adminUser?.email}
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-white border-b flex items-center px-4 gap-4">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 ml-auto">
            View site →
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
