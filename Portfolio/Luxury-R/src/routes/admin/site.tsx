import { createFileRoute } from '@tanstack/react-router'
import { AdminSiteSettings } from '@/admin/pages/SiteSettingsPage'

export const Route = createFileRoute('/admin/site')({
  component: AdminSiteSettings,
})
