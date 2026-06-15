import { createFileRoute } from '@tanstack/react-router'
import { AdminFaqs } from '@/admin/pages/FaqsPage'

export const Route = createFileRoute('/admin/faqs')({
  component: AdminFaqs,
})
