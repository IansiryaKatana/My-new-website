import { createFileRoute } from '@tanstack/react-router'
import { AdminNavigation } from '#/admin/pages/AdminNavigation'

export const Route = createFileRoute('/admin/navigation')({
  component: AdminNavigation,
})
