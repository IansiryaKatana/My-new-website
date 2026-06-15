import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['footer_columns']['Row']

export const AdminFooter = createEntityAdmin<Row>({
  title: 'Footer columns',
  description: 'Sitemap columns (links as JSON array).',
  table: 'footer_columns',
  emptyRow: () => ({
    id: crypto.randomUUID(),
    title: '',
    links: [],
    sort_order: 0,
    published: true,
  }),
  columns: [{ key: 'title', label: 'Title' }],
  validate: (d) => (!d.title?.trim() ? 'Title required' : null),
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          className="mt-1"
          value={draft.title ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
      </div>
      <div>
        <Label>Links JSON</Label>
        <textarea
          className="mt-1 w-full rounded border p-2 font-mono text-xs"
          rows={6}
          value={JSON.stringify(draft.links ?? [], null, 2)}
          onChange={(e) => {
            try {
              setDraft((d) => ({ ...d, links: JSON.parse(e.target.value) }))
            } catch {
              /* ignore invalid json while typing */
            }
          }}
        />
        <p className="text-[11px] text-[var(--admin-muted)]">
          Format: [{'{'}&quot;label&quot;:&quot;About&quot;,&quot;href&quot;:&quot;#&quot;{'}'}]
        </p>
      </div>
    </div>
  ),
})
