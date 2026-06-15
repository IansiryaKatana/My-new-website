import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['metrics']['Row']

export const AdminMetrics = createEntityAdmin<Row>({
  title: 'Hero metrics',
  description: 'Stats shown in the hero glass card.',
  table: 'metrics',
  emptyRow: () => ({
    id: crypto.randomUUID(),
    value: '',
    label: '',
    sort_order: 0,
    published: true,
    featured: false,
  }),
  columns: [
    { key: 'value', label: 'Value' },
    { key: 'label', label: 'Label' },
    { key: 'featured', label: 'Featured' },
  ],
  validate: (d) => (!d.value?.trim() || !d.label?.trim() ? 'Value and label required' : null),
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Value</Label>
        <Input
          className="mt-1"
          value={draft.value ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
        />
      </div>
      <div>
        <Label>Label</Label>
        <Input
          className="mt-1"
          value={draft.label ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.featured ?? false}
          onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
        />
        Featured (large metric)
      </label>
    </div>
  ),
})
