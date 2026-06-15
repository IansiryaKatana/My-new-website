import { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { getSupabase } from '#/integrations/supabase/client'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { useAdminTablePagination } from './useAdminTablePagination'
import { AdminTablePagination } from './components/AdminTablePagination'

type Row = Database['public']['Tables']['form_submissions']['Row']

export function AdminSubmissions() {
  const [rows, setRows] = useState<Row[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('form_submissions').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function confirmDelete() {
    if (!deleteId) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('form_submissions').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading title="Inbox" description="Contact and form submissions." />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pagination.slice.map((row) => (
              <tr key={row.id}>
                <td>{row.name ?? '—'}</td>
                <td>{row.email ?? '—'}</td>
                <td>{row.status}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td>
                  <button type="button" onClick={() => setDeleteId(row.id)}>
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
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete submission?"
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
      >
        <p className="text-sm">Permanent delete.</p>
      </AdminModal>
    </div>
  )
}
