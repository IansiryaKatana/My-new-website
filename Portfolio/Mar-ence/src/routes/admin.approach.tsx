import { createFileRoute } from '@tanstack/react-router'
import { AdminSingletonSection } from '#/admin/pages/AdminSingletonSection'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminListCrud } from '#/admin/AdminListCrud'

type Item = Database['public']['Tables']['investment_approach_items']['Row']

function AdminApproachPage() {
  return (
    <div className="space-y-12">
      <AdminSingletonSection
        title="Investment approach header"
        description="Section intro above approach rows."
        table="investment_approach"
        emptyRow={() => ({
          id: crypto.randomUUID(),
          eyebrow: 'Process',
          title: 'Investment Approach',
          description: '',
          published: true,
        })}
        fields={[
          { key: 'eyebrow', label: 'Eyebrow' },
          { key: 'title', label: 'Title' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]}
      />
      <AdminListCrud<Item>
        title="Approach items"
        description="Public Markets, Private Equity, Real Assets rows."
        table="investment_approach_items"
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
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'sort_order', label: 'Sort order', type: 'number' },
        ]}
        columns={[
          { key: 'number', label: '#' },
          { key: 'title', label: 'Title' },
        ]}
      />
    </div>
  )
}

export const Route = createFileRoute('/admin/approach')({
  component: AdminApproachPage,
})
