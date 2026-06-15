import type { Database } from '#/integrations/supabase/database.types'
import { AdminListCrud } from '../AdminListCrud'

type Row = Database['public']['Tables']['principles']['Row']

export function AdminPrinciples() {
  return (
    <AdminListCrud<Row>
      title="Principles"
      description="Three-column principles section."
      table="principles"
      defaultRow={() => ({
        id: crypto.randomUUID(),
        number: '01',
        title: '',
        description: '',
        sort_order: 0,
        published: true,
        created_at: new Date().toISOString(),
      })}
      fields={[
        { key: 'number', label: 'Number', required: true },
        { key: 'title', label: 'Title', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
        { key: 'published', label: 'Published', type: 'checkbox' },
      ]}
      columns={[
        { key: 'number', label: '#' },
        { key: 'title', label: 'Title' },
        { key: 'sort_order', label: 'Order' },
      ]}
    />
  )
}
