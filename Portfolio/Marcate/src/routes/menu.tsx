import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/dashboard-layout'
import { EntityCrudPage } from '../components/entity-crud-page'
import { useAppState } from '../lib/app-state'

export const Route = createFileRoute('/menu')({ component: MenuPage })

function MenuPage() {
  const { menu, setMenu } = useAppState()
  return (
    <DashboardLayout>
      <EntityCrudPage
        title="Menu"
        items={menu}
        setItems={setMenu}
        template={{ id: '', name: '', category: '', price: 0, available: true }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price' },
          { key: 'available', label: 'Available' },
        ]}
      />
    </DashboardLayout>
  )
}
