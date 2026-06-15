import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/dashboard-layout'
import { Card } from '../components/ui'
import { useAppState } from '../lib/app-state'
import { formatCurrency } from '../lib/utils'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { orders, menu, customers, inventory } = useAppState()
  return (
    <DashboardLayout>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Orders</p>
          <p className="mt-1 text-xl font-bold">{orders.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Revenue</p>
          <p className="mt-1 text-xl font-bold">{formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Menu Items</p>
          <p className="mt-1 text-xl font-bold">{menu.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Customers</p>
          <p className="mt-1 text-xl font-bold">{customers.length}</p>
        </Card>
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-base font-semibold">Operational Snapshot</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>In inventory: {inventory.length} tracked materials.</li>
            <li>Pending orders: {orders.filter((o) => o.status === 'in_progress').length} active orders.</li>
            <li>Ready for dispatch: {orders.filter((o) => o.status === 'ready').length} orders.</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h2 className="text-base font-semibold">Live Data Notes</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            This build is wired with full frontend CRUD and Supabase client configuration points. Add
            `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to connect directly to your live project.
          </p>
        </Card>
      </section>
    </DashboardLayout>
  )
}
