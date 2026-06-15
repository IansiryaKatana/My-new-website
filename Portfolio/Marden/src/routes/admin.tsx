import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { AdminLayout } from '#/admin/AdminLayout'

export const Route = createFileRoute('/admin')({
  component: AdminRoot,
})

function AdminRoot() {
  const { pathname } = useLocation()
  if (pathname === '/admin/login') {
    return <Outlet />
  }
  return <AdminLayout />
}
