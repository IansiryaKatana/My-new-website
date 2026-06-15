import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { isSupabaseConfigured } from '#/integrations/supabase/client'
import { AdminShell } from '#/admin/AdminShell'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/admin/login') return
    if (!isSupabaseConfigured()) return
  },
  component: AdminLayoutRoute,
})

function AdminLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { session, loading, configured, ensureAdminRecord } = useAdminAuth()

  useEffect(() => {
    if (session) void ensureAdminRecord()
  }, [session, ensureAdminRecord])

  if (pathname === '/admin/login') {
    return <Outlet />
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 admin-root">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-xl font-semibold">CMS requires Supabase</h1>
          <p className="text-sm text-gray-600">
            Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then apply
            migrations in supabase/migrations.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-root">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  if (!session) {
    throw redirect({ to: '/admin/login' })
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
