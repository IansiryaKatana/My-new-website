import { createFileRoute } from '@tanstack/react-router'
import { AdminSubmissions } from '#/admin/pages/AdminSubmissions'

export const Route = createFileRoute('/admin/submissions')({
  component: AdminSubmissions,
})
