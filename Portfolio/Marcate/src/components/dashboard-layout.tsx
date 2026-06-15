import { Link } from '@tanstack/react-router'
import { Bell, ChartColumn, ClipboardList, CookingPot, LayoutDashboard, Package, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAppState } from '../lib/app-state'
import { formatCurrency } from '../lib/utils'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/menu', label: 'Menu', icon: CookingPot },
  { to: '/tables', label: 'Tables', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { orders } = useAppState()
  const pending = orders.filter((o) => o.status === 'in_progress').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

  return (
    <div>
      <header className="dashboard-top px-4 pb-4 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-xl font-bold">Marcate</div>
            <div className="flex items-center gap-2">
              <Bell className="size-4" />
              <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold">MR</span>
            </div>
          </div>
          <nav className="mb-6 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs text-white/80 hover:bg-white/15"
                activeProps={{ className: 'inline-flex items-center gap-1 rounded-md bg-emerald-500 px-3 py-2 text-xs text-white' }}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Metric title="Total Orders" value={orders.length.toLocaleString()} subtitle="Live count" />
            <Metric title="Today's Revenue" value={formatCurrency(totalRevenue)} subtitle="Current day total" />
            <Metric title="Avg. Order Value" value={formatCurrency(totalRevenue / Math.max(orders.length, 1))} subtitle="Rolling average" />
            <Metric title="Pending Orders" value={pending.toString()} subtitle="Need attention" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-4">{children}</main>
    </div>
  )
}

function Metric({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <article className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs text-white/80">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-white/70">{subtitle}</p>
    </article>
  )
}
