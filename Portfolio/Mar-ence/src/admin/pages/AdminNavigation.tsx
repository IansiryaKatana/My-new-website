import type { Database } from '#/integrations/supabase/database.types'
import { AdminListCrud } from '../AdminListCrud'

type Row = Database['public']['Tables']['navigation_items']['Row']

export function AdminNavigation() {
  return (
    <AdminListCrud<Row>
      title="Navigation"
      description="Header navigation links."
      table="navigation_items"
      orderBy="sort_order"
      defaultRow={() => ({
        id: crypto.randomUUID(),
        label: '',
        href: '#',
        sort_order: 0,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })}
      fields={[
        { key: 'label', label: 'Label', required: true },
        { key: 'href', label: 'Href', required: true },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
        { key: 'published', label: 'Published', type: 'checkbox' },
      ]}
      columns={[
        { key: 'label', label: 'Label' },
        { key: 'href', label: 'Href' },
        { key: 'sort_order', label: 'Order' },
      ]}
    />
  )
}
