import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { analyticsBars, teamMembers } from '@/components/dashboard/data'

const taskColumns = [
  {
    title: 'Backlog',
    count: 4,
    accent: 'bg-[#ffe1e5] text-donezo-red',
    tasks: [
      ['Draft permission map', 'Product Ops', 'High'],
      ['Audit notification copy', 'Marketing', 'Medium'],
      ['Review mobile app card', 'Design', 'Low'],
    ],
  },
  {
    title: 'In Progress',
    count: 5,
    accent: 'bg-[#fff4c7] text-[#9a7515]',
    tasks: [
      ['Integrate user authentication', 'Engineering', 'High'],
      ['Build responsive task rows', 'Frontend', 'Medium'],
      ['Prepare QA checklist', 'QA', 'Medium'],
    ],
  },
  {
    title: 'Completed',
    count: 12,
    accent: 'bg-donezo-pale text-donezo-green',
    tasks: [
      ['Create dashboard shell', 'Frontend', 'Done'],
      ['Define project dummy data', 'Product Ops', 'Done'],
      ['Finalize chart styling', 'Design', 'Done'],
    ],
  },
]

const calendarDays = [
  ['Mon', '25', 'Sprint planning'],
  ['Tue', '26', 'Design review'],
  ['Wed', '27', 'API sync'],
  ['Thu', '28', 'Team retro'],
  ['Fri', '29', 'Release prep'],
  ['Sat', '30', 'Focus block'],
  ['Sun', '31', 'Review notes'],
]

const analyticsMetrics = [
  ['Task velocity', '86%', '+12% this week'],
  ['Focus time', '42h', '+6h from last week'],
  ['Team capacity', '74%', 'Healthy workload'],
  ['Cycle time', '2.8d', '-0.7d faster'],
]

const helpTopics = [
  ['Getting started', 'Set up projects, tasks, team members, and notifications.'],
  ['Project permissions', 'Understand owner, editor, viewer, and guest access.'],
  ['Time tracking', 'Start, pause, and report active work sessions.'],
  ['Dashboard reports', 'Export analytics and weekly progress summaries.'],
]

