import { createFileRoute } from '@tanstack/react-router'
import { AdminProcess } from '#/admin/AdminProcess'

export const Route = createFileRoute('/admin/process')({
  component: AdminProcess,
})
