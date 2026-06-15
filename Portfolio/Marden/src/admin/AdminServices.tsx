import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { SLUG_REGEX, slugify } from '#/lib/utils'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['services']['Row']

export const AdminServices = createEntityAdmin<Row>({
  title: 'Services',
  description: 'Core service tags in the capabilities card.',
  table: 'services',
  emptyRow: () => ({
    id: crypto.randomUUID(),
    name: '',
    slug: '',
    active: false,
    sort_order: 0,
    published: true,
  }),
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'active', label: 'Active' },
    { key: 'sort_order', label: 'Order' },
  ],
  validate: (d) => {
    if (!d.name?.trim()) return 'Name is required.'
    const slug = d.slug?.trim() || slugify(d.name)
    if (!SLUG_REGEX.test(slug)) return 'Invalid slug.'
    return null
  },
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          className="mt-1"
          value={draft.name ?? ''}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              name: e.target.value,
              slug: d.slug || slugify(e.target.value),
            }))
          }
        />
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          className="mt-1"
          value={draft.slug ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.active ?? false}
          onChange={(e) => setDraft((d) => ({ ...d, active: e.target.checked }))}
        />
        Active (highlighted on site)
      </label>
    </div>
  ),
})
