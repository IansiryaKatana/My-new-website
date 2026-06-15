import { Link, useRouterState } from '@tanstack/react-router'
import {
  BarChart3,
  FolderKanban,
  Globe2,
  LayoutGrid,
  ListOrdered,
  LogOut,
  MapPin,
  Menu,
  Navigation,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { cn } from '#/lib/utils'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, roles: ['owner', 'admin', 'editor', 'viewer'] },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/sections', label: 'Section copy', icon: LayoutGrid, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/services', label: 'Services', icon: LayoutGrid, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/hero', label: 'Hero', icon: Sparkles, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/metrics', label: 'Metrics', icon: BarChart3, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/navigation', label: 'Navigation', icon: Navigation, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/process', label: 'Process', icon: ListOrdered, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/map', label: 'Global map', icon: MapPin, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/footer', label: 'Footer', icon: Globe2, roles: ['owner', 'admin', 'editor'] },
  { to: '/admin/submissions', label: 'Inbox', icon: FolderKanban, roles: ['owner', 'admin', 'editor', 'viewer'] },
  { to: '/admin/site', label: 'Site settings', icon: Settings, roles: ['owner', 'admin'] },
  { to: '/admin/users', label: 'Users', icon: Users, roles: ['owner', 'admin'] },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { signOut, adminUser } = useAdminAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [drawer, setDrawer] = useState(false)
  const role = adminUser?.role ?? 'viewer'

  const links = NAV.filter((n) => n.roles.includes(role as (typeof n.roles)[number]))

  return (
    <div className="admin-shell flex min-h-screen">
      <aside
        className={cn(
          'admin-sidebar fixed inset-y-0 left-0 z-40 flex flex-col p-4 transition-transform md:static md:translate-x-0',
          drawer ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link to="/admin" className="text-sm font-medium text-white">
            Marden CMS
          </Link>
          <button type="button" className="md:hidden text-white" onClick={() => setDrawer(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="admin-nav-link"
              data-active={pathname === item.to}
              onClick={() => setDrawer(false)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
          <p className="truncate text-[10px] text-white/60">{adminUser?.email}</p>
          <button
            type="button"
            className="admin-nav-link w-full"
            onClick={() => void signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <Link to="/" className="admin-nav-link text-white/70">
            View site
          </Link>
        </div>
      </aside>

      {drawer && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setDrawer(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <header className="flex h-12 items-center gap-3 border-b border-[var(--admin-border)] bg-white px-4 md:hidden">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">Admin</span>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
