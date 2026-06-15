import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Settings,
  UsersRound,
  ListTodo,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type StatCardData = {
  title: string
  value: number
  trend?: string
  description: string
  highlighted?: boolean
}

export type ProjectItem = {
  title: string
  dueDate: string
  color: string
  accent: string
}

export type TeamMember = {
  name: string
  initials: string
  avatarClass: string
  task: string
  status: 'Completed' | 'In Progress' | 'Pending'
}

export type AppRoute =
  | '/'
  | '/tasks'
  | '/calendar'
  | '/analytics'
  | '/team'
  | '/settings'
  | '/help'
  | '/logout'

export type NavItem = {
  label: string
  icon: LucideIcon
  to: AppRoute
  badge?: string
}

export const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Tasks', icon: ListTodo, to: '/tasks', badge: '12+' },
  { label: 'Calendar', icon: CalendarDays, to: '/calendar' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Team', icon: UsersRound, to: '/team' },
]

export const generalNav: NavItem[] = [
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Help', icon: CircleHelp, to: '/help' },
  { label: 'Log out', icon: LogOut, to: '/logout' },
]

export const stats: StatCardData[] = [
  {
    title: 'Total Projects',
    value: 24,
    trend: '5%',
    description: 'Increased from last month',
    highlighted: true,
  },
  {
    title: 'Ended Projects',
    value: 10,
    trend: '5%',
    description: 'Increased from last month',
  },
  {
    title: 'Running Projects',
    value: 12,
    trend: '5%',
    description: 'Increased from last month',
  },
  {
    title: 'Pending Project',
    value: 2,
    description: 'On Discuss',
  },
]

export const analyticsBars = [
  { day: 'S', height: 56, type: 'hatched' },
  { day: 'M', height: 78, type: 'green' },
  { day: 'T', height: 64, type: 'light', label: '74%' },
  { day: 'W', height: 88, type: 'dark' },
  { day: 'T', height: 48, type: 'hatched' },
  { day: 'F', height: 66, type: 'hatched' },
  { day: 'S', height: 42, type: 'hatched' },
] as const

export const projects: ProjectItem[] = [
  {
    title: 'Develop API Endpoints',
    dueDate: 'Nov 26, 2024',
    color: 'bg-donezo-blue',
    accent: 'bg-[#8fb1ff]',
  },
  {
    title: 'Onboarding Flow',
    dueDate: 'Nov 28, 2024',
    color: 'bg-[#00a88f]',
    accent: 'bg-[#a7efe2]',
  },
  {
    title: 'Build Dashboard',
    dueDate: 'Nov 30, 2024',
    color: 'bg-donezo-yellow',
    accent: 'bg-[#fff1a6]',
  },
  {
    title: 'Optimize Page Load',
    dueDate: 'Dec 5, 2024',
    color: 'bg-[#f36b2d]',
    accent: 'bg-[#ffd0b8]',
  },
  {
    title: 'Cross-Browser Testing',
    dueDate: 'Dec 6, 2024',
    color: 'bg-donezo-purple',
    accent: 'bg-[#d8cdff]',
  },
]

export const teamMembers: TeamMember[] = [
  {
    name: 'Alexandra Deff',
    initials: 'AD',
    avatarClass: 'from-[#f9c9aa] to-[#df7f55]',
    task: 'Working on Github Repository',
    status: 'Completed',
  },
  {
    name: 'Edwin Adenike',
    initials: 'EA',
    avatarClass: 'from-[#b5d5ff] to-[#3a7be0]',
    task: 'Working on Integrate User Authentication System',
    status: 'In Progress',
  },
  {
    name: 'Isaac Oluwatemilorun',
    initials: 'IO',
    avatarClass: 'from-[#d9c7ff] to-[#7751d8]',
    task: 'Working on Develop Search and Filter Functionality',
    status: 'Pending',
  },
  {
    name: 'David Oshodi',
    initials: 'DO',
    avatarClass: 'from-[#b8f3d5] to-[#0f8a4b]',
    task: 'Working on Responsive Layout for Homepage',
    status: 'In Progress',
  },
]
