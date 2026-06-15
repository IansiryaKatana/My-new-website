import { createFileRoute } from '@tanstack/react-router'

import { HelpPage } from '@/components/pages/WorkspacePages'

export const Route = createFileRoute('/help')({
  component: HelpPage,
})
