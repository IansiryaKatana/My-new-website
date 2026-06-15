import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/dashboard-layout'
import { EntityCrudPage } from '../components/entity-crud-page'
import { useAppState } from '../lib/app-state'

export const Route = createFileRoute('/inventory')({ component: InventoryPage })

function InventoryPage() {
  const { inventory, setInventory } = useAppState()
  return (
    <DashboardLayout>
      <EntityCrudPage
        title="Inventory"
        items={inventory}
        setItems={setInventory}
        template={{ id: '', name: '', stock: 0, unit: '', minStock: 0 }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'stock', label: 'Stock' },
          { key: 'unit', label: 'Unit' },
          { key: 'minStock', label: 'Min Stock' },
        ]}
      />
    </DashboardLayout>
  )
}
