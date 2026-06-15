import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '@/components/pages/WorkspacePages'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})
