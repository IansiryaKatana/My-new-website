import { createFileRoute } from '@tanstack/react-router'
import { AdminMetrics } from '#/admin/AdminMetrics'

export const Route = createFileRoute('/admin/metrics')({
  component: AdminMetrics,
})
