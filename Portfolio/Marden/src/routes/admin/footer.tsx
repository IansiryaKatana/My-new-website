import { createFileRoute } from '@tanstack/react-router'
import { AdminFooter } from '#/admin/AdminFooter'

export const Route = createFileRoute('/admin/footer')({
  component: AdminFooter,
})
