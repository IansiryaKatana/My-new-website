import { Navigate, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { AdminShell } from '../../admin/AdminShell'
import '../../admin/admin-theme.css'
import { canEditCms, useAdminAuth } from '../../contexts/AdminAuthContext'

export const Route = createFileRoute('/admin')({
  component: AdminLayoutRoute,
})

function AdminLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { configured, loading, session, adminUser } = useAdminAuth()

  if (pathname === '/admin/login') {
    return <Outlet />
  }

  if (!configured) {
    return <Navigate to="/admin/login" />
  }

  if (loading) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center">
        <p className="font-display uppercase tracking-[0.2em]">Loading...</p>
      </div>
    )
  }

  if (!session || !adminUser || !canEditCms(adminUser.role)) {
    return <Navigate to="/admin/login" />
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}

