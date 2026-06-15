import { useEffect, useState } from 'react'

import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'
import {
  adminBtn,
  adminBtnDanger,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminTable,
  adminTd,
  adminTh,
} from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Tables<'experience_items'>

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    slug: '',
    company: '',
    role: '',
    period: '',
    location: '',
    employment_type: '',
    work_mode: '',
    summary: '',
    detail_intro: '',
    highlights: [],
    responsibilities: [],
    technologies: [],
    seo_description: '',
    is_current: false,
    preview_limit: 3,
    featured_on_home: false,
    published: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AdminExperience() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Row | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pagination = useAdminTablePagination(rows)

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('experience_items').select('*').order('sort_order')
    setRows(data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function save() {
    if (!draft?.company.trim() || !draft.role.trim()) {
      setSaveErr('Company and role are required.')
      return
    }
    const sb = getSupabase()
    if (!sb) return
    const { error } = await sb.from('experience_items').upsert(draft, { onConflict: 'id' })
    if (error) {
      setSaveErr(error.message)
      return
    }
    setModalOpen(false)
    await refresh()
    await refetch()
  }

  async function confirmDelete() {
    if (!deleteId) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('experience_items').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading
        title="Experience"
        description="Professional timeline entries."
        actions={
          <button
            type="button"
            className={adminBtnPrimary}
            onClick={() => {
              setDraft(emptyRow())
              setSaveErr(null)
              setModalOpen(true)
            }}
          >
            Add entry
          </button>
        }
      />
      <div className="overflow-x-auto">
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTh}>Role</th>
              <th className={adminTh}>Company</th>
              <th className={adminTh}>Period</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.slice.map((row) => (
              <tr key={row.id}>
                <td className={adminTd}>{row.role}</td>
                <td className={adminTd}>{row.company}</td>
                <td className={adminTd}>{row.period}</td>
                <td className={adminTd}>
                  <div className="flex gap-2">
                    <button type="button" className={adminBtn} onClick={() => { setDraft({ ...row }); setModalOpen(true) }}>
                      Edit
                    </button>
                    <button type="button" className={adminBtnDanger} onClick={() => setDeleteId(row.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminTablePagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} />

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Experience entry"
        footer={
          <>
            <button type="button" className={adminBtn} onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="button" className={adminBtnPrimary} onClick={() => void save()}>Save</button>
          </>
        }
      >
        {draft ? (
          <>
            <label className="grid gap-2"><span className={adminLabel}>Company</span><input className={adminInput} value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Role</span><input className={adminInput} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Period</span><input className={adminInput} value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Location</span><input className={adminInput} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Summary</span><textarea className={`${adminInput} min-h-24`} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Highlights (one per line)</span><textarea className={`${adminInput} min-h-24`} value={(draft.highlights as string[]).join('\n')} onChange={(e) => setDraft({ ...draft, highlights: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean) })} /></label>
            <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
            {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
          </>
        ) : null}
      </AdminModal>

      <AdminModal open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)} title="Delete entry?" footer={<><button type="button" className={adminBtn} onClick={() => setDeleteId(null)}>Cancel</button><button type="button" className={adminBtnDanger} onClick={() => void confirmDelete()}>Delete</button></>}>
        <p className="font-sans text-sm">This cannot be undone.</p>
      </AdminModal>
    </div>
  )
}

