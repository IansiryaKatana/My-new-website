import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { getSupabase } from '#/integrations/supabase/client'
import { AdminPageHeading } from './components/AdminPageHeading'

export function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [recent, setRecent] = useState<
    { id: string; name: string | null; email: string | null; created_at: string }[]
  >([])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return

    void (async () => {
      const [projects, principles, submissions] = await Promise.all([
        sb.from('portfolio_projects').select('id', { count: 'exact', head: true }),
        sb.from('principles').select('id', { count: 'exact', head: true }),
        sb
          .from('form_submissions')
          .select('id, name, email, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setCounts({
        projects: projects.count ?? 0,
        principles: principles.count ?? 0,
        submissions: submissions.data?.length ?? 0,
      })
      setRecent(submissions.data ?? [])
    })()
  }, [])

  return (
    <div>
      <AdminPageHeading
        title="Dashboard"
        description="Overview of your Valence Capital CMS content."
      />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Portfolio projects', value: counts.projects ?? 0 },
          { label: 'Principles', value: counts.principles ?? 0 },
          { label: 'Recent submissions', value: counts.submissions ?? 0 },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-lg border p-5">
            <p className="text-2xl font-semibold">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-medium">Recent submissions</h2>
          <Link to="/admin/submissions" className="text-sm text-blue-600">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-gray-500 py-6 text-center">
                    No submissions yet
                  </td>
                </tr>
              ) : (
                recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name ?? '—'}</td>
                    <td>{r.email ?? '—'}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
