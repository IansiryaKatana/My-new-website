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
import { AdminConfirmDialog } from './components/AdminConfirmDialog'
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
    intent_page: false,
    target_keyword: '',
    target_location: '',
    target_service: '',
    internal_links: [],
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
  const [metaJson, setMetaJson] = useState('{}')
  const [linksJson, setLinksJson] = useState('[]')
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
    let meta: unknown = {}
    let internalLinks: unknown = []
    try {
      sections = JSON.parse(sectionsJson)
    } catch {
      setSaveErr('Sections must be valid JSON.')
      return
    }
    try {
      meta = JSON.parse(metaJson)
    } catch {
      setSaveErr('Meta must be valid JSON.')
      return
    }
    try {
      internalLinks = JSON.parse(linksJson)
    } catch {
      setSaveErr('Internal links must be valid JSON array.')
      return
    }
    const sb = getSupabase()
    if (!sb) return
    const { error } = await sb
      .from('marketing_pages')
      .upsert(
        { ...draft, sections, meta, internal_links: internalLinks },
        { onConflict: 'id' },
      )
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
    await sb.from('marketing_pages').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading
        title="Marketing pages"
        description="Editable copy for about, contact, and home sections (sections JSON for structured blocks)."
        actions={
          <button
            type="button"
            className={adminBtnPrimary}
            onClick={() => {
              setDraft(emptyRow())
              setSectionsJson('{}')
              setMetaJson('{}')
              setLinksJson('[]')
              setModalOpen(true)
            }}
          >
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
                    setMetaJson(JSON.stringify(row.meta ?? {}, null, 2))
                    setLinksJson(JSON.stringify(row.internal_links ?? [], null, 2))
                    setModalOpen(true)
                  }}>Edit</button>
                  <button type="button" className={`${adminBtnDanger} ml-2`} onClick={() => setDeleteId(row.id)}>
                    Delete
                  </button>
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
            <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={draft.intent_page} onChange={(e) => setDraft({ ...draft, intent_page: e.target.checked })} /> Intent page (creates /i/{draft.slug || 'slug'})</label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2"><span className={adminLabel}>Target keyword</span><input className={adminInput} value={draft.target_keyword} onChange={(e) => setDraft({ ...draft, target_keyword: e.target.value })} /></label>
              <label className="grid gap-2"><span className={adminLabel}>Target location</span><input className={adminInput} value={draft.target_location} onChange={(e) => setDraft({ ...draft, target_location: e.target.value })} /></label>
              <label className="grid gap-2"><span className={adminLabel}>Target service</span><input className={adminInput} value={draft.target_service} onChange={(e) => setDraft({ ...draft, target_service: e.target.value })} /></label>
            </div>
            <label className="grid gap-2"><span className={adminLabel}>Sections JSON</span><textarea className={`${adminInput} min-h-32 font-mono text-xs`} value={sectionsJson} onChange={(e) => setSectionsJson(e.target.value)} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Meta JSON</span><textarea className={`${adminInput} min-h-28 font-mono text-xs`} value={metaJson} onChange={(e) => setMetaJson(e.target.value)} /></label>
            <label className="grid gap-2"><span className={adminLabel}>Internal links JSON</span><textarea className={`${adminInput} min-h-28 font-mono text-xs`} value={linksJson} onChange={(e) => setLinksJson(e.target.value)} placeholder='[{"label":"CRM case studies","href":"/portfolio","note":"Contextual cluster link"}]' /></label>
            <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
            {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
          </>
        ) : null}
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete marketing page?"
        description="This page and its content will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

