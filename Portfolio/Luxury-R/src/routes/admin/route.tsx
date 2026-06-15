import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { AdminLayout } from '@/admin/AdminLayout'

export const Route = createFileRoute('/admin')({
  component: AdminRoute,
})

function AdminRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isLoginPage = pathname === '/admin/login'

  // Login must render outside the auth gate (otherwise layout returns null → blank screen)
  if (isLoginPage) {
    return <Outlet />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
