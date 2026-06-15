import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { canManageUsers, useAdminAuth } from '../contexts/AdminAuthContext'
import { adminBtn, adminBtnDanger } from './adminClassNames'
import { AdminConfirmDialog } from './components/AdminConfirmDialog'

const NAV = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/site', label: 'Site' },
  { to: '/admin/hero', label: 'Hero' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/marketing', label: 'Marketing' },
  { to: '/admin/media', label: 'Media' },
  { to: '/admin/submissions', label: 'Inbox' },
  { to: '/admin/users', label: 'Users', ownerOnly: true },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const { signOut, adminUser } = useAdminAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  const items = NAV.filter(
    (item) => !('ownerOnly' in item && item.ownerOnly) || canManageUsers(adminUser?.role),
  )

  return (
    <div className="admin-root flex h-screen overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-[var(--admin-cream)]/15 bg-[var(--admin-surface)] p-4 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <Link to="/admin" className="font-display text-xl font-black uppercase">
            CMS
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-hidden">
          <div className="grid gap-1">
            {items.map((item) => {
              const active =
                'exact' in item && item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to) && item.to !== '/admin'
                    ? true
                    : pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 font-display text-sm font-black uppercase tracking-[0.08em] ${active ? 'bg-[var(--admin-primary)] text-[var(--admin-cream)]' : 'text-[var(--admin-cream)]/75 hover:bg-[var(--admin-cream)]/10'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="mt-auto shrink-0 border-t border-[var(--admin-cream)]/15 pt-4">
          <p className="truncate font-sans text-xs text-[var(--admin-cream)]/60">
            {adminUser?.email ?? 'Admin'}
          </p>
          <p className="font-display text-xs uppercase text-[var(--admin-cream)]/45">
            {adminUser?.role}
          </p>
          <div className="mt-4 grid gap-2">
            <Link to="/" className={adminBtn}>
              View site
            </Link>
            <button type="button" className={adminBtnDanger} onClick={() => setSignOutOpen(true)}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-20 flex shrink-0 items-center gap-3 border-b border-[var(--admin-cream)]/10 bg-[var(--admin-dark)] px-4 py-3 lg:px-8">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm uppercase tracking-[0.2em] text-[var(--admin-cream)]/50">
            Portfolio admin
          </span>
        </header>
        <main className="admin-content min-h-0 flex-1 overflow-y-auto overflow-x-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      <AdminConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="Sign out?"
        description="You will need to sign in again to access the admin."
        confirmLabel="Sign out"
        onConfirm={async () => {
          setSignOutOpen(false)
          await signOut()
        }}
      />
    </div>
  )
}
