import { createFileRoute } from '@tanstack/react-router'
import { SchwartzLanding } from '@/components/schwartz-landing'

export const Route = createFileRoute('/')({
  component: SchwartzLanding,
})
