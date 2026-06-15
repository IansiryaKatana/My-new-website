import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { getSupabase } from '../integrations/supabase/client'
import { AdminPageHeading } from './components/AdminPageHeading'

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    submissions: 0,
    media: 0,
  })
  const [recent, setRecent] = useState<
    Array<{ id: string; name: string; email: string; created_at: string }>
  >([])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return

    void (async () => {
      const [p, s, m, inbox] = await Promise.all([
        sb.from('projects').select('*', { count: 'exact', head: true }),
        sb.from('form_submissions').select('*', { count: 'exact', head: true }),
        sb.from('cms_media').select('*', { count: 'exact', head: true }),
        sb
          .from('form_submissions')
          .select('id, name, email, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])
      setCounts({
        projects: p.count ?? 0,
        submissions: s.count ?? 0,
        media: m.count ?? 0,
      })
      setRecent(inbox.data ?? [])
    })()
  }, [])

  return (
    <div>
      <AdminPageHeading
        title="Dashboard"
        description="Overview of portfolio content and recent inquiries."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Projects', value: counts.projects, to: '/admin/projects' },
          { label: 'Inbox', value: counts.submissions, to: '/admin/submissions' },
          { label: 'Media', value: counts.media, to: '/admin/media' },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="border border-[var(--admin-cream)]/20 bg-[var(--admin-surface)] p-6 transition-colors hover:border-[var(--admin-cream)]/40"
          >
            <p className="font-display text-xs uppercase tracking-[0.18em] text-[var(--admin-cream)]/60">
              {card.label}
            </p>
            <p className="mt-2 font-display text-5xl font-black text-[var(--admin-cream)]">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-black uppercase text-[var(--admin-fg)]">Recent inbox</h2>
        {recent.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-[var(--admin-fg-muted)]">No submissions yet.</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {recent.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 border border-[var(--admin-border-subtle)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-display uppercase text-[var(--admin-fg)]">{row.name}</span>
                <span className="font-sans text-sm text-[var(--admin-fg-muted)]">{row.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

