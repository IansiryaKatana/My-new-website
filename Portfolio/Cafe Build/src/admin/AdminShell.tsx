import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ChevronLeft,
  Image,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Navigation,
  Package,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { getSupabase } from '#/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { adminNavLink, adminNavLinkActive } from './adminClassNames'

interface AdminShellProps {
  children: ReactNode
}

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/benefits', label: 'Benefits', icon: Sparkles },
  { to: '/admin/nav', label: 'Navigation', icon: Navigation },
  { to: '/admin/sections', label: 'Landing Sections', icon: Layers },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/site', label: 'Site Settings', icon: Settings },
  { to: '/admin/users', label: 'Users', icon: Users, roles: ['owner', 'admin'] },
]

export function AdminShell({ children }: AdminShellProps) {
  const { user, signOut } = useAdminAuth()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<string>('editor')
  const [brandName, setBrandName] = useState('NGUNJUK')

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase || !user?.email) return

    void (async () => {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role')
        .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle()

      if (adminUser?.role) setRole(adminUser.role)

      const { data: brandSetting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'brand')
        .maybeSingle()

      const brand = brandSetting?.value as { name?: string } | null
      if (brand?.name) setBrandName(brand.name)
    })()
  }, [user])

  const visibleNav = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (!item.roles) return true
        return item.roles.includes(role)
      }),
    [role],
  )

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.to
    return pathname === item.to || pathname.startsWith(`${item.to}/`)
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface-elevated)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border)] px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--admin-primary)]">
            Admin CMS
          </p>
          <p className="text-lg font-bold text-[var(--admin-text)]">{brandName}</p>
        </div>
        <button
          type="button"
          className="md:hidden"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-[var(--admin-text-muted)]" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleNav.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(adminNavLink, active && adminNavLinkActive)}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[var(--admin-border)] p-4">
        <p className="truncate text-sm font-medium text-[var(--admin-text)]">{user?.email}</p>
        <p className="text-xs capitalize text-[var(--admin-text-muted)]">{role}</p>
        <button
          type="button"
          className="mt-3 flex w-full items-center gap-2 rounded-[var(--admin-radius)] px-3 py-2 text-sm text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-soft)]"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen md:grid md:grid-cols-[var(--admin-sidebar-width)_1fr]">
      <div className="hidden md:block">{sidebar}</div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close navigation overlay"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] shadow-[var(--admin-shadow)]">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] px-4 py-3 md:px-6">
          <button
            type="button"
            className="rounded-[var(--admin-radius)] p-2 md:hidden"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            to="/"
            className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to site
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
