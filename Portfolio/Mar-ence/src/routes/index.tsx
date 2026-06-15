import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/components/landing/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
})
