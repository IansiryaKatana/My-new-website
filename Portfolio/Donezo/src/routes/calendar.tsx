import { createFileRoute } from '@tanstack/react-router'

import { CalendarPage } from '@/components/pages/WorkspacePages'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
})
