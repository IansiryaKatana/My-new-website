import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/dashboard-layout'
import { EntityCrudPage } from '../components/entity-crud-page'
import { useAppState } from '../lib/app-state'

export const Route = createFileRoute('/tables')({ component: TablesPage })

function TablesPage() {
  const { tables, setTables } = useAppState()
  return (
    <DashboardLayout>
      <EntityCrudPage
        title="Tables"
        items={tables}
        setItems={setTables}
        template={{ id: '', name: '', seats: 0, status: 'available' }}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Table Name' },
          { key: 'seats', label: 'Seats' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </DashboardLayout>
  )
}
