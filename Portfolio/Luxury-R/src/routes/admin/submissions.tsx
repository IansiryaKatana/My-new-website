import { createFileRoute } from '@tanstack/react-router'
import { AdminSubmissions } from '@/admin/pages/SubmissionsPage'

export const Route = createFileRoute('/admin/submissions')({
  component: AdminSubmissions,
})
