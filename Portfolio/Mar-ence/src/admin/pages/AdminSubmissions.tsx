import { useCallback, useEffect, useState } from 'react'
import { getSupabase } from '#/integrations/supabase/client'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminPageHeading } from '../components/AdminPageHeading'
import { AdminTablePagination } from '../components/AdminTablePagination'
import { useAdminTablePagination } from '../useAdminTablePagination'
import { Button } from '#/components/ui/button'

type Row = Database['public']['Tables']['form_submissions']['Row']

export function AdminSubmissions() {
  const [rows, setRows] = useState<Row[]>([])
  const [view, setView] = useState<Row | null>(null)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data ?? [])
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const { slice, page, pageCount, total, setPage } = useAdminTablePagination(rows)

  async function remove(id: string) {
    const sb = getSupabase()
    if (!sb) return
    await sb.from('form_submissions').delete().eq('id', id)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading
        title="Form submissions"
        description="Opportunity and contact form leads."
      />
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id}>
                <td>{r.form_type}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td className="space-x-2 whitespace-nowrap">
                  <button
                    type="button"
                    className="text-sm text-blue-600"
                    onClick={() => setView(r)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => void remove(r.id)}
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

      {view && (
        <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setView(null)}
            aria-label="Close"
          />
          <div className="relative bg-white w-full md:max-w-md md:h-full p-6 overflow-y-auto rounded-t-xl md:rounded-none mb-0">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Submission</h2>
              <button type="button" onClick={() => setView(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <dl className="text-sm space-y-2">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd>{view.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd>{view.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Company</dt>
                <dd>{view.company ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Message</dt>
                <dd className="whitespace-pre-wrap">{view.message ?? '—'}</dd>
              </div>
            </dl>
            <Button
              type="button"
              variant="outline"
              className="mt-6 w-full"
              onClick={() => setView(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
