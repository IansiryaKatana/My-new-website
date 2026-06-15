import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Droplets,
  Expand,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Scale,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserRound,
  Video,
  VideoOff,
} from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import type {
  Appointment,
  CareFlowDashboardData,
  NavItem,
  PaymentStatus,
} from '../data/careflow'
import { cn } from '../lib/utils'

const navIcons: Record<NavItem['id'], LucideIcon> = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  appointments: CreditCard,
  chats: MessageCircle,
  statistics: Activity,
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type CalendarDay = {
  key: string
  day: number
  iso: string
  inCurrentMonth: boolean
}

type CareFlowDashboardProps = {
  initialData: CareFlowDashboardData
}

export function CareFlowDashboard({ initialData }: CareFlowDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavItem['id']>('dashboard')
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [consultationLive, setConsultationLive] = useState(
    initialData.consultation.status === 'live',
  )
  const [expandedVideo, setExpandedVideo] = useState(false)
  const [selectedDate, setSelectedDate] = useState('2025-10-09')
  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 9, 1))
  const [showAllAppointments, setShowAllAppointments] = useState(false)
  const [upgraded, setUpgraded] = useState(false)

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth),
    [calendarMonth],
  )

  const visibleAppointments = initialData.appointments
  const subscription = upgraded
    ? {
        ...initialData.subscription,
        plan: 'Pro' as const,
        upgradeAvailable: false,
        description: 'Your priority doctor access is active.',
      }
    : initialData.subscription

  return (
    <main className="min-h-dvh px-3 py-4 text-care-ink sm:px-6 lg:px-8 lg:py-8">
      <section className="care-shell-enter mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[1180px] flex-col rounded-[1.6rem] bg-care-shell p-3 shadow-[0_24px_80px_rgb(31_47_37/0.18)] sm:min-h-[min(860px,calc(100dvh-4rem))] sm:p-4">
        <TopNavigation
          activeNav={activeNav}
          navItems={initialData.navItems}
          user={initialData.user}
          onChangeNav={setActiveNav}
        />

        <section className="mt-4 grid flex-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.95fr)] xl:grid-rows-[auto_1fr]">
          <ConsultationVideoCard
            cameraOn={cameraOn}
            consultation={initialData.consultation}
            expanded={expandedVideo}
            live={consultationLive}
            micOn={micOn}
            onEndCall={() => setConsultationLive((current) => !current)}
            onToggleCamera={() => setCameraOn((current) => !current)}
            onToggleExpand={() => setExpandedVideo((current) => !current)}
            onToggleMic={() => setMicOn((current) => !current)}
          />

          <aside className="order-2 grid gap-4 md:grid-cols-2 xl:order-none xl:col-start-2 xl:row-span-2 xl:grid-cols-1 xl:self-start">
            <WeightMetricCard metrics={initialData.metrics} />

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              <SmallMetricCard
                icon={HeartPulse}
                label="Heart rate"
                value={initialData.metrics.heartRateBpm}
                unit="bpm"
                pulse
              />
              <SmallMetricCard
                icon={Droplets}
                label="Blood Glucose"
                value={initialData.metrics.bloodGlucoseMmol}
                unit="mmol/L"
              />
            </div>

            <CalendarWidget
              days={calendarDays}
              month={calendarMonth}
              selectedDate={selectedDate}
              onChangeMonth={setCalendarMonth}
              onSelectDate={setSelectedDate}
            />

            <SubscriptionCard
              subscription={subscription}
              upgraded={upgraded}
              onUpgrade={() => setUpgraded(true)}
            />
          </aside>

          <AppointmentsCard
            appointments={visibleAppointments}
            showAll={showAllAppointments}
            onToggleShowAll={() => setShowAllAppointments((current) => !current)}
          />
        </section>

        <MobileBottomNavigation
          activeNav={activeNav}
          navItems={initialData.navItems}
          onChangeNav={setActiveNav}
        />
      </section>
    </main>
  )
}

