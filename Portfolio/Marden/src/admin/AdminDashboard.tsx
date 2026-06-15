import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getSupabase } from '#/integrations/supabase/client'
import { AdminPageHeading } from './components/AdminPageHeading'

export function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [recent, setRecent] = useState<{ id: string; name: string | null; email: string | null; created_at: string }[]>([])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    void (async () => {
      const [projects, services, submissions] = await Promise.all([
        sb.from('projects').select('id', { count: 'exact', head: true }),
        sb.from('services').select('id', { count: 'exact', head: true }),
        sb.from('form_submissions').select('id', { count: 'exact', head: true }),
      ])
      setCounts({
        projects: projects.count ?? 0,
        services: services.count ?? 0,
        submissions: submissions.count ?? 0,
      })
      const { data } = await sb
        .from('form_submissions')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecent(data ?? [])
    })()
  }, [])

  return (
    <div>
      <AdminPageHeading
        title="Dashboard"
        description="Overview of your Marden Energy CMS content."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Projects', value: counts.projects ?? 0, to: '/admin/projects' },
          { label: 'Services', value: counts.services ?? 0, to: '/admin/services' },
          { label: 'Inbox', value: counts.submissions ?? 0, to: '/admin/submissions' },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white p-5 transition hover:border-[var(--admin-primary)]"
          >
            <p className="text-sm text-[var(--admin-muted)]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium">Recent submissions</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
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
                  <td colSpan={3} className="text-[var(--admin-muted)]">
                    No submissions yet
                  </td>
                </tr>
              ) : (
                recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name ?? '-'}</td>
                    <td>{r.email ?? '-'}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
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
