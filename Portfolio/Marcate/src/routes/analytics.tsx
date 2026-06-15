import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/dashboard-layout'
import { EntityCrudPage } from '../components/entity-crud-page'
import { Card } from '../components/ui'
import { useAppState } from '../lib/app-state'
import { formatCurrency } from '../lib/utils'

export const Route = createFileRoute('/analytics')({ component: AnalyticsPage })

function AnalyticsPage() {
  const { orders, reports, setReports } = useAppState()
  const revenue = orders.reduce((sum, order) => sum + order.amount, 0)

  return (
    <DashboardLayout>
      <section className="mb-4 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Total Revenue</p>
          <p className="text-xl font-bold">{formatCurrency(revenue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Completed Orders</p>
          <p className="text-xl font-bold">{orders.filter((o) => o.status === 'completed').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-[var(--muted)]">Cancellation Rate</p>
          <p className="text-xl font-bold">
            {Math.round((orders.filter((o) => o.status === 'cancelled').length / Math.max(orders.length, 1)) * 100)}%
          </p>
        </Card>
      </section>
      <EntityCrudPage
        title="Saved Reports"
        items={reports}
        setItems={setReports}
        template={{ id: '', title: '', period: 'today', notes: '' }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'title', label: 'Title' },
          { key: 'period', label: 'Period' },
          { key: 'notes', label: 'Notes' },
        ]}
      />
    </DashboardLayout>
  )
}
