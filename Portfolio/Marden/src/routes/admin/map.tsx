import { createFileRoute } from '@tanstack/react-router'
import { AdminMap } from '#/admin/AdminMap'

export const Route = createFileRoute('/admin/map')({
  component: AdminMap,
})
