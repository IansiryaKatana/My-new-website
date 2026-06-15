import { useCallback, useEffect, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { Database } from '@/integrations/supabase/database.types'
import { getSupabase } from '@/integrations/supabase/client'
import { adminBtn, adminBtnGhost, adminInput } from '../adminClassNames'
import { AdminModal } from '../components/AdminModal'
import { AdminPageHeading } from '../components/AdminPageHeading'
import { AdminTablePagination } from '../components/AdminTablePagination'
import { useAdminTablePagination } from '../useAdminTablePagination'

type Row = Database['public']['Tables']['testimonials']['Row']

export function AdminTestimonials() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('testimonials').select('*').order('sort_order')
    setRows(data ?? [])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const { slice, page, setPage, totalPages, total } = useAdminTablePagination(rows)

  const save = async () => {
    if (!draft?.client_name?.trim()) return
    setBusy(true)
    const sb = getSupabase()
    if (!sb) return
    await sb.from('testimonials').upsert({
      id: draft.id ?? crypto.randomUUID(),
      client_name: draft.client_name,
      client_location: draft.client_location ?? '',
      title: draft.title ?? '',
      quote: draft.quote ?? '',
      avatar_url: draft.avatar_url,
      property_image_url: draft.property_image_url,
      assigned_agent: draft.assigned_agent,
      card_type: draft.card_type ?? 'text',
      published: draft.published ?? false,
      sort_order: draft.sort_order ?? 0,
    })
    setBusy(false)
    setModalOpen(false)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title="Testimonials" />
      <button type="button" className={`${adminBtn} mb-4`} onClick={() => { setDraft({ id: crypto.randomUUID(), card_type: 'text', published: false, sort_order: 0 }); setModalOpen(true) }}>Add</button>
      <table className="admin-table w-full min-w-[600px] border border-[#d8d2c7] bg-white">
        <thead><tr><th>Client</th><th>Published</th><th /></tr></thead>
        <tbody>
          {slice.map((r) => (
            <tr key={r.id}>
              <td>{r.client_name}</td>
              <td>{r.published ? 'Yes' : 'No'}</td>
              <td>
                <button type="button" className={adminBtnGhost} onClick={() => { setDraft(r); setModalOpen(true) }}>Edit</button>
                <button type="button" className="ml-2 text-xs text-red-700" onClick={() => setDeleteId(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminTablePagination page={page} totalPages={totalPages} total={total} onPage={setPage} />
      <AdminModal open={modalOpen} onOpenChange={setModalOpen} title="Testimonial" onSave={save} busy={busy}>
        {draft && (
          <div className="space-y-3">
            <input className={adminInput} placeholder="Client name" value={draft.client_name ?? ''} onChange={(e) => setDraft({ ...draft, client_name: e.target.value })} />
            <textarea className={`${adminInput} min-h-[80px]`} placeholder="Quote" value={draft.quote ?? ''} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={draft.published ?? false} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
          </div>
        )}
      </AdminModal>
      <AdminModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete?" onSave={async () => { await getSupabase()?.from('testimonials').delete().eq('id', deleteId!); setDeleteId(null); await refresh(); await refetch() }} saveLabel="Delete"><p className="text-sm">Confirm delete.</p></AdminModal>
    </div>
  )
}
