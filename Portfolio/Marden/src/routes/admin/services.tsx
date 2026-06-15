import { createFileRoute } from '@tanstack/react-router'
import { AdminServices } from '#/admin/AdminServices'

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
})
