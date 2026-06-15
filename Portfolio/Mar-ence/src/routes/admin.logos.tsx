import { createFileRoute } from '@tanstack/react-router'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminListCrud } from '#/admin/AdminListCrud'
import { AdminSingletonSection } from '#/admin/pages/AdminSingletonSection'

type Logo = Database['public']['Tables']['trusted_logos']['Row']

function AdminLogosPage() {
  return (
    <div className="space-y-12">
      <AdminSingletonSection
        title="Logo strip label"
        description="Trusted by Industry Leaders heading."
        table="logo_strip"
        emptyRow={() => ({
          id: crypto.randomUUID(),
          label: 'Trusted by Industry Leaders',
          published: true,
        })}
        fields={[{ key: 'label', label: 'Label' }]}
      />
      <AdminListCrud<Logo>
        title="Trusted logos"
        description="Partner logos (text or image URL)."
        table="trusted_logos"
        defaultRow={() => ({
          id: crypto.randomUUID(),
          name: '',
          image_url: '',
          alt_text: '',
          sort_order: 0,
          published: true,
          created_at: new Date().toISOString(),
        })}
        fields={[
          { key: 'name', label: 'Name', required: true },
          { key: 'image_url', label: 'Image URL' },
          { key: 'alt_text', label: 'Alt text' },
          { key: 'sort_order', label: 'Sort order', type: 'number' },
        ]}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'sort_order', label: 'Order' },
        ]}
      />
    </div>
  )
}

export const Route = createFileRoute('/admin/logos')({
  component: AdminLogosPage,
})
