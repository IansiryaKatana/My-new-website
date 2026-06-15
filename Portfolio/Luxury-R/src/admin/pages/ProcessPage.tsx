import { useCallback, useEffect, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { Database } from '@/integrations/supabase/database.types'
import { getSupabase } from '@/integrations/supabase/client'
import { adminBtn, adminBtnGhost, adminInput } from '../adminClassNames'
import { AdminModal } from '../components/AdminModal'
import { AdminPageHeading } from '../components/AdminPageHeading'

type Row = Database['public']['Tables']['process_steps']['Row']

export function AdminProcess() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [open, setOpen] = useState(false)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('process_steps').select('*').order('sort_order')
    setRows(data ?? [])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const save = async () => {
    const sb = getSupabase()
    if (!sb || !draft?.title) return
    await sb.from('process_steps').upsert({
      id: draft.id ?? crypto.randomUUID(),
      step_number: draft.step_number ?? '01',
      title: draft.title,
      description: draft.description ?? '',
      image_url: draft.image_url,
      published: draft.published ?? false,
      sort_order: draft.sort_order ?? 0,
    })
    setOpen(false)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title="Process steps" />
      <button type="button" className={`${adminBtn} mb-4`} onClick={() => { setDraft({ id: crypto.randomUUID(), step_number: '01', published: false, sort_order: 0 }); setOpen(true) }}>Add step</button>
      {rows.map((r) => (
        <div key={r.id} className="mb-2 flex justify-between border border-[#d8d2c7] bg-white p-4">
          <span>{r.step_number} — {r.title}</span>
          <button type="button" className={adminBtnGhost} onClick={() => { setDraft(r); setOpen(true) }}>Edit</button>
        </div>
      ))}
      <AdminModal open={open} onOpenChange={setOpen} title="Process step" onSave={save}>
        {draft && (
          <div className="space-y-3">
            <input className={adminInput} placeholder="Step number" value={draft.step_number ?? ''} onChange={(e) => setDraft({ ...draft, step_number: e.target.value })} />
            <input className={adminInput} placeholder="Title" value={draft.title ?? ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <textarea className={`${adminInput} min-h-[80px]`} placeholder="Description" value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={draft.published ?? false} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
