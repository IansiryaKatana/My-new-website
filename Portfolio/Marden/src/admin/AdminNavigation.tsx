import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['navigation_links']['Row']

export const AdminNavigation = createEntityAdmin<Row>({
  title: 'Navigation',
  description: 'Header links and CTA.',
  table: 'navigation_links',
  emptyRow: () => ({
    id: crypto.randomUUID(),
    label: '',
    href: '#',
    sort_order: 0,
    published: true,
    is_cta: false,
  }),
  columns: [
    { key: 'label', label: 'Label' },
    { key: 'href', label: 'Href' },
    { key: 'is_cta', label: 'CTA' },
  ],
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Label</Label>
        <Input
          className="mt-1"
          value={draft.label ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
        />
      </div>
      <div>
        <Label>Href</Label>
        <Input
          className="mt-1"
          value={draft.href ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, href: e.target.value }))}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.is_cta ?? false}
          onChange={(e) => setDraft((d) => ({ ...d, is_cta: e.target.checked }))}
        />
        Pale green CTA button
      </label>
    </div>
  ),
})
