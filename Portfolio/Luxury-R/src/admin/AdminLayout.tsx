import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { isSupabaseConfigured } from '@/integrations/supabase/client'
import { AdminShell } from './AdminShell'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { configured, loading, session } = useAdminAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (pathname === '/admin/login') return
    if (!loading && session === null) {
      void navigate({ to: '/admin/login' })
    }
  }, [loading, session, navigate, pathname])

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2eee7] p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-medium">Supabase not configured</h1>
          <p className="mt-2 text-sm text-[#8b897f]">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file,
            run the migration in supabase/migrations, then restart the dev server.
          </p>
          <Link to="/" className="mt-6 inline-block text-sm underline">
            Back to site
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8b897f]">
        Loading session…
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2eee7] text-[#8b897f]">
        Redirecting to login…
      </div>
    )
  }

  return (
    <AdminShell>
      {children ?? <Outlet />}
    </AdminShell>
  )
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-sm text-[#8b897f]">Configure Supabase to use the admin.</p>
      </div>
    )
  }
  return children
}
