import { createFileRoute } from '@tanstack/react-router'
import { AdminProperties } from '@/admin/AdminProperties'

export const Route = createFileRoute('/admin/properties')({
  component: AdminProperties,
})
