import { useCallback, useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Tables } from '#/integrations/supabase/database.types'
import { SLUG_REGEX, slugify } from '@/lib/utils'
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminLabel,
  adminTable,
  adminTableHead,
  adminTableTd,
  adminTableTh,
  adminTableWrap,
} from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminRichTextField } from './components/AdminRichTextField'
import { AdminTablePagination } from './components/AdminTablePagination'
import { ImageUploadField } from './components/ImageUploadField'
import { useAdminTablePagination } from './useAdminTablePagination'

type ProductRow = Tables<'products'>

function emptyProduct(): ProductRow {
  return {
    id: crypto.randomUUID(),
    name: '',
    slug: '',
    short_description: '',
    description_html: '',
    image_url: '',
    price: null,
    category: 'signature',
    flavor: null,
    is_featured: false,
    published: true,
    sort_order: 0,
    cta_href: '/menu',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AdminProducts() {
  const { refetch: refetchCms } = useCms()
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<ProductRow | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    setErr(null)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) setErr(error.message)
    else {
      setRows(data ?? [])
      pagination.resetPage()
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const openCreate = () => {
    setDraft(emptyProduct())
    setSaveErr(null)
    setModalOpen(true)
  }

  const openEdit = (row: ProductRow) => {
    setDraft({ ...row })
    setSaveErr(null)
    setModalOpen(true)
  }

  const save = async () => {
    if (!draft) return

    const name = draft.name.trim()
    const slug = draft.slug.trim() || slugify(name)

    if (!name) {
      setSaveErr('Name is required.')
      return
    }
    if (!SLUG_REGEX.test(slug)) {
      setSaveErr('Slug must be lowercase letters, numbers, and hyphens.')
      return
    }

    const supabase = getSupabase()
    if (!supabase) return

    setSaving(true)
    setSaveErr(null)

    const payload = {
      ...draft,
      name,
      slug,
      short_description: draft.short_description.trim(),
      image_url: draft.image_url.trim(),
      cta_href: draft.cta_href.trim() || '/menu',
      flavor: draft.flavor?.trim() || null,
    }

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' })

    setSaving(false)

    if (error) {
      setSaveErr(error.message)
      return
    }

    setModalOpen(false)
    setDraft(null)
    await refresh()
    await refetchCms()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    const supabase = getSupabase()
    if (!supabase) return

    setDeleting(true)
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    setDeleting(false)

    if (error) {
      setErr(error.message)
      return
    }

    setDeleteId(null)
    await refresh()
    await refetchCms()
  }

  return (
    <div>
      <AdminPageHeading
        title="Products"
        description="Manage the matcha product catalog shown on the public site."
        actions={
          <>
            <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
              Refresh
            </button>
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add product
            </button>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
        </div>
      ) : null}
      {err ? <p className="mb-4 text-sm text-[var(--admin-danger)]">{err}</p> : null}

      {!loading ? (
        <>
          <div className={adminTableWrap}>
            <table className={adminTable}>
              <thead className={adminTableHead}>
                <tr>
                  <th className={adminTableTh}>Name</th>
                  <th className={adminTableTh}>Category</th>
                  <th className={adminTableTh}>Featured</th>
                  <th className={adminTableTh}>Published</th>
                  <th className={adminTableTh}>Order</th>
                  <th className={adminTableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageRows.map((row) => (
                  <tr key={row.id}>
                    <td className={adminTableTd}>
                      <p className="font-medium">{row.name}</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">{row.slug}</p>
                    </td>
                    <td className={adminTableTd}>{row.category}</td>
                    <td className={adminTableTd}>{row.is_featured ? 'Yes' : 'No'}</td>
                    <td className={adminTableTd}>{row.published ? 'Yes' : 'No'}</td>
                    <td className={adminTableTd}>{row.sort_order}</td>
                    <td className={adminTableTd}>
                      <div className="flex gap-2">
                        <button type="button" aria-label="Edit" onClick={() => openEdit(row)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label="Delete" onClick={() => setDeleteId(row.id)}>
                          <Trash2 className="h-4 w-4 text-[var(--admin-danger)]" />
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
            totalPages={pagination.totalPages}
            totalRows={pagination.totalRows}
            pageSize={pagination.pageSize}
            hasPrev={pagination.hasPrev}
            hasNext={pagination.hasNext}
            onPageChange={pagination.goToPage}
          />
        </>
      ) : null}

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft && rows.some((row) => row.id === draft.id) ? 'Edit product' : 'New product'}
        footer={
          <button type="button" className={adminBtnPrimary} disabled={saving} onClick={() => void save()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save
          </button>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className={adminLabel}>Name</label>
              <input
                className={adminInput}
                value={draft.name}
                onChange={(event) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          name: event.target.value,
                          slug: prev.slug || slugify(event.target.value),
                        }
                      : prev,
                  )
                }
              />
            </div>
            <div>
              <label className={adminLabel}>Slug</label>
              <input
                className={adminInput}
                value={draft.slug}
                onChange={(event) => setDraft((prev) => (prev ? { ...prev, slug: event.target.value } : prev))}
              />
            </div>
            <div>
              <label className={adminLabel}>Short description</label>
              <input
                className={adminInput}
                value={draft.short_description}
                onChange={(event) =>
                  setDraft((prev) => (prev ? { ...prev, short_description: event.target.value } : prev))
                }
              />
            </div>
            <AdminRichTextField
              label="Description"
              value={draft.description_html}
              onChange={(html) => setDraft((prev) => (prev ? { ...prev, description_html: html } : prev))}
            />
            <ImageUploadField
              label="Image"
              value={draft.image_url}
              folder="products"
              onChange={(url) => setDraft((prev) => (prev ? { ...prev, image_url: url } : prev))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminLabel}>Category</label>
                <select
                  className={adminInput}
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((prev) => (prev ? { ...prev, category: event.target.value } : prev))
                  }
                >
                  <option value="ceremonial">Ceremonial</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="signature">Signature</option>
                </select>
              </div>
              <div>
                <label className={adminLabel}>Price</label>
                <input
                  type="number"
                  step="0.01"
                  className={adminInput}
                  value={draft.price ?? ''}
                  onChange={(event) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            price: event.target.value ? Number(event.target.value) : null,
                          }
                        : prev,
                    )
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminLabel}>Flavor</label>
                <input
                  className={adminInput}
                  value={draft.flavor ?? ''}
                  onChange={(event) =>
                    setDraft((prev) => (prev ? { ...prev, flavor: event.target.value || null } : prev))
                  }
                />
              </div>
              <div>
                <label className={adminLabel}>Sort order</label>
                <input
                  type="number"
                  className={adminInput}
                  value={draft.sort_order}
                  onChange={(event) =>
                    setDraft((prev) =>
                      prev ? { ...prev, sort_order: Number(event.target.value) || 0 } : prev,
                    )
                  }
                />
              </div>
            </div>
            <div>
              <label className={adminLabel}>CTA href</label>
              <input
                className={adminInput}
                value={draft.cta_href}
                onChange={(event) =>
                  setDraft((prev) => (prev ? { ...prev, cta_href: event.target.value } : prev))
                }
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.is_featured}
                  onChange={(event) =>
                    setDraft((prev) => (prev ? { ...prev, is_featured: event.target.checked } : prev))
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(event) =>
                    setDraft((prev) => (prev ? { ...prev, published: event.target.checked } : prev))
                  }
                />
                Published
              </label>
            </div>
            {saveErr ? <p className="text-sm text-[var(--admin-danger)]">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete product"
        description="This action cannot be undone."
        footer={
          <button type="button" className={adminBtnDanger} disabled={deleting} onClick={() => void confirmDelete()}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Delete
          </button>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">
          Are you sure you want to delete this product?
        </p>
      </AdminModal>
    </div>
  )
}