export function TasksPage() {
  return (
    <AppShell
      title="Tasks"
      subtitle="Organize active work, owners, priority, and delivery status."
      actions={
        <>
          <Button>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </>
      }
    >
      <MetricGrid
        items={[
          ['Open Tasks', '21', '12 high priority'],
          ['Due Today', '6', '3 ready for review'],
          ['Blocked', '2', 'Needs attention'],
          ['Completed', '12', 'This sprint'],
        ]}
      />
      <section className="mt-3 grid gap-3 xl:grid-cols-3">
        {taskColumns.map((column, index) => (
          <Card key={column.title} className="reveal-up min-h-[360px]" style={{ animationDelay: `${220 + index * 70}ms` }}>
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
              <span className={cn('rounded-xl px-2 py-1 text-[10px] font-semibold', column.accent)}>
                {column.count} tasks
              </span>
            </CardHeader>
            <div className="space-y-3">
              {column.tasks.map(([title, owner, priority]) => (
                <div key={title} className="rounded-2xl border border-donezo-border bg-donezo-shell p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-donezo-ink">{title}</p>
                      <p className="mt-1 text-[11px] text-donezo-muted">{owner}</p>
                    </div>
                    <span className="rounded-xl bg-white px-2 py-1 text-[10px] font-semibold text-donezo-green">
                      {priority}
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white">
                    <span className="block h-full w-2/3 rounded-full bg-donezo-accent" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </AppShell>
  )
}

export function CalendarPage() {
  return (
    <AppShell
      title="Calendar"
      subtitle="See project milestones, meetings, and focus sessions in one place."
      actions={
        <>
          <Button>
            <CalendarDays className="h-4 w-4" />
            New Event
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      <section className="mt-5 grid gap-3 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="reveal-up min-h-[420px]">
          <CardHeader>
            <CardTitle>May 2026</CardTitle>
            <span className="text-xs font-semibold text-donezo-muted">Week overview</span>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            {calendarDays.map(([day, date, event], index) => (
              <div
                key={date}
                className={cn(
                  'min-h-[180px] rounded-2xl border border-donezo-border bg-donezo-shell p-3',
                  index === 1 && 'border-donezo-accent bg-donezo-pale',
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-donezo-muted">{day}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">{date}</p>
                <div className="mt-8 rounded-xl bg-white p-2 text-[11px] font-semibold text-donezo-ink shadow-card">
                  {event}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="reveal-up [animation-delay:280ms]">
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <Button variant="soft" size="sm">View All</Button>
          </CardHeader>
          <AgendaItem time="10:00 AM" title="Design review with Marcian team" />
          <AgendaItem time="12:30 PM" title="API endpoint handoff" />
          <AgendaItem time="02:00 PM" title="Meeting with Arc Company" />
          <AgendaItem time="04:30 PM" title="Sprint risk review" />
        </Card>
      </section>
    </AppShell>
  )
}

export function AnalyticsPage() {
  return (
    <AppShell
      title="Analytics"
      subtitle="Track delivery health, workload balance, and team productivity trends."
      actions={
        <>
          <Button>
            <Sparkles className="h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Configure
          </Button>
        </>
      }
    >
      <MetricGrid items={analyticsMetrics} />
      <section className="mt-3 grid gap-3 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="reveal-up min-h-[360px]">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <span className="text-xs font-semibold text-donezo-muted">7 day trend</span>
          </CardHeader>
          <div className="flex h-[280px] items-end justify-between gap-4 pt-6">
            {analyticsBars.map((bar, index) => (
              <div key={`${bar.day}-${index}`} className="flex h-full flex-1 flex-col items-center gap-2">
                <span
                  className={cn(
                    'bar-grow w-full max-w-[64px] rounded-t-2xl',
                    bar.type === 'dark' && 'bg-donezo-forest',
                    bar.type === 'green' && 'bg-donezo-accent',
                    bar.type === 'light' && 'bg-[#92d7ad]',
                    bar.type === 'hatched' && 'hatched',
                  )}
                  style={{ height: `${bar.height}%` }}
                />
                <span className="text-[10px] font-semibold text-donezo-muted">{bar.day}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="dark-pattern reveal-up min-h-[360px] text-white [animation-delay:260ms]">
          <CardTitle className="text-white">Productivity Insight</CardTitle>
          <p className="mt-8 text-5xl font-semibold tracking-[-0.06em]">74%</p>
          <p className="mt-3 max-w-[260px] text-sm leading-6 text-white/70">
            Team throughput is healthy. Two blocked tasks need project manager attention before end of day.
          </p>
          <Button className="mt-8 bg-white text-donezo-green hover:bg-donezo-pale">
            Open Insights
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Card>
      </section>
    </AppShell>
  )
}

export function TeamPage() {
  return (
    <AppShell
      title="Team"
      subtitle="Coordinate people, roles, assignments, and workload across projects."
      actions={
        <>
          <Button>
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4" />
            Invite
          </Button>
        </>
      }
    >
      <section className="mt-5 grid gap-3 xl:grid-cols-[1.3fr_0.8fr]">
        <Card className="reveal-up">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <span className="rounded-xl bg-donezo-pale px-2 py-1 text-[10px] font-semibold text-donezo-green">4 active</span>
          </CardHeader>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="grid gap-3 rounded-2xl bg-donezo-shell p-3 sm:grid-cols-[44px_1fr_auto] sm:items-center">
                <div className={cn('grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-white', member.avatarClass)}>
                  {member.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{member.name}</p>
                  <p className="mt-1 text-[11px] text-donezo-muted">{member.task}</p>
                </div>
                <span className="rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-donezo-green">{member.status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="reveal-up [animation-delay:260ms]">
          <CardHeader>
            <CardTitle>Workload</CardTitle>
            <UsersRound className="h-4 w-4 text-donezo-muted" />
          </CardHeader>
          {['Engineering 82%', 'Design 69%', 'Product Ops 74%', 'QA 58%'].map((item) => {
            const [label, value] = item.split(' ')
            const percent = Number.parseInt(value)
            return (
              <div key={item} className="mb-4">
                <div className="mb-2 flex justify-between text-xs font-semibold">
                  <span>{label}</span>
                  <span className="text-donezo-muted">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-donezo-bg">
                  <span className="block h-full rounded-full bg-donezo-accent" style={{ width: `${percent}%` }} />
                </div>
              </div>
            )
          })}
        </Card>
      </section>
    </AppShell>
  )
}

export function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      subtitle="Manage profile, workspace preferences, notifications, and security."
      actions={
        <>
          <Button>Save Changes</Button>
          <Button variant="outline">Reset</Button>
        </>
      }
    >
      <section className="mt-5 grid gap-3 xl:grid-cols-[1fr_0.8fr]">
        <Card className="reveal-up">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <ShieldCheck className="h-4 w-4 text-donezo-green" />
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value="Marcel Thoya" required />
            <Field label="Email address" value="MarcelThoya@gmail.com" type="email" required />
            <Field label="Role" value="Project Manager" />
            <Field label="Workspace" value="Marcian Operations" />
          </div>
        </Card>
        <Card className="reveal-up [animation-delay:260ms]">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <SlidersHorizontal className="h-4 w-4 text-donezo-muted" />
          </CardHeader>
          <Preference title="Email notifications" enabled />
          <Preference title="Weekly summary" enabled />
          <Preference title="Focus mode reminders" enabled />
          <Preference title="Public profile" />
        </Card>
      </section>
    </AppShell>
  )
}

export function HelpPage() {
  return (
    <AppShell
      title="Help"
      subtitle="Find product guidance, support paths, and onboarding resources."
      actions={
        <>
          <Button>
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </Button>
          <Button variant="outline">
            <LifeBuoy className="h-4 w-4" />
            Docs
          </Button>
        </>
      }
    >
      <section className="mt-5 grid gap-3 xl:grid-cols-[0.9fr_1.2fr]">
        <Card className="dark-pattern reveal-up min-h-[300px] text-white">
          <CardTitle className="text-white">Marcian Support</CardTitle>
          <p className="mt-8 max-w-[320px] text-sm leading-6 text-white/70">
            Get help with projects, task workflows, team access, analytics, and time tracking.
          </p>
          <Button className="mt-8 bg-white text-donezo-green hover:bg-donezo-pale">
            Start a Chat
          </Button>
        </Card>
        <Card className="reveal-up [animation-delay:260ms]">
          <CardHeader>
            <CardTitle>Popular Topics</CardTitle>
            <span className="text-xs font-semibold text-donezo-muted">Dummy help records</span>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {helpTopics.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-donezo-border bg-donezo-shell p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-xs leading-5 text-donezo-muted">{body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  )
}

export function LogoutPage() {
  return (
    <AppShell
      title="Log out"
      subtitle="Review your active session before leaving the Marcian workspace."
      actions={
        <>
          <Button variant="destructive">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
          <Button variant="outline">Stay Signed In</Button>
        </>
      }
    >
      <section className="mt-5 grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="dark-pattern reveal-up min-h-[280px] text-white">
          <CardTitle className="text-white">Session Summary</CardTitle>
          <p className="mt-8 text-4xl font-semibold tracking-[-0.05em]">01:24:08</p>
          <p className="mt-3 text-sm text-white/70">Active focus timer will pause when you log out.</p>
        </Card>
        <Card className="reveal-up [animation-delay:260ms]">
          <CardHeader>
            <CardTitle>Before you go</CardTitle>
            <Lock className="h-4 w-4 text-donezo-muted" />
          </CardHeader>
          <ChecklistItem text="12 tasks were completed this sprint." />
          <ChecklistItem text="2 pending project discussions remain open." />
          <ChecklistItem text="Marcel Thoya is signed in as Project Manager." />
          <ChecklistItem text="All dummy workspace records remain available after logout." />
        </Card>
      </section>
    </AppShell>
  )
}

function MetricGrid({ items }: { items: string[][] }) {
  return (
    <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value, description], index) => (
        <Card key={label} className="reveal-up min-h-[112px]" style={{ animationDelay: `${180 + index * 50}ms` }}>
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-semibold">{label}</p>
            <ArrowUpRight className="h-4 w-4 text-donezo-muted" />
          </div>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{value}</p>
          <p className="mt-2 text-[11px] text-donezo-muted">{description}</p>
        </Card>
      ))}
    </section>
  )
}

function AgendaItem({ time, title }: { time: string; title: string }) {
  return (
    <div className="mb-3 flex gap-3 rounded-2xl bg-donezo-shell p-3">
      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-donezo-green" />
      <div>
        <p className="text-[11px] font-semibold text-donezo-muted">{time}</p>
        <p className="mt-1 text-sm font-semibold">{title}</p>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  type = 'text',
  required,
}: {
  label: string
  value: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-donezo-muted">
        {label} {required ? <span className="text-donezo-red">*</span> : null}
      </span>
      <Input type={type} defaultValue={value} required={required} />
    </label>
  )
}

function Preference({ title, enabled = false }: { title: string; enabled?: boolean }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl bg-donezo-shell p-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-[11px] text-donezo-muted">{enabled ? 'Enabled' : 'Disabled'}</p>
      </div>
      <span className={cn('relative h-7 w-12 rounded-xl p-1', enabled ? 'bg-donezo-green' : 'bg-donezo-border')}>
        <span className={cn('block h-5 w-5 rounded-lg bg-white transition-transform', enabled && 'translate-x-5')} />
      </span>
    </div>
  )
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-2xl bg-donezo-shell p-3">
      <CheckCircle2 className="h-4 w-4 text-donezo-green" />
      <p className="text-sm font-semibold">{text}</p>
    </div>
  )
}
