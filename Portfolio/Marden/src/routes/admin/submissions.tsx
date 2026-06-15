import { createFileRoute } from '@tanstack/react-router'
import { AdminSubmissions } from '#/admin/AdminSubmissions'

export const Route = createFileRoute('/admin/submissions')({
  component: AdminSubmissions,
})
