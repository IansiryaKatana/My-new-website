import { useCallback, useEffect, useState } from 'react'
import { Eye, Loader2, Trash2 } from 'lucide-react'
import { getSupabase } from '#/integrations/supabase/client'
import type { Tables } from '#/integrations/supabase/database.types'
import {
  adminBtnDanger,
  adminBtnSecondary,
  adminTable,
  adminTableHead,
  adminTableTd,
  adminTableTh,
  adminTableWrap,
} from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { DetailField, EntityDetailSheet } from './components/EntityDetailSheet'
import { useAdminTablePagination } from './useAdminTablePagination'

type SubmissionRow = Tables<'form_submissions'>

export function AdminSubmissions() {
  const [rows, setRows] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [viewRow, setViewRow] = useState<SubmissionRow | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })

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

  const confirmDelete = async () => {
    if (!deleteId) return
    const supabase = getSupabase()
    if (!supabase) return

    await supabase.from('form_submissions').delete().eq('id', deleteId)
    setDeleteId(null)
    if (viewRow?.id === deleteId) setViewRow(null)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading
        title="Submissions"
        description="Newsletter and form submissions from the public site."
        actions={
          <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
            Refresh
          </button>
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
                  <th className={adminTableTh}>Email</th>
                  <th className={adminTableTh}>Type</th>
                  <th className={adminTableTh}>Source</th>
                  <th className={adminTableTh}>Created</th>
                  <th className={adminTableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageRows.map((row) => (
                  <tr key={row.id}>
                    <td className={adminTableTd}>{row.email}</td>
                    <td className={adminTableTd}>{row.form_type}</td>
                    <td className={adminTableTd}>{row.source}</td>
                    <td className={adminTableTd}>{new Date(row.created_at).toLocaleString()}</td>
                    <td className={adminTableTd}>
                      <div className="flex gap-2">
                        <button type="button" aria-label="View" onClick={() => setViewRow(row)}>
                          <Eye className="h-4 w-4" />
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
          <AdminTablePagination {...pagination} onPageChange={pagination.goToPage} />
        </>
      ) : null}

      <EntityDetailSheet
        open={Boolean(viewRow)}
        onOpenChange={(open) => !open && setViewRow(null)}
        title="Submission details"
      >
        {viewRow ? (
          <>
            <DetailField label="Email" value={viewRow.email} />
            <DetailField label="Form type" value={viewRow.form_type} />
            <DetailField label="Source" value={viewRow.source} />
            <DetailField label="Created" value={new Date(viewRow.created_at).toLocaleString()} />
            <DetailField
              label="Payload"
              value={
                <pre className="overflow-x-auto rounded-[var(--admin-radius)] bg-[var(--admin-surface-muted)] p-3 text-xs">
                  {JSON.stringify(viewRow.payload, null, 2)}
                </pre>
              }
            />
          </>
        ) : null}
      </EntityDetailSheet>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete submission"
        footer={
          <button type="button" className={adminBtnDanger} onClick={() => void confirmDelete()}>
            Delete
          </button>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Permanently delete this submission?</p>
      </AdminModal>
    </div>
  )
}
