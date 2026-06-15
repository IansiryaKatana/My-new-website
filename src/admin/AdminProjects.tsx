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
import { ImageUploadField } from './components/ImageUploadField'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Tables<'projects'>

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function emptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    summary: '',
    description: '',
    year: new Date().getFullYear().toString(),
    role: '',
    stack: [],
    tags: [],
    outcomes: [],
    href: null,
    cover_image_url: null,
    featured_image_url: null,
    thumbnail_urls: [],
    seo_description: '',
    featured: false,
    published: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AdminProjects() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Row | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pagination = useAdminTablePagination(rows)

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data, error } = await sb.from('projects').select('*').order('sort_order')
    if (error) setErr(error.message)
    else setRows(data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  function openCreate() {
    setDraft(emptyRow())
    setStep(1)
    setSaveErr(null)
    setModalOpen(true)
  }

  function openEdit(row: Row) {
    setDraft({ ...row })
    setStep(1)
    setSaveErr(null)
    setModalOpen(true)
  }

  async function save() {
    if (!draft) return
    if (!draft.title.trim() || !draft.slug.trim()) {
      setSaveErr('Title and slug are required.')
      return
    }
    if (!SLUG_RE.test(draft.slug)) {
      setSaveErr('Slug must be lowercase letters, numbers, and hyphens.')
      return
    }
    const sb = getSupabase()
    if (!sb) return
    const { error } = await sb.from('projects').upsert(draft, { onConflict: 'id' })
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
    await sb.from('projects').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading
        title="Projects"
        description="Portfolio case studies at /portfolio/{slug}. Manage images, SEO, tags, and reference links."
        actions={
          <button type="button" className={adminBtnPrimary} onClick={openCreate}>
            Add project
          </button>
        }
      />
      {err ? <p className="text-[#e88]">{err}</p> : null}
      <div className="overflow-x-auto">
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTh}>Title</th>
              <th className={adminTh}>Slug</th>
              <th className={adminTh}>Featured</th>
              <th className={adminTh}>Published</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.slice.map((row) => (
              <tr key={row.id}>
                <td className={adminTd}>{row.title}</td>
                <td className={adminTd}>{row.slug}</td>
                <td className={adminTd}>{row.featured ? 'Yes' : 'No'}</td>
                <td className={adminTd}>{row.published ? 'Yes' : 'No'}</td>
                <td className={adminTd}>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={adminBtn} onClick={() => openEdit(row)}>
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
      <AdminTablePagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        total={pagination.total}
        onPrev={pagination.prev}
        onNext={pagination.next}
      />

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={
          draft?.title
            ? `Edit ${draft.title} · Step ${step} of 2`
            : `New project · Step ${step} of 2`
        }
        footer={
          <>
            <button type="button" className={adminBtn} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            {step === 2 ? (
              <button type="button" className={adminBtn} onClick={() => setStep(1)}>
                Back
              </button>
            ) : null}
            {step === 1 ? (
              <button
                type="button"
                className={adminBtnPrimary}
                onClick={() => {
                  if (!draft?.title.trim() || !draft.slug.trim()) {
                    setSaveErr('Title and slug are required.')
                    return
                  }
                  setSaveErr(null)
                  setStep(2)
                }}
              >
                Next
              </button>
            ) : (
              <button type="button" className={adminBtnPrimary} onClick={() => void save()}>
                Save
              </button>
            )}
          </>
        }
      >
        {draft ? (
          step === 1 ? (
            <>
              <label className="grid gap-2">
                <span className={adminLabel}>Title</span>
                <input className={adminInput} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Slug</span>
                <input className={adminInput} value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
                <span className="text-xs opacity-60">Public URL: /portfolio/{draft.slug || 'your-slug'}</span>
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Summary</span>
                <textarea className={`${adminInput} min-h-20`} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>SEO description</span>
                <textarea
                  className={`${adminInput} min-h-20`}
                  value={draft.seo_description}
                  onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })}
                  placeholder="Meta description for search and social previews. Falls back to summary if empty."
                />
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Description</span>
                <textarea className={`${adminInput} min-h-32`} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={adminLabel}>Year</span>
                  <input className={adminInput} value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
                </label>
                <label className="grid gap-2">
                  <span className={adminLabel}>Role</span>
                  <input className={adminInput} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                </label>
              </div>
              <label className="grid gap-2">
                <span className={adminLabel}>Stack (comma separated)</span>
                <input
                  className={adminInput}
                  value={(draft.stack as string[]).join(', ')}
                  onChange={(e) => setDraft({ ...draft, stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                />
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Tags</span>
                <input
                  className={adminInput}
                  value={(draft.tags as string[]).join(', ')}
                  onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                />
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Outcomes (one per line)</span>
                <textarea
                  className={`${adminInput} min-h-24`}
                  value={(draft.outcomes as string[]).join('\n')}
                  onChange={(e) => setDraft({ ...draft, outcomes: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                />
              </label>
              {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
            </>
          ) : (
            <>
              <ImageUploadField
                label="Cover image (Behance-style hero)"
                folder="projects/covers"
                value={draft.cover_image_url ?? ''}
                onChange={(url) => setDraft({ ...draft, cover_image_url: url || null })}
              />
              <ImageUploadField
                label="Featured image (home preview)"
                folder="projects/featured"
                value={draft.featured_image_url ?? ''}
                onChange={(url) => setDraft({ ...draft, featured_image_url: url || null })}
              />
              <label className="grid gap-2">
                <span className={adminLabel}>Thumbnails (one URL per line)</span>
                <textarea
                  className={`${adminInput} min-h-24`}
                  value={(draft.thumbnail_urls as string[]).join('\n')}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      thumbnail_urls: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Gallery images shown on the case study page"
                />
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Reference link</span>
                <input
                  className={adminInput}
                  value={draft.href ?? ''}
                  onChange={(e) => setDraft({ ...draft, href: e.target.value.trim() || null })}
                  placeholder="/demos/aurora/ or https://example.com"
                />
                <span className="text-xs opacity-60">
                  Hosted demos: /demos/{'{slug}'}/ (e.g. /demos/aurora/). External URLs open in a new tab.
                </span>
              </label>
              <label className="grid gap-2">
                <span className={adminLabel}>Sort order</span>
                <input
                  type="number"
                  className={adminInput}
                  value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                />
              </label>
              <label className="flex items-center gap-2 font-sans text-sm">
                <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
                Featured on home
              </label>
              <label className="flex items-center gap-2 font-sans text-sm">
                <input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
                Published
              </label>
              {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
            </>
          )
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete project?"
        footer={
          <>
            <button type="button" className={adminBtn} onClick={() => setDeleteId(null)}>
              Cancel
            </button>
            <button type="button" className={adminBtnDanger} onClick={() => void confirmDelete()}>
              Delete
            </button>
          </>
        }
      >
        <p className="font-sans text-sm">This cannot be undone.</p>
      </AdminModal>
    </div>
  )
}
