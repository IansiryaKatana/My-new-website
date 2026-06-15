import { useEffect, useState } from 'react'

import { getSupabase } from '../integrations/supabase/client'
import { formatPhoneDisplay } from '../lib/phone/formatPhone'
import type { Tables } from '../integrations/supabase/database.types'
import {
  adminBtn,
  adminBtnDanger,
  adminTable,
  adminTd,
  adminTh,
} from './adminClassNames'
import { AdminConfirmDialog } from './components/AdminConfirmDialog'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Tables<'form_submissions'>

export function AdminSubmissions() {
  const [rows, setRows] = useState<Row[]>([])
  const [viewRow, setViewRow] = useState<Row | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pagination = useAdminTablePagination(rows)

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function confirmDelete() {
    if (!deleteId) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('form_submissions').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
  }

  function exportCsv() {
    const header = ['name', 'email', 'phone', 'company', 'message', 'created_at']
    const lines = rows.map((r) =>
      [r.name, r.email, r.phone ?? '', r.company ?? '', r.message, r.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    )
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'submissions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <AdminPageHeading
        title="Inbox"
        description="Contact form submissions from the public site."
        actions={
          <button type="button" className={adminBtn} onClick={exportCsv}>
            Export CSV
          </button>
        }
      />
      <div className="overflow-x-auto">
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTh}>Name</th>
              <th className={adminTh}>Email</th>
              <th className={adminTh}>Phone</th>
              <th className={adminTh}>Date</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.slice.map((row) => (
              <tr key={row.id}>
                <td className={adminTd}>{row.name}</td>
                <td className={adminTd}>{row.email}</td>
                <td className={adminTd}>{row.phone ? formatPhoneDisplay(row.phone) : '—'}</td>
                <td className={adminTd}>{new Date(row.created_at).toLocaleString()}</td>
                <td className={adminTd}>
                  <button type="button" className={adminBtn} onClick={() => setViewRow(row)}>View</button>
                  <button
                    type="button"
                    className={`${adminBtnDanger} ml-2`}
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
      <AdminTablePagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} />

      <AdminModal
        open={Boolean(viewRow)}
        onOpenChange={() => setViewRow(null)}
        title="Submission"
        footer={
          <button type="button" className={adminBtn} onClick={() => setViewRow(null)}>
            Close
          </button>
        }
      >
        {viewRow ? (
          <div className="grid gap-3 font-sans text-sm">
            <p><strong>Name:</strong> {viewRow.name}</p>
            <p><strong>Email:</strong> {viewRow.email}</p>
            {viewRow.phone ? <p><strong>Phone:</strong> {formatPhoneDisplay(viewRow.phone)}</p> : null}
            {viewRow.company ? <p><strong>Company:</strong> {viewRow.company}</p> : null}
            <p className="whitespace-pre-wrap"><strong>Message:</strong><br />{viewRow.message}</p>
          </div>
        ) : null}
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete submission?"
        description="This inquiry will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

