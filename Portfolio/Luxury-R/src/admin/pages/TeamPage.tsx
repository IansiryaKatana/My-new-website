import { useCallback, useEffect, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { Database } from '@/integrations/supabase/database.types'
import { getSupabase } from '@/integrations/supabase/client'
import { adminBtn, adminBtnGhost, adminInput } from '../adminClassNames'
import { AdminModal } from '../components/AdminModal'
import { AdminPageHeading } from '../components/AdminPageHeading'

type Row = Database['public']['Tables']['team_members']['Row']

export function AdminTeam() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [open, setOpen] = useState(false)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('team_members').select('*').order('sort_order')
    setRows(data ?? [])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const save = async () => {
    const sb = getSupabase()
    if (!sb || !draft?.name) return
    await sb.from('team_members').upsert({
      id: draft.id ?? crypto.randomUUID(),
      name: draft.name,
      role: draft.role ?? '',
      bio: draft.bio ?? '',
      image_url: draft.image_url ?? '',
      bullets: draft.bullets ?? [],
      published: draft.published ?? false,
      sort_order: draft.sort_order ?? 0,
    })
    setOpen(false)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title="Team" />
      <button type="button" className={`${adminBtn} mb-4`} onClick={() => { setDraft({ id: crypto.randomUUID(), bullets: [], published: false, sort_order: 0 }); setOpen(true) }}>Add member</button>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between border border-[#d8d2c7] bg-white p-4">
            <span>{r.name} — {r.role}</span>
            <button type="button" className={adminBtnGhost} onClick={() => { setDraft(r); setOpen(true) }}>Edit</button>
          </div>
        ))}
      </div>
      <AdminModal open={open} onOpenChange={setOpen} title="Team member" onSave={save}>
        {draft && (
          <div className="space-y-3">
            <input className={adminInput} placeholder="Name" value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <input className={adminInput} placeholder="Role" value={draft.role ?? ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
            <input className={adminInput} placeholder="Image URL" value={draft.image_url ?? ''} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} />
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={draft.published ?? false} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
