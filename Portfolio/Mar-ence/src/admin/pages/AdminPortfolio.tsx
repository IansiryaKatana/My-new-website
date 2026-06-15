import type { Database } from '#/integrations/supabase/database.types'
import { AdminListCrud } from '../AdminListCrud'

type Row = Database['public']['Tables']['portfolio_projects']['Row']

export function AdminPortfolio() {
  return (
    <AdminListCrud<Row>
      title="Portfolio projects"
      description="Selected work list and featured project imagery."
      table="portfolio_projects"
      slugField="slug"
      defaultRow={() => ({
        id: crypto.randomUUID(),
        name: '',
        slug: '',
        description: '',
        image_large_url: '',
        image_side_url: '',
        project_url: '#',
        is_featured: false,
        sort_order: 0,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'slug', label: 'Slug', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image_large_url', label: 'Large image URL' },
        { key: 'image_side_url', label: 'Side image URL' },
        { key: 'project_url', label: 'Project URL' },
        { key: 'is_featured', label: 'Featured', type: 'checkbox' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
        { key: 'published', label: 'Published', type: 'checkbox' },
      ]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'is_featured', label: 'Featured' },
      ]}
    />
  )
}
