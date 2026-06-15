import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  MessageCircle,
} from 'lucide-react'

export type CareFlowRoute = {
  label: string
  to: '/' | '/calendar' | '/appointments' | '/chats' | '/statistics'
  icon: LucideIcon
}

export const careFlowRoutes: CareFlowRoute[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { label: 'Appointments', to: '/appointments', icon: CreditCard },
  { label: 'Chats', to: '/chats', icon: MessageCircle },
  { label: 'Statistics', to: '/statistics', icon: Activity },
]
