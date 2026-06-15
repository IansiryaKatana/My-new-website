import { createFileRoute } from '@tanstack/react-router'
import { AdminTeam } from '@/admin/pages/TeamPage'

export const Route = createFileRoute('/admin/team')({
  component: AdminTeam,
})
