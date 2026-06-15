import { useCallback, useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Tables } from '#/integrations/supabase/database.types'
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
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type BenefitRow = Tables<'benefits'>

function emptyBenefit(): BenefitRow {
  return {
    id: crypto.randomUUID(),
    label: '',
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
  }
}

export function AdminBenefits() {
  const { refetch: refetchCms } = useCms()
  const [rows, setRows] = useState<BenefitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<BenefitRow | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    const { data, error } = await supabase.from('benefits').select('*').order('sort_order')
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

  const save = async () => {
    if (!draft?.label.trim()) {
      setSaveErr('Label is required.')
      return
    }

    const supabase = getSupabase()
    if (!supabase) return

    setSaving(true)
    const { error } = await supabase.from('benefits').upsert(
      { ...draft, label: draft.label.trim() },
      { onConflict: 'id' },
    )
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

    await supabase.from('benefits').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
    await refetchCms()
  }

  return (
    <div>
      <AdminPageHeading
        title="Benefits"
        description="Marquee benefit labels shown on the landing page."
        actions={
          <>
            <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
              Refresh
            </button>
            <button
              type="button"
              className={adminBtnPrimary}
              onClick={() => {
                setDraft(emptyBenefit())
                setSaveErr(null)
                setModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Add benefit
            </button>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
        </div>
      ) : null}
      {err ? <p className="text-sm text-[var(--admin-danger)]">{err}</p> : null}

      {!loading ? (
        <>
          <div className={adminTableWrap}>
            <table className={adminTable}>
              <thead className={adminTableHead}>
                <tr>
                  <th className={adminTableTh}>Label</th>
                  <th className={adminTableTh}>Order</th>
                  <th className={adminTableTh}>Published</th>
                  <th className={adminTableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageRows.map((row) => (
                  <tr key={row.id}>
                    <td className={adminTableTd}>{row.label}</td>
                    <td className={adminTableTd}>{row.sort_order}</td>
                    <td className={adminTableTd}>{row.published ? 'Yes' : 'No'}</td>
                    <td className={adminTableTd}>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({ ...row })
                            setSaveErr(null)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setDeleteId(row.id)}>
                          <Trash2 className="h-4 w-4 text-[var(--admin-danger)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination {...pagination} onPageChange={pagination.goToPage} />
        </>
      ) : null}

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft && rows.some((row) => row.id === draft.id) ? 'Edit benefit' : 'New benefit'}
        footer={
          <button type="button" className={adminBtnPrimary} disabled={saving} onClick={() => void save()}>
            Save
          </button>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className={adminLabel}>Label</label>
              <input
                className={adminInput}
                value={draft.label}
                onChange={(event) => setDraft({ ...draft, label: event.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Sort order</label>
              <input
                type="number"
                className={adminInput}
                value={draft.sort_order}
                onChange={(event) =>
                  setDraft({ ...draft, sort_order: Number(event.target.value) || 0 })
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
              />
              Published
            </label>
            {saveErr ? <p className="text-sm text-[var(--admin-danger)]">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete benefit"
        footer={
          <button type="button" className={adminBtnDanger} onClick={() => void confirmDelete()}>
            Delete
          </button>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Delete this benefit label?</p>
      </AdminModal>
    </div>
  )
}
