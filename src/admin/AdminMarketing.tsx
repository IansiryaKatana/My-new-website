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

type Row = Tables<'marketing_pages'>

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    eyebrow: '',
    description: '',
    body_html: '',
    sections: {},
    meta: {},
    published: true,
    sort_order: 0,
    updated_at: new Date().toISOString(),
  }
}

export function AdminMarketing() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Row | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [sectionsJson, setSectionsJson] = useState('{}')

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('marketing_pages').select('*').order('sort_order')
    setRows(data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function save() {
    if (!draft?.slug.trim() || !draft.title.trim()) {
      setSaveErr('Slug and title are required.')
      return
    }
    if (!SLUG_RE.test(draft.slug)) {
      setSaveErr('Invalid slug format.')
      return
    }
    let sections: unknown = {}
    try {
      sections = JSON.parse(sectionsJson)
    } catch {
      setSaveErr('Sections must be valid JSON.')
      return
    }
    const sb = getSupabase()
    if (!sb) return
    const { error } = await sb.from('marketing_pages').upsert({ ...draft, sections }, { onConflict: 'id' })
    if (error) {
      setSaveErr(error.message)
      return
    }
    setModalOpen(false)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading
        title="Marketing pages"
        description="Editable copy for about, contact, and home sections (sections JSON for structured blocks)."
        actions={
          <button type="button" className={adminBtnPrimary} onClick={() => { setDraft(emptyRow()); setSectionsJson('{}'); setModalOpen(true) }}>
            Add page
          </button>
        }
      />
      <div className="overflow-x-auto">
        <table className={adminTable}>
          <thead><tr><th className={adminTh}>Slug</th><th className={adminTh}>Title</th><th className={adminTh}>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={adminTd}>{row.slug}</td>
                <td className={adminTd}>{row.title}</td>
                <td className={adminTd}>
                  <button type="button" className={adminBtn} onClick={() => {
                    setDraft({ ...row })
                    setSectionsJson(JSON.stringify(row.sections ?? {}, null, 2))
                    setModalOpen(true)
                  }}>Edit</button>
                  <button type="button" className={`${adminBtnDanger} ml-2`} onClick={async () => {
                    const sb = getSupabase()
                    if (!sb) return
                    await sb.from('marketing_pages').delete().eq('id', row.id)
                    await refresh()
                    await refetch()
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onOpenChange={setModalOpen} title="Marketing page" footer={<><button type="button" className={adminBtn} onClick={() => setModalOpen(false)}>Cancel</button><button type="button" className={adminBtnPrimary} onClick={() => void save()}>Save</button></>}>
        {draft ? (
          <>
            <label className="grid gap-2"><span className={adminLabel}>Slug</span><input className={adminInput} value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Title</span><input className={adminInput} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Eyebrow</span><input className={adminInput} value={draft.eyebrow ?? ''} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Description</span><textarea className={`${adminInput} min-h-20`} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Body HTML</span><textarea className={`${adminInput} min-h-32 font-mono text-xs`} value={draft.body_html} onChange={(e) => setDraft({ ...draft, body_html: e.target.value })} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Sections JSON</span><textarea className={`${adminInput} min-h-32 font-mono text-xs`} value={sectionsJson} onChange={(e) => setSectionsJson(e.target.value)} /></label>
            <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
            {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
          </>
        ) : null}
      </AdminModal>
    </div>
  )
}

