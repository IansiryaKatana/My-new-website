import * as React from 'react'
import {
  ArrowUpRight,
  Pause,
  Plus,
  Square,
  Video,
} from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  analyticsBars,
  projects,
  stats,
  teamMembers,
  type StatCardData,
  type TeamMember,
} from './data'

function useCountUp(value: number, duration = 1000) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let frame = 0
    let start: number | null = null

    const tick = (timestamp: number) => {
      start ??= timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(value * eased))

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    frame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frame)
  }, [duration, value])

  return count
}

export function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Plan, prioritize, and accomplish your tasks with ease."
      actions={
        <>
        <Button>
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
        <Button variant="outline">Import Data</Button>
        </>
      }
    >
      <StatsGrid />
      <DashboardGrid />
    </AppShell>
  )
}

function StatsGrid() {
  return (
    <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} delay={180 + index * 60} />
      ))}
    </section>
  )
}

function StatCard({ stat, delay }: { stat: StatCardData; delay: number }) {
  const value = useCountUp(stat.value, 1000)

  return (
    <Card
      className={cn(
        'reveal-up min-h-[112px] p-4',
        stat.highlighted && 'dark-pattern bg-donezo-green text-white',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              'text-[13px] font-semibold',
              stat.highlighted ? 'text-white' : 'text-donezo-ink',
            )}
          >
            {stat.title}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-4xl font-semibold tracking-[-0.05em]">{value}</p>
            {stat.trend ? (
              <span
                className={cn(
                  'rounded-full border px-1.5 py-0.5 text-[9px] font-semibold',
                  stat.highlighted
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-donezo-pale text-donezo-accent',
                )}
              >
                {stat.trend}
              </span>
            ) : null}
          </div>
        </div>
        <Button
          variant={stat.highlighted ? 'soft' : 'ghost'}
          size="circle"
          aria-label={`Open ${stat.title}`}
          className={cn(
            'transition-transform hover:translate-x-0.5 hover:-translate-y-0.5',
            stat.highlighted && 'bg-white/15 text-white hover:bg-white/25',
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
      <p
        className={cn(
          'mt-2 text-[11px]',
          stat.highlighted ? 'text-white/65' : 'text-donezo-muted',
        )}
      >
        {stat.description}
      </p>
    </Card>
  )
}

function DashboardGrid() {
  return (
    <section className="mt-3 grid gap-3 xl:grid-cols-[1.55fr_1fr_0.9fr]">
      <ReminderCard className="order-1 xl:order-2" />
      <ProjectAnalyticsCard className="order-2 xl:order-1" />
      <ProjectListCard className="order-4 xl:order-3" />
      <ProjectProgressCard className="order-3 xl:order-5" />
      <TeamCollaborationCard className="order-5 xl:order-4" />
      <TimeTrackerCard className="order-6 xl:order-6" />
    </section>
  )
}

function ProjectAnalyticsCard({ className }: { className?: string }) {
  const barColor = {
    green: 'bg-donezo-accent',
    light: 'bg-[#92d7ad]',
    dark: 'bg-donezo-forest',
    hatched: 'hatched',
  } as const

  return (
    <Card className={cn('reveal-up flex min-h-[150px] flex-col [animation-delay:360ms]', className)}>
      <CardHeader>
        <CardTitle>Project Analytics</CardTitle>
      </CardHeader>
      <div className="flex min-h-[150px] flex-1 items-end justify-between gap-3 px-1 pt-5">
        {analyticsBars.map((bar, index) => (
          <div key={`${bar.day}-${index}`} className="flex h-full flex-1 flex-col items-center gap-2">
            <div className="relative flex min-h-0 flex-1 items-end w-full max-w-[48px]">
              {'label' in bar ? (
                <span
                  className="absolute left-1/2 z-10 -translate-x-1/2 rounded-xl bg-donezo-forest px-1.5 py-0.5 text-[9px] font-semibold text-white"
                  style={{ bottom: `calc(${bar.height}% + 4px)` }}
                >
                  {bar.label}
                </span>
              ) : null}
              <span
                className={cn('bar-grow block w-full rounded-t-[13px]', barColor[bar.type])}
                style={{
                  height: `${bar.height}%`,
                  animationDelay: `${420 + index * 60}ms`,
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-donezo-muted">{bar.day}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ReminderCard({ className }: { className?: string }) {
  return (
    <Card className={cn('reveal-up flex min-h-[150px] flex-col [animation-delay:420ms]', className)}>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
      </CardHeader>
      <p className="max-w-[190px] text-lg font-medium leading-tight tracking-[-0.03em]">
        Meeting with Arc Company
      </p>
      <p className="mt-2 text-[11px] text-donezo-muted">Time : 02.00 pm - 04.00 pm</p>
      <Button className="mt-auto w-full">
        <Video className="h-4 w-4" />
        Start Meeting
      </Button>
    </Card>
  )
}

function ProjectListCard({ className }: { className?: string }) {
  return (
    <Card className={cn('reveal-up [animation-delay:480ms]', className)}>
      <CardHeader>
        <CardTitle>Project</CardTitle>
        <Button variant="soft" size="sm">
          <Plus className="h-3 w-3" />
          New
        </Button>
      </CardHeader>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.title} className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-donezo-bg">
            <ProjectGlyph color={project.color} accent={project.accent} />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-donezo-ink">{project.title}</p>
              <p className="mt-0.5 text-[9px] text-donezo-muted">Due date: {project.dueDate}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ProjectGlyph({ color, accent }: { color: string; accent: string }) {
  return (
    <span className={cn('relative h-7 w-7 shrink-0 rounded-lg', accent)}>
      <span className={cn('absolute left-1.5 top-1.5 h-3 w-3 rounded-full', color)} />
      <span className={cn('absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-sm', color)} />
    </span>
  )
}

function TeamCollaborationCard({ className }: { className?: string }) {
  return (
    <Card className={cn('reveal-up [animation-delay:540ms]', className)}>
      <CardHeader>
        <CardTitle>Team Collaboration</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-3 w-3" />
          Add Member
        </Button>
      </CardHeader>
      <div className="space-y-2.5">
        {teamMembers.map((member) => (
          <TeamRow key={member.name} member={member} />
        ))}
      </div>
    </Card>
  )
}

function TeamRow({ member }: { member: TeamMember }) {
  const statusClass = {
    Completed: 'bg-donezo-pale text-donezo-green',
    'In Progress': 'bg-[#fff4c7] text-[#9a7515]',
    Pending: 'bg-[#ffe1e5] text-donezo-red',
  }[member.status]

  return (
    <div className="grid grid-cols-[36px_1fr_auto] items-center gap-2 rounded-xl transition-colors hover:bg-donezo-bg">
      <div
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
          member.avatarClass,
        )}
        aria-hidden="true"
      >
        {member.initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-donezo-ink">{member.name}</p>
        <p className="truncate text-[9px] text-donezo-muted">{member.task}</p>
      </div>
      <span className={cn('rounded-full px-2 py-1 text-[9px] font-semibold', statusClass)}>
        {member.status}
      </span>
    </div>
  )
}

function ProjectProgressCard({ className }: { className?: string }) {
  const percent = useCountUp(41, 900)

  return (
    <Card className={cn('reveal-up min-h-[185px] [animation-delay:600ms]', className)}>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <div className="flex flex-col items-center">
        <div className="relative h-[108px] w-[220px] max-w-full">
          <svg viewBox="0 0 220 120" className="h-full w-full" role="img" aria-label="Project progress 41 percent">
            <defs>
              <pattern id="pending-stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="#eef2ee" />
                <rect width="2" height="8" fill="#9b9b9b" />
              </pattern>
            </defs>
            <path d="M 24 108 A 86 86 0 0 1 196 108" fill="none" stroke="#edf2ee" strokeWidth="22" strokeLinecap="round" />
            <path
              d="M 24 108 A 86 86 0 0 1 196 108"
              fill="none"
              stroke="#0f8a4b"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray="112 270"
              className="draw-arc"
            />
            <path
              d="M 24 108 A 86 86 0 0 1 196 108"
              fill="none"
              stroke="#003b24"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray="56 270"
              strokeDashoffset="-112"
              className="draw-arc"
            />
            <path
              d="M 24 108 A 86 86 0 0 1 196 108"
              fill="none"
              stroke="url(#pending-stripes)"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray="46 270"
              strokeDashoffset="-168"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 text-center">
            <p className="text-3xl font-semibold tracking-[-0.05em]">{percent}%</p>
            <p className="text-[10px] text-donezo-muted">Project Ended</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-[9px] text-donezo-muted">
          <LegendItem color="bg-donezo-accent" label="Completed" />
          <LegendItem color="bg-donezo-forest" label="In Progress" />
          <LegendItem color="hatched" label="Pending" />
        </div>
      </div>
    </Card>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  )
}

function TimeTrackerCard({ className }: { className?: string }) {
  return (
    <Card className={cn('dark-pattern reveal-up min-h-[145px] p-4 text-white [animation-delay:660ms]', className)}>
      <CardTitle className="text-white">Time Tracker</CardTitle>
      <p className="mt-6 text-center text-[31px] font-medium tracking-[-0.05em]">01:24:08</p>
      <div className="mt-4 flex justify-center gap-3">
        <Button variant="soft" size="circle" aria-label="Pause timer" className="h-9 w-9 bg-white text-donezo-green hover:bg-donezo-pale">
          <Pause className="h-4 w-4 fill-current" />
        </Button>
        <Button variant="destructive" size="circle" aria-label="Stop timer" className="h-9 w-9">
          <Square className="h-3.5 w-3.5 fill-current" />
        </Button>
      </div>
    </Card>
  )
}

