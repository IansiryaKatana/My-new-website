import { useCallback, useEffect, useState } from 'react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import { isValidSlug, slugify } from '#/lib/utils'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'

type FieldDef = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'checkbox'
  required?: boolean
}

type AdminListCrudProps<T extends { id: string }> = {
  title: string
  description: string
  table: string
  fields: FieldDef[]
  defaultRow: () => T
  orderBy?: string
  slugField?: string
  columns: { key: keyof T; label: string }[]
}

export function AdminListCrud<T extends { id: string }>({
  title,
  description,
  table,
  fields,
  defaultRow,
  orderBy = 'sort_order',
  slugField,
  columns,
}: AdminListCrudProps<T>) {
  const { refetch } = useCms()
  const [rows, setRows] = useState<T[]>([])
  const [draft, setDraft] = useState<Partial<T> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb
      .from(table as 'principles')
      .select('*')
      .order(orderBy)
    setRows((data as T[]) ?? [])
  }, [table, orderBy])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const { slice, page, pageCount, total, setPage } = useAdminTablePagination(rows)

  function openCreate() {
    setDraft(defaultRow())
    setSaveErr(null)
    setModalOpen(true)
  }

  function openEdit(row: T) {
    setDraft({ ...row })
    setSaveErr(null)
    setModalOpen(true)
  }

  async function save() {
    if (!draft) return
    const sb = getSupabase()
    if (!sb) return

    for (const f of fields) {
      if (f.required && !(draft as Record<string, unknown>)[f.key]) {
        setSaveErr(`${f.label} is required`)
        return
      }
    }

    if (slugField) {
      const slug = String((draft as Record<string, unknown>)[slugField] ?? '')
      if (slug && !isValidSlug(slug)) {
        setSaveErr('Slug must be lowercase letters, numbers, and hyphens only')
        return
      }
    }

    setBusy(true)
    setSaveErr(null)
    const { error } = await sb
      .from(table as 'principles')
      .upsert(draft as never, { onConflict: 'id' })
    setBusy(false)
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
    await sb.from(table as 'principles').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title={title} description={description} />
      <div className="flex gap-2 mb-4">
        <Button type="button" onClick={openCreate}>
          Add
        </Button>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="admin-table w-full min-w-[480px]">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)}>{c.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={String(c.key)}>
                    {String((row as Record<string, unknown>)[c.key as string] ?? '')}
                  </td>
                ))}
                <td className="space-x-2 whitespace-nowrap">
                  <button
                    type="button"
                    className="text-sm text-blue-600"
                    onClick={() => openEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => setDeleteId(row.id)}
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
        pageCount={pageCount}
        total={total}
        onPageChange={setPage}
      />

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft && rows.some((r) => r.id === draft.id) ? 'Edit' : 'Create'}
        onSave={() => void save()}
        busy={busy}
        saveError={saveErr}
      >
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label>{f.label}</Label>
            {f.type === 'textarea' ? (
              <textarea
                className="admin-input min-h-[80px] w-full"
                value={String((draft as Record<string, unknown>)?.[f.key] ?? '')}
                onChange={(e) => {
                  const next = { ...draft, [f.key]: e.target.value } as Partial<T>
                  if (slugField && f.key === 'name' && !(draft as Record<string, unknown>)?.[slugField]) {
                    (next as Record<string, unknown>)[slugField] = slugify(e.target.value)
                  }
                  setDraft(next)
                }}
              />
            ) : f.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={Boolean((draft as Record<string, unknown>)?.[f.key])}
                onChange={(e) =>
                  setDraft({ ...draft, [f.key]: e.target.checked } as Partial<T>)
                }
              />
            ) : (
              <Input
                type={f.type === 'number' ? 'number' : 'text'}
                value={String((draft as Record<string, unknown>)?.[f.key] ?? '')}
                onChange={(e) => {
                  const val =
                    f.type === 'number' ? Number(e.target.value) : e.target.value
                  const next = { ...draft, [f.key]: val } as Partial<T>
                  if (slugField && f.key === 'name') {
                    (next as Record<string, unknown>)[slugField] = slugify(
                      e.target.value,
                    )
                  }
                  setDraft(next)
                }}
              />
            )}
          </div>
        ))}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Confirm delete"
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
      >
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
      </AdminModal>
    </div>
  )
}
