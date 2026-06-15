import { createFileRoute } from '@tanstack/react-router'

import { TeamPage } from '@/components/pages/WorkspacePages'

export const Route = createFileRoute('/team')({
  component: TeamPage,
})
