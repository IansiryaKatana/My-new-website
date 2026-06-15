import { createFileRoute } from '@tanstack/react-router'

import { TasksPage } from '@/components/pages/WorkspacePages'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})
