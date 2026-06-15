import { useEffect, useState } from 'react'
import { getSupabase } from '@/integrations/supabase/client'
import { AdminPageHeading } from './components/AdminPageHeading'

export function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [recent, setRecent] = useState<
    { name: string; phone: string; created_at: string }[]
  >([])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    void (async () => {
      const tables = [
        'properties',
        'testimonials',
        'team_members',
        'form_submissions',
      ] as const
      const next: Record<string, number> = {}
      for (const t of tables) {
        const { count } = await sb.from(t).select('*', { count: 'exact', head: true })
        next[t] = count ?? 0
      }
      setCounts(next)
      const { data } = await sb
        .from('form_submissions')
        .select('name, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecent(data ?? [])
    })()
  }, [])

  return (
    <div>
      <AdminPageHeading
        title="Dashboard"
        description="Overview of your luxury real estate CMS"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(counts).map(([k, v]) => (
          <div
            key={k}
            className="border border-[#d8d2c7] bg-white p-4"
          >
            <p className="text-xs uppercase tracking-wider text-[#8b897f]">
              {k.replace('_', ' ')}
            </p>
            <p className="mt-2 text-3xl font-light">{v}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-medium uppercase tracking-wider text-[#8b897f]">
        Recent inbox
      </h2>
      <div className="mt-4 overflow-x-auto border border-[#d8d2c7] bg-white">
        <table className="admin-table w-full min-w-[480px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={3} className="text-[#8b897f]">
                  No submissions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
