import { createFileRoute } from '@tanstack/react-router'
import { AdminProcess } from '@/admin/pages/ProcessPage'

export const Route = createFileRoute('/admin/process')({
  component: AdminProcess,
})
