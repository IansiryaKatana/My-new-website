import { createFileRoute } from '@tanstack/react-router'
import { AdminSections } from '#/admin/AdminSections'

export const Route = createFileRoute('/admin/sections')({
  component: AdminSections,
})
