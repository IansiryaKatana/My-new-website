import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import '@/admin/admin-theme.css'

const nav = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/properties', label: 'Properties' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/team', label: 'Team' },
  { to: '/admin/faqs', label: 'FAQs' },
  { to: '/admin/process', label: 'Process' },
  { to: '/admin/submissions', label: 'Inbox' },
  { to: '/admin/site', label: 'Site settings' },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { signOut, role } = useAdminAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)

  const filteredNav = nav.filter(
    (n) => role !== 'editor' || !['Site settings'].includes(n.label),
  )

  return (
    <div className="admin-shell flex min-h-screen">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[#d8d2c7] bg-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-[#d8d2c7] px-4">
          <span className="font-serif-accent text-xl">CMS</span>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-2">
          {filteredNav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm ${active ? 'admin-nav-active' : 'text-[#8b897f] hover:bg-[#f2eee7]'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#d8d2c7] p-4">
          <Link to="/" className="text-xs text-[#8b897f] hover:text-[#46482f]">
            View site
          </Link>
          <button
            type="button"
            className="mt-2 block text-xs uppercase tracking-wider text-[#8b897f]"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-[#d8d2c7] bg-white px-4 lg:px-8">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-xs uppercase tracking-[0.14em] text-[#8b897f]">
            Luxury R Admin · {role ?? 'guest'}
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
