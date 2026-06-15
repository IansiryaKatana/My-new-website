import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/dashboard-layout'
import { EntityCrudPage } from '../components/entity-crud-page'
import { useAppState } from '../lib/app-state'

export const Route = createFileRoute('/customers')({ component: CustomersPage })

function CustomersPage() {
  const { customers, setCustomers } = useAppState()
  return (
    <DashboardLayout>
      <EntityCrudPage
        title="Customers"
        items={customers}
        setItems={setCustomers}
        template={{ id: '', name: '', phone: '', totalOrders: 0, loyaltyTier: 'bronze' }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'totalOrders', label: 'Orders' },
          { key: 'loyaltyTier', label: 'Loyalty Tier' },
        ]}
      />
    </DashboardLayout>
  )
}
