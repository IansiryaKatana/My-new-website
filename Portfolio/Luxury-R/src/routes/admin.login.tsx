import { createFileRoute } from '@tanstack/react-router'
import { AdminLogin } from '@/admin/AdminLogin'
import { AdminGate } from '@/admin/AdminLayout'

export const Route = createFileRoute('/admin/login')({
  component: () => (
    <AdminGate>
      <AdminLogin />
    </AdminGate>
  ),
})
