import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['process_stages']['Row']

export const AdminProcess = createEntityAdmin<Row>({
  title: 'Process stages',
  description: 'Accordion rows in the process section.',
  table: 'process_stages',
  emptyRow: () => ({
    id: crypto.randomUUID(),
    number: '01',
    title: '',
    description: '',
    sort_order: 0,
    published: true,
  }),
  columns: [
    { key: 'number', label: '#' },
    { key: 'title', label: 'Title' },
  ],
  validate: (d) => (!d.title?.trim() ? 'Title required' : null),
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Number</Label>
        <Input
          className="mt-1"
          value={draft.number ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, number: e.target.value }))}
        />
      </div>
      <div>
        <Label>Title</Label>
        <Input
          className="mt-1"
          value={draft.title ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
      </div>
      <div>
        <Label>Description</Label>
        <textarea
          className="mt-1 w-full rounded border p-2 text-sm"
          rows={4}
          value={draft.description ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />
      </div>
    </div>
  ),
})
