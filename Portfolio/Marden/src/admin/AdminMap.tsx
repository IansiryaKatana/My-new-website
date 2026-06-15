import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['map_locations']['Row']

export const AdminMap = createEntityAdmin<Row>({
  title: 'Map locations',
  description: 'Global impact map markers (x/y as %).',
  table: 'map_locations',
  emptyRow: () => ({
    id: crypto.randomUUID(),
    country: '',
    x_percent: 50,
    y_percent: 50,
    status: 'inactive',
    sort_order: 0,
    published: true,
  }),
  columns: [
    { key: 'country', label: 'Country' },
    { key: 'status', label: 'Status' },
    { key: 'x_percent', label: 'X %' },
    { key: 'y_percent', label: 'Y %' },
  ],
  validate: (d) => (!d.country?.trim() ? 'Country required' : null),
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Country</Label>
        <Input
          className="mt-1"
          value={draft.country ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>X %</Label>
          <Input
            type="number"
            className="mt-1"
            value={draft.x_percent ?? 50}
            onChange={(e) => setDraft((d) => ({ ...d, x_percent: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label>Y %</Label>
          <Input
            type="number"
            className="mt-1"
            value={draft.y_percent ?? 50}
            onChange={(e) => setDraft((d) => ({ ...d, y_percent: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div>
        <Label>Status</Label>
        <select
          className="mt-1 flex h-9 w-full rounded border px-2 text-sm"
          value={draft.status ?? 'inactive'}
          onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  ),
})
