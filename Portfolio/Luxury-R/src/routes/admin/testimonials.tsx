import { createFileRoute } from '@tanstack/react-router'
import { AdminTestimonials } from '@/admin/pages/TestimonialsPage'

export const Route = createFileRoute('/admin/testimonials')({
  component: AdminTestimonials,
})
