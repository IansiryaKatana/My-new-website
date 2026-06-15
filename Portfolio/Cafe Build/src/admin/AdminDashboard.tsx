import { useCallback, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { getSupabase } from '#/integrations/supabase/client'
import { AdminPageHeading } from './components/AdminPageHeading'
import { adminCard } from './adminClassNames'

interface DashboardCounts {
  products: number
  benefits: number
  submissions: number
  media: number
}

export function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null)
  const [recentSubmissions, setRecentSubmissions] = useState<
    Array<{ id: string; email: string; created_at: string; source: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) {
      setError('Supabase is not configured.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [products, benefits, submissions, media, recent] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('benefits').select('id', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('cms_media').select('id', { count: 'exact', head: true }),
        supabase
          .from('form_submissions')
          .select('id, email, created_at, source')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setCounts({
        products: products.count ?? 0,
        benefits: benefits.count ?? 0,
        submissions: submissions.count ?? 0,
        media: media.count ?? 0,
      })
      setRecentSubmissions(recent.data ?? [])
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const statCards = [
    { label: 'Products', value: counts?.products ?? 0, to: '/admin/products' },
    { label: 'Benefits', value: counts?.benefits ?? 0, to: '/admin/benefits' },
    { label: 'Submissions', value: counts?.submissions ?? 0, to: '/admin/submissions' },
    { label: 'Media assets', value: counts?.media ?? 0, to: '/admin/media' },
  ]

  return (
    <div>
      <AdminPageHeading
        title="Dashboard"
        description="Overview of NGUNJUK content and recent newsletter signups."
        actions={
          <button
            type="button"
            className="text-sm font-medium text-[var(--admin-primary)]"
            onClick={() => void refresh()}
          >
            Refresh
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
        </div>
      ) : null}

      {error ? <p className="text-sm text-[var(--admin-danger)]">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <Link
                key={card.label}
                to={card.to}
                className={`${adminCard} block p-5 transition hover:-translate-y-0.5`}
              >
                <p className="text-sm text-[var(--admin-text-muted)]">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-[var(--admin-text)]">{card.value}</p>
              </Link>
            ))}
          </div>

          <section className={`${adminCard} mt-6 p-5`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--admin-text)]">Recent submissions</h2>
              <Link to="/admin/submissions" className="text-sm font-medium text-[var(--admin-primary)]">
                View all
              </Link>
            </div>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-muted)]">No submissions yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--admin-border)]">
                {recentSubmissions.map((row) => (
                  <li key={row.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-[var(--admin-text)]">{row.email}</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">{row.source}</p>
                    </div>
                    <time className="text-xs text-[var(--admin-text-muted)]">
                      {new Date(row.created_at).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  )
}
