import { createFileRoute } from '@tanstack/react-router'

import { LogoutPage } from '@/components/pages/WorkspacePages'

export const Route = createFileRoute('/logout')({
  component: LogoutPage,
})
