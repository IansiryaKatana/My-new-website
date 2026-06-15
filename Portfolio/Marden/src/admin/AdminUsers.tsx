import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Database } from '#/integrations/supabase/database.types'
import { createEntityAdmin } from './createEntityAdmin'

type Row = Database['public']['Tables']['admin_users']['Row']

export const AdminUsers = createEntityAdmin<Row>({
  title: 'Admin users',
  description: 'CMS roles (owner, admin, editor, viewer). Link auth_user_id after first login.',
  table: 'admin_users',
  orderBy: 'created_at',
  refetchCms: false,
  emptyRow: () => ({
    id: crypto.randomUUID(),
    email: '',
    role: 'editor',
    is_active: true,
  }),
  columns: [
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'is_active', label: 'Active' },
  ],
  validate: (d) => {
    if (!d.email?.trim() || !d.email.includes('@')) return 'Valid email required.'
    return null
  },
  renderForm: (draft, setDraft) => (
    <div className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input
          className="mt-1"
          value={draft.email ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
        />
      </div>
      <div>
        <Label>Role</Label>
        <select
          className="mt-1 flex h-9 w-full rounded border px-2 text-sm"
          value={draft.role ?? 'editor'}
          onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
        >
          {['owner', 'admin', 'editor', 'viewer'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  ),
})
