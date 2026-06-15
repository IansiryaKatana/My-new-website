import { createFileRoute } from '@tanstack/react-router'
import { AdminSite } from '#/admin/AdminSite'

export const Route = createFileRoute('/admin/site')({
  component: AdminSite,
})
