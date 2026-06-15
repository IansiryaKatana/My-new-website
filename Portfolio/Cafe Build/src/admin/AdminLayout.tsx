import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { isSupabaseConfigured } from '#/integrations/supabase/client'
import { AdminShell } from './AdminShell'
import '../admin/admin-theme.css'

export function AdminLayout() {
  const { session, loading, ensureCurrentUserRecord } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoginRoute = location.pathname === '/admin/login'

  useEffect(() => {
    if (loading || isLoginRoute) return
    if (!session) {
      void navigate({
        to: '/admin/login',
        search: { from: location.pathname },
      })
    }
  }, [loading, session, isLoginRoute, navigate, location.pathname])

  useEffect(() => {
    if (session && !isLoginRoute) {
      void ensureCurrentUserRecord()
    }
  }, [session, isLoginRoute, ensureCurrentUserRecord])

  if (isLoginRoute) {
    return (
      <div className="admin-root">
        <Outlet />
      </div>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] p-6 text-center">
          <h1 className="text-xl font-bold text-[var(--admin-text)]">Supabase not configured</h1>
          <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment to use the admin CMS.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="admin-root">
      <AdminShell>
        <Outlet />
      </AdminShell>
    </div>
  )
}
