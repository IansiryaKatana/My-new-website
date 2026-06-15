import { createFileRoute } from '@tanstack/react-router'
import { AdminNavigation } from '#/admin/AdminNavigation'

export const Route = createFileRoute('/admin/navigation')({
  component: AdminNavigation,
})