function TopNavigation({
  activeNav,
  navItems,
  user,
  onChangeNav,
}: {
  activeNav: NavItem['id']
  navItems: NavItem[]
  user: CareFlowDashboardData['user']
  onChangeNav: (id: NavItem['id']) => void
}) {
  return (
    <header className="care-nav-enter flex flex-wrap items-center gap-3 rounded-[1.2rem] bg-white/45 p-2">
      <button
        type="button"
        className="flex items-center gap-2 rounded-2xl px-1 pr-3 outline-none transition focus-visible:ring-2 focus-visible:ring-care-ink/25"
        onClick={() => onChangeNav('dashboard')}
        aria-label="Go to CareFlow dashboard"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-care-green text-care-ink">
          <Stethoscope className="size-5" aria-hidden />
        </span>
        <span className="text-[15px] font-bold tracking-[-0.03em]">
          CareFlow
        </span>
      </button>

      <nav
        aria-label="Primary"
        className="hidden flex-1 flex-wrap items-center justify-center gap-1 md:flex"
      >
        {navItems.map((item) => {
          const Icon = navIcons[item.id]
          const isActive = activeNav === item.id

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-care-ink transition hover:bg-care-green-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-care-ink/25',
                isActive && 'bg-care-green',
              )}
              onClick={() => onChangeNav(item.id)}
            >
              <Icon className="size-4" aria-hidden />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2 rounded-2xl bg-white/60 p-1.5 pr-3">
        <img
          src={user.avatarUrl}
          alt={`${user.name} profile`}
          className="size-9 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-xs font-semibold">{user.name}</p>
          <p className="text-[11px] text-care-muted">{user.age} years old</p>
        </div>
      </div>
    </header>
  )
}

function ConsultationVideoCard({
  consultation,
  cameraOn,
  expanded,
  live,
  micOn,
  onEndCall,
  onToggleCamera,
  onToggleExpand,
  onToggleMic,
}: {
  consultation: CareFlowDashboardData['consultation']
  cameraOn: boolean
  expanded: boolean
  live: boolean
  micOn: boolean
  onEndCall: () => void
  onToggleCamera: () => void
  onToggleExpand: () => void
  onToggleMic: () => void
}) {
  return (
    <Card
      className={cn(
        'care-video-enter order-1 isolate min-h-[360px] overflow-hidden rounded-[1.35rem] bg-care-ink xl:col-start-1 xl:row-start-1',
        expanded &&
          'fixed inset-3 z-50 min-h-0 rounded-[1.6rem] shadow-[0_30px_120px_rgb(0_0_0/0.45)] sm:inset-8',
      )}
    >
      <div
        className="relative flex h-full min-h-[360px] overflow-hidden bg-cover bg-center p-5 sm:min-h-[390px]"
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgb(8 23 20 / 0.72), rgb(46 80 72 / 0.28)), url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85")',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgb(255_255_255/0.18),transparent_22rem)]" />
        <div className="relative z-10 flex w-full flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2.5 rounded-full',
                    live ? 'bg-[#9ee6a7]' : 'bg-care-danger',
                  )}
                />
                <span className="text-xs font-medium text-white/85">
                  {live ? 'Live consultation' : 'Call ended'}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[28px]">
                {consultation.doctorName}
              </h1>
              <p className="mt-1 text-sm text-white/75">
                {live ? consultation.duration : 'Ready to reconnect'} ·{' '}
                {consultation.specialty}
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label={expanded ? 'Minimize consultation video' : 'Expand consultation video'}
              onClick={onToggleExpand}
              className="bg-white/90 hover:bg-white"
            >
              <Expand className="size-4" aria-hidden />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4 sm:items-stretch">
            <div className="absolute bottom-24 right-4 z-10 hidden h-28 w-44 overflow-hidden rounded-2xl border border-white/35 bg-care-green shadow-2xl sm:block">
              <div
                className={cn(
                  'h-full bg-cover bg-center',
                  !cameraOn && 'blur-xl grayscale',
                )}
                style={{
                  backgroundImage:
                    'linear-gradient(rgb(19 44 39 / 0.2), rgb(19 44 39 / 0.2)), url("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=420&q=80")',
                }}
              />
              <div className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white">
                Diane Lara
              </div>
            </div>

            <div className="mx-auto flex items-center gap-2 rounded-full bg-black/25 p-1.5 backdrop-blur-md">
              <Button
                type="button"
                variant={live ? 'danger' : 'default'}
                size="icon"
                aria-label={live ? 'End consultation call' : 'Reconnect consultation call'}
                onClick={onEndCall}
                className="hover:scale-105"
              >
                {live ? (
                  <PhoneOff className="size-4" aria-hidden />
                ) : (
                  <Phone className="size-4" aria-hidden />
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
                aria-pressed={!cameraOn}
                onClick={onToggleCamera}
                className="hover:scale-105"
              >
                {cameraOn ? (
                  <Camera className="size-4" aria-hidden />
                ) : (
                  <VideoOff className="size-4" aria-hidden />
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                aria-pressed={!micOn}
                onClick={onToggleMic}
                className="hover:scale-105"
              >
                {micOn ? (
                  <Mic className="size-4" aria-hidden />
                ) : (
                  <MicOff className="size-4" aria-hidden />
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={expanded ? 'Minimize consultation view' : 'Expand consultation view'}
                onClick={onToggleExpand}
                className="hover:scale-105"
              >
                <Expand
                  className={cn('size-4 transition', expanded && 'rotate-45')}
                  aria-hidden
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function WeightMetricCard({
  metrics,
}: {
  metrics: CareFlowDashboardData['metrics']
}) {
  return (
    <Card className="care-fade-up overflow-hidden bg-care-green p-4 [animation-delay:220ms]">
      <div className="relative min-h-[122px]">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/50">
              <Scale className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">Weight</p>
              <p className="text-xs text-care-muted">Last 7 days</p>
            </div>
          </div>
          <p className="text-3xl font-bold tracking-[-0.05em]">
            {metrics.weightKg}
            <span className="ml-1 text-sm font-semibold tracking-normal">kg</span>
          </p>
        </div>

        <div className="absolute left-[51%] top-[46%] z-10 -translate-x-1/2 rounded-full bg-care-ink px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
          {metrics.tooltipWeightKg} kg
        </div>

        <svg
          className="absolute inset-x-0 bottom-0 h-20 w-full"
          viewBox="0 0 330 120"
          role="img"
          aria-label={`Weight trend ending at ${metrics.weightKg} kilograms`}
        >
          <path
            d="M4 86 C46 58 66 92 106 62 C139 37 162 30 196 50 C229 69 253 92 326 42"
            fill="none"
            stroke="rgb(255 255 255 / 0.85)"
            strokeLinecap="round"
            strokeWidth="4"
            className="care-chart-line"
          />
          <circle cx="196" cy="50" r="5.5" fill="#0b0d0c" />
          <circle cx="196" cy="50" r="10" fill="transparent" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </Card>
  )
}

function SmallMetricCard({
  icon: Icon,
  label,
  pulse,
  unit,
  value,
}: {
  icon: LucideIcon
  label: string
  pulse?: boolean
  unit: string
  value: number | string
}) {
  return (
    <Card className="care-fade-up p-4 [animation-delay:300ms]">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-xl bg-care-green-soft">
          <Icon className={cn('size-4', pulse && 'care-heart-pulse')} aria-hidden />
        </span>
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-[-0.05em]">
        {value}
        <span className="ml-1 text-sm font-semibold tracking-normal text-care-muted">
          {unit}
        </span>
      </p>
    </Card>
  )
}

function CalendarWidget({
  days,
  month,
  selectedDate,
  onChangeMonth,
  onSelectDate,
}: {
  days: CalendarDay[]
  month: Date
  selectedDate: string
  onChangeMonth: (date: Date) => void
  onSelectDate: (date: string) => void
}) {
  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(month)

  return (
    <Card className="care-fade-up p-4 [animation-delay:380ms] md:col-span-2 xl:col-span-1">
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          aria-label="Previous month"
          onClick={() =>
            onChangeMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        <h2 className="text-xl font-semibold tracking-[-0.04em]">
          {monthLabel}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          aria-label="Next month"
          onClick={() =>
            onChangeMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-[11px] font-semibold text-care-muted"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const isSelected = selectedDate === day.iso

          return (
            <button
              key={day.key}
              type="button"
              aria-label={`${day.day} ${monthLabel}`}
              aria-pressed={isSelected}
              className={cn(
                'aspect-square rounded-xl text-sm font-semibold transition hover:bg-care-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-care-ink/25',
                day.inCurrentMonth
                  ? 'bg-care-green-soft text-care-ink'
                  : 'text-care-muted/45',
                isSelected && 'scale-[1.02] bg-care-ink text-white hover:bg-care-ink',
              )}
              onClick={() => onSelectDate(day.iso)}
            >
              {day.day}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function SubscriptionCard({
  subscription,
  upgraded,
  onUpgrade,
}: {
  subscription: CareFlowDashboardData['subscription']
  upgraded: boolean
  onUpgrade: () => void
}) {
  return (
    <Card className="care-fade-up care-gradient-drift overflow-hidden bg-[linear-gradient(135deg,#d6e3d4,#eef4e8,#a9bdad)] p-4 [animation-delay:460ms] md:col-span-2 xl:col-span-1">
      <div className="relative min-h-[150px]">
        <div className="absolute -right-8 -top-10 size-32 rounded-full bg-white/35 blur-2xl" />
        <div className="absolute -bottom-12 right-10 size-36 rounded-full bg-[#8ca68f]/40 blur-2xl" />

        <div className="relative z-10 flex h-full min-h-[150px] flex-col justify-between">
          <div>
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-white/55">
              <ShieldCheck className="size-4" aria-hidden />
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.05em]">
              {subscription.title}
            </h2>
            <p className="mt-2 max-w-[26rem] text-sm leading-5 text-care-ink/72">
              {subscription.description}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-5 w-full rounded-xl bg-white/90 hover:bg-white"
            disabled={upgraded}
            onClick={onUpgrade}
          >
            {upgraded ? 'Pro active' : 'Upgrade'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function AppointmentsCard({
  appointments,
  showAll,
  onToggleShowAll,
}: {
  appointments: Appointment[]
  showAll: boolean
  onToggleShowAll: () => void
}) {
  return (
    <Card className="care-fade-up order-3 p-4 [animation-delay:540ms] xl:col-start-1 xl:row-start-2">
      <CardHeader className="mb-4 flex-row items-center justify-between gap-3">
        <CardTitle>Upcoming Appointments</CardTitle>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-care-muted transition hover:bg-care-green-soft hover:text-care-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-care-ink/25"
          onClick={onToggleShowAll}
        >
          {showAll ? 'Showing all' : 'View more'}
          <ChevronRight className="size-3.5" aria-hidden />
        </button>
      </CardHeader>

      <CardContent>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-care-muted">
                <th className="pb-3">Specialist</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3 text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t border-care-line/50">
                  <td className="py-3 font-semibold">{appointment.specialist}</td>
                  <td className="py-3 text-care-muted">{appointment.date}</td>
                  <td className="py-3 text-care-muted">{appointment.time}</td>
                  <td className="py-3">{appointment.reason}</td>
                  <td className="py-3 text-right">
                    <PaymentBadge status={appointment.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 md:hidden">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-2xl bg-care-green-soft p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{appointment.specialist}</h3>
                  <p className="mt-1 text-sm text-care-muted">
                    {appointment.date} · {appointment.time}
                  </p>
                </div>
                <PaymentBadge status={appointment.paymentStatus} />
              </div>
              <p className="mt-3 text-sm">{appointment.reason}</p>
            </article>
          ))}
        </div>

        {showAll && (
          <p className="mt-3 rounded-xl bg-care-green-soft px-3 py-2 text-xs font-medium text-care-muted">
            All upcoming visits for this care plan are currently visible.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const variant = status.toLowerCase() as 'paid' | 'unpaid' | 'insurance'

  return <Badge variant={variant}>{status}</Badge>
}

function MobileBottomNavigation({
  activeNav,
  navItems,
  onChangeNav,
}: {
  activeNav: NavItem['id']
  navItems: NavItem[]
  onChangeNav: (id: NavItem['id']) => void
}) {
  return (
    <nav
      aria-label="Mobile primary"
      className="sticky bottom-3 z-20 mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-white/92 p-1 shadow-[0_10px_35px_rgb(31_47_37/0.14)] backdrop-blur md:hidden"
    >
      {navItems.map((item) => {
        const Icon = navIcons[item.id]
        const isActive = activeNav === item.id

        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-care-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-care-ink/25',
              isActive && 'bg-care-green text-care-ink',
            )}
            onClick={() => onChangeNav(item.id)}
          >
            <Icon className="size-4" aria-hidden />
            <span>{item.label.split(' ')[0]}</span>
          </button>
        )
      })}
    </nav>
  )
}

function buildCalendarDays(month: Date): CalendarDay[] {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const daysInPreviousMonth = new Date(year, monthIndex, 0).getDate()
  const leadingDays = (firstDay.getDay() + 6) % 7
  const days: CalendarDay[] = []

  for (let index = leadingDays - 1; index >= 0; index -= 1) {
    const day = daysInPreviousMonth - index
    const date = new Date(year, monthIndex - 1, day)

    days.push(toCalendarDay(date, false))
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(toCalendarDay(new Date(year, monthIndex, day), true))
  }

  let nextDay = 1
  while (days.length < 42) {
    days.push(toCalendarDay(new Date(year, monthIndex + 1, nextDay), false))
    nextDay += 1
  }

  return days
}

function toCalendarDay(date: Date, inCurrentMonth: boolean): CalendarDay {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const iso = `${year}-${month}-${day}`

  return {
    key: `${iso}-${inCurrentMonth ? 'current' : 'outside'}`,
    day: date.getDate(),
    iso,
    inCurrentMonth,
  }
}
