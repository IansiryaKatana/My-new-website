import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Database } from '#/integrations/supabase/database.types'
import { SLUG_REGEX, slugify } from '#/lib/utils'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { ImageUploadField } from './components/ImageUploadField'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Database['public']['Tables']['projects']['Row']

function emptyRow(): Partial<Row> {
  return {
    id: crypto.randomUUID(),
    title: '',
    slug: '',
    description: '',
    image_url: '',
    category: 'Infrastructure',
    layout: 'stacked',
    cta_label: 'Explore project',
    cta_url: '#',
    sort_order: 0,
    published: true,
  }
}

export function AdminProjects() {
  const { refetch: refetchCms } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data, error } = await sb.from('projects').select('*').order('sort_order')
    if (error) setErr(error.message)
    else {
      setErr(null)
      setRows(data ?? [])
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  function openCreate() {
    setDraft(emptyRow())
    setSaveErr(null)
    setModalOpen(true)
  }

  function openEdit(row: Row) {
    setDraft({ ...row })
    setSaveErr(null)
    setModalOpen(true)
  }

  async function save() {
    if (!draft?.title?.trim() || !draft.image_url?.trim()) {
      setSaveErr('Title and image URL are required.')
      return
    }
    const slug = draft.slug?.trim() || slugify(draft.title)
    if (!SLUG_REGEX.test(slug)) {
      setSaveErr('Slug must be lowercase letters, numbers, and hyphens.')
      return
    }
    const sb = getSupabase()
    if (!sb) return
    setBusy(true)
    const row = {
      ...draft,
      title: draft.title.trim(),
      slug,
      description: (draft.description ?? '').trim(),
      updated_at: new Date().toISOString(),
    } as Row
    const { error } = await sb.from('projects').upsert(row, { onConflict: 'id' })
    setBusy(false)
    if (error) {
      setSaveErr(error.message)
      return
    }
    setModalOpen(false)
    await refresh()
    await refetchCms()
  }

  async function confirmDelete() {
    if (!deleteId) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('projects').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetchCms()
  }

  return (
    <div>
      <AdminPageHeading title="Projects" description="Infrastructure showcase cards on the homepage." />
      {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
      <div className="mb-4">
        <Button variant="admin" type="button" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add project
        </Button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Layout</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pagination.slice.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.category}</td>
                <td>{row.layout}</td>
                <td>{row.published ? 'Yes' : 'No'}</td>
                <td className="flex gap-2">
                  <button type="button" aria-label="Edit" onClick={() => openEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Delete" onClick={() => setDeleteId(row.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
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
        title={draft?.title ? 'Edit project' : 'New project'}
        onSave={() => void save()}
        saving={busy}
        saveError={saveErr}
      >
        {draft && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input
                className="mt-1"
                value={draft.title ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d!,
                    title: e.target.value,
                    slug: d?.slug || slugify(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                className="mt-1"
                value={draft.slug ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d!, slug: e.target.value }))}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="mt-1 flex h-9 w-full rounded border px-2 text-sm"
                value={draft.category ?? 'Infrastructure'}
                onChange={(e) => setDraft((d) => ({ ...d!, category: e.target.value }))}
              >
                {['Solar', 'Wind', 'Grid', 'Infrastructure'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Layout</Label>
              <select
                className="mt-1 flex h-9 w-full rounded border px-2 text-sm"
                value={draft.layout ?? 'stacked'}
                onChange={(e) => setDraft((d) => ({ ...d!, layout: e.target.value }))}
              >
                <option value="stacked">Stacked (left column)</option>
                <option value="featured">Featured (large right)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <textarea
                className="mt-1 w-full rounded border p-2 text-sm"
                rows={3}
                value={draft.description ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d!, description: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Image URL"
                value={draft.image_url ?? ''}
                onChange={(url) => setDraft((d) => ({ ...d!, image_url: url }))}
              />
            </div>
            <div>
              <Label>Sort order</Label>
              <Input
                type="number"
                className="mt-1"
                value={draft.sort_order ?? 0}
                onChange={(e) =>
                  setDraft((d) => ({ ...d!, sort_order: Number(e.target.value) }))
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <input
                id="pub"
                type="checkbox"
                checked={draft.published ?? true}
                onChange={(e) => setDraft((d) => ({ ...d!, published: e.target.checked }))}
              />
              <Label htmlFor="pub">Published</Label>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete project?"
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
      >
        <p className="text-sm">This cannot be undone.</p>
      </AdminModal>
    </div>
  )
}
