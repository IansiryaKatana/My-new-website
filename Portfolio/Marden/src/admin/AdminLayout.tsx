import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { AdminShell } from './AdminShell'

export function AdminLayout() {
  const { configured, loading, session } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    if (!session && location.pathname !== '/admin/login') {
      void navigate({
        to: '/admin/login',
        search: { from: location.pathname },
      })
    }
  }, [loading, session, location.pathname, navigate])

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-lg font-semibold">Supabase not configured</h1>
          <p className="text-sm text-[var(--admin-muted)]">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to{' '}
            <code>.env</code>, run the migration in <code>supabase/migrations/</code>, then restart
            the dev server.
          </p>
          <Link to="/" className="text-sm text-[var(--admin-primary)] underline">
            Back to site
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm">Loading session…</div>
    )
  }

  if (!session) return null

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
