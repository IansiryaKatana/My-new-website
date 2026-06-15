import { createFileRoute } from '@tanstack/react-router'
import { AdminNav } from '#/admin/AdminNav'

export const Route = createFileRoute('/admin/nav')({
  component: AdminNav,
})
