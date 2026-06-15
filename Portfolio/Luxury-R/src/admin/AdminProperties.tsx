import { useCallback, useEffect, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { Database } from '@/integrations/supabase/database.types'
import { getSupabase } from '@/integrations/supabase/client'
import { slugify } from '@/lib/utils'
import { adminBtn, adminBtnGhost, adminInput } from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Database['public']['Tables']['properties']['Row']

const emptyRow = (): Partial<Row> => ({
  id: crypto.randomUUID(),
  slug: '',
  title: '',
  location: 'Malibu, California',
  description: '',
  price_from: 0,
  image_url: '',
  category: 'loft',
  status: 'New Listing',
  bedrooms: 0,
  bathrooms: 0,
  area_label: '',
  published: false,
  sort_order: 0,
})

export function AdminProperties() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data, error } = await sb
      .from('properties')
      .select('*')
      .order('sort_order')
    if (error) setErr(error.message)
    else setRows(data ?? [])
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const { slice, page, setPage, totalPages, total } = useAdminTablePagination(rows)

  const openCreate = () => {
    setDraft(emptyRow())
    setSaveErr(null)
    setModalOpen(true)
  }

  const openEdit = (row: Row) => {
    setDraft({ ...row })
    setSaveErr(null)
    setModalOpen(true)
  }

  const save = async () => {
    if (!draft?.title?.trim()) {
      setSaveErr('Title is required')
      return
    }
    const slug = draft.slug?.trim() || slugify(draft.title)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSaveErr('Invalid slug')
      return
    }
    setBusy(true)
    const sb = getSupabase()
    if (!sb) return
    const row = {
      ...emptyRow(),
      ...draft,
      slug,
      title: draft.title!.trim(),
    } as Row
    const { error } = await sb.from('properties').upsert(row, { onConflict: 'id' })
    setBusy(false)
    if (error) setSaveErr(error.message)
    else {
      setModalOpen(false)
      await refresh()
      await refetch()
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('properties').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title="Properties" description="Luxury listing catalog" />
      {err && <p className="mb-4 text-sm text-red-700">{err}</p>}
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className={adminBtn} onClick={openCreate}>
          Add property
        </button>
      </div>

      <div className="overflow-x-auto border border-[#d8d2c7] bg-white">
        <table className="admin-table w-full min-w-[720px]">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>${Number(r.price_from).toLocaleString()}</td>
                <td>{r.published ? 'Yes' : 'No'}</td>
                <td className="space-x-2 text-right">
                  <button type="button" className={adminBtnGhost} onClick={() => openEdit(r)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-700"
                    onClick={() => setDeleteId(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPage={setPage}
      />

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft?.title ? 'Edit property' : 'New property'}
        onSave={save}
        busy={busy}
      >
        {draft && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" value={draft.title ?? ''} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Slug" value={draft.slug ?? ''} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <Field label="Location" value={draft.location ?? ''} onChange={(v) => setDraft({ ...draft, location: v })} />
            <Field label="Image URL" value={draft.image_url ?? ''} onChange={(v) => setDraft({ ...draft, image_url: v })} className="sm:col-span-2" />
            <Field label="Price" type="number" value={String(draft.price_from ?? 0)} onChange={(v) => setDraft({ ...draft, price_from: Number(v) })} />
            <div>
              <label className="text-xs uppercase text-[#8b897f]">Category</label>
              <select
                className={`${adminInput} mt-1`}
                value={draft.category ?? 'loft'}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as Row['category'] })}
              >
                <option value="loft">Loft</option>
                <option value="budget">Budget</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <Field label="Beds" type="number" value={String(draft.bedrooms ?? 0)} onChange={(v) => setDraft({ ...draft, bedrooms: Number(v) })} />
            <Field label="Baths" type="number" value={String(draft.bathrooms ?? 0)} onChange={(v) => setDraft({ ...draft, bathrooms: Number(v) })} />
            <Field label="Area" value={draft.area_label ?? ''} onChange={(v) => setDraft({ ...draft, area_label: v })} />
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={draft.published ?? false}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase text-[#8b897f]">Description</label>
              <textarea
                className={`${adminInput} mt-1 min-h-[80px]`}
                value={draft.description ?? ''}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          </div>
        )}
        {saveErr && <p className="text-sm text-red-700">{saveErr}</p>}
      </AdminModal>

      <AdminModal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete property?"
        onSave={confirmDelete}
        saveLabel="Delete"
      >
        <p className="text-sm">This cannot be undone.</p>
      </AdminModal>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="text-xs uppercase text-[#8b897f]">{label}</label>
      <input
        type={type}
        className={`${adminInput} mt-1`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
