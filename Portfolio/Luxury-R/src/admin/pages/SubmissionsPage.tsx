import { useCallback, useEffect, useState } from 'react'
import type { Database } from '@/integrations/supabase/database.types'
import { getSupabase } from '@/integrations/supabase/client'
import { AdminPageHeading } from '../components/AdminPageHeading'
import { useAdminTablePagination } from '../useAdminTablePagination'
import { AdminTablePagination } from '../components/AdminTablePagination'

type Row = Database['public']['Tables']['form_submissions']['Row']

export function AdminSubmissions() {
  const [rows, setRows] = useState<Row[]>([])

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data ?? [])
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const { slice, page, setPage, totalPages, total } = useAdminTablePagination(rows)

  const remove = async (id: string) => {
    await getSupabase()?.from('form_submissions').delete().eq('id', id)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading title="Inbox" description="Contact form submissions" />
      <div className="overflow-x-auto border border-[#d8d2c7] bg-white">
        <table className="admin-table w-full min-w-[640px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Goal</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.goal}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>
                  <button type="button" className="text-xs text-red-700" onClick={() => void remove(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminTablePagination page={page} totalPages={totalPages} total={total} onPage={setPage} />
    </div>
  )
}
