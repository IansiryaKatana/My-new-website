import { useMemo, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import {
  createAppointmentAction,
  deleteAppointmentAction,
  getCareFlowData,
  updateAppointmentAction,
} from '../lib/careflow-actions'
import type { Appointment, AppointmentInput } from '../lib/careflow-types'
import { formatDate, formatTime } from '../lib/format'
import { cn } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/calendar')({
  loader: () => getCareFlowData(),
  component: CalendarRoute,
})

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function CalendarRoute() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const [month, setMonth] = useState(new Date(2025, 9, 1))
  const [selectedDate, setSelectedDate] = useState('2025-10-09')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<AppointmentInput>(
    createDraft(selectedDate),
  )
  const days = useMemo(() => buildCalendarDays(month), [month])
  const selectedAppointments = data.appointments
    .filter((appointment) => appointment.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time))
  const appointmentDates = new Set(data.appointments.map((item) => item.date))
  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(month)

  function startNew(date: string) {
    setSelectedDate(date)
    setEditingId(null)
    setDraft(createDraft(date))
  }

  function edit(appointment: Appointment) {
    setEditingId(appointment.id)
    setDraft({
      specialist: appointment.specialist,
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      paymentStatus: appointment.paymentStatus,
      status: appointment.status,
      notes: appointment.notes,
    })
  }

  async function save() {
    if (editingId) {
      await updateAppointmentAction({ data: { ...draft, id: editingId } })
    } else {
      await createAppointmentAction({ data: draft })
    }
    setEditingId(null)
    setDraft(createDraft(selectedDate))
    await router.invalidate()
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <Card className="p-5">
        <CardHeader className="mb-5 flex-row items-center justify-between">
          <div>
            <CardTitle>Care Calendar</CardTitle>
            <p className="mt-1 text-sm text-care-muted">
              Schedule, update, and cancel care events from the same source of
              truth used by appointments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Previous month"
              onClick={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1, 1),
                )
              }
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Next month"
              onClick={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() + 1, 1),
                )
              }
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </CardHeader>

        <div className="mb-4 text-3xl font-bold tracking-[-0.06em]">
          {monthLabel}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-2 pb-1 text-xs font-semibold text-care-muted"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const selected = selectedDate === day.iso
            const hasAppointment = appointmentDates.has(day.iso)

            return (
              <button
                key={day.key}
                type="button"
                aria-pressed={selected}
                className={cn(
                  'min-h-24 rounded-3xl border border-transparent bg-white/78 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-care-ink/15 hover:bg-white hover:shadow-[0_12px_28px_rgb(31_47_37/0.1)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-care-ink/20',
                  !day.inCurrentMonth && 'opacity-45',
                  selected && 'bg-care-ink text-white',
                )}
                onClick={() => startNew(day.iso)}
              >
                <span className="text-sm font-bold">{day.day}</span>
                {hasAppointment && (
                  <span
                    className={cn(
                      'mt-8 block h-2 w-2 rounded-full bg-care-green',
                      selected && 'bg-white',
                    )}
                  />
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <aside className="grid content-start gap-5">
        <Card className="p-5">
          <CardHeader>
            <CardTitle>{formatDate(selectedDate)}</CardTitle>
            <p className="text-sm text-care-muted">
              {selectedAppointments.length} scheduled item
              {selectedAppointments.length === 1 ? '' : 's'}
            </p>
          </CardHeader>
          <CardContent className="mt-4 grid gap-3">
            {selectedAppointments.length === 0 && (
              <p className="rounded-2xl bg-care-green-soft p-4 text-sm text-care-muted">
                No care event is scheduled for this date.
              </p>
            )}
            {selectedAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl border border-transparent bg-care-green-soft p-4 transition-all duration-200 hover:border-care-ink/10 hover:bg-white hover:shadow-[0_12px_28px_rgb(31_47_37/0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold">{appointment.specialist}</h2>
                    <p className="text-sm text-care-muted">
                      {formatTime(appointment.time)} · {appointment.doctorName}
                    </p>
                  </div>
                  <Badge variant="muted">{appointment.status}</Badge>
                </div>
                <p className="mt-3 text-sm">{appointment.reason}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => edit(appointment)}
                  >
                    <Pencil className="mr-2 size-3.5" aria-hidden />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      await deleteAppointmentAction({
                        data: { id: appointment.id },
                      })
                      await router.invalidate()
                    }}
                  >
                    <Trash2 className="mr-2 size-3.5" aria-hidden />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Calendar Event' : 'Add Calendar Event'}
            </CardTitle>
          </CardHeader>
          <form
            className="mt-4 grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault()
              await save()
            }}
          >
            <Field
              label="Specialist"
              value={draft.specialist}
              onChange={(specialist) =>
                setDraft((current) => ({ ...current, specialist }))
              }
            />
            <Field
              label="Doctor"
              value={draft.doctorName}
              onChange={(doctorName) =>
                setDraft((current) => ({ ...current, doctorName }))
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Date"
                type="date"
                value={draft.date}
                onChange={(date) => {
                  setSelectedDate(date)
                  setDraft((current) => ({ ...current, date }))
                }}
              />
              <Field
                label="Time"
                type="time"
                value={draft.time}
                onChange={(time) =>
                  setDraft((current) => ({ ...current, time }))
                }
              />
            </div>
            <Field
              label="Reason"
              value={draft.reason}
              onChange={(reason) =>
                setDraft((current) => ({ ...current, reason }))
              }
            />
            <Button type="submit" className="rounded-2xl">
              {editingId ? 'Save event' : 'Create event'}
            </Button>
          </form>
        </Card>
      </aside>
    </div>
  )
}

function createDraft(date: string): AppointmentInput {
  return {
    specialist: '',
    doctorName: '',
    date,
    time: '09:00',
    reason: '',
    paymentStatus: 'Unpaid',
    status: 'Scheduled',
    notes: '',
  }
}

function Field({
  label,
  onChange,
  type = 'text',
  value,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-care-line bg-white px-3 text-sm outline-none transition focus:border-care-ink/30 focus:ring-2 focus:ring-care-ink/10"
      />
    </label>
  )
}

function buildCalendarDays(month: Date) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const daysInPreviousMonth = new Date(year, monthIndex, 0).getDate()
  const leadingDays = (firstDay.getDay() + 6) % 7
  const days = []

  for (let index = leadingDays - 1; index >= 0; index -= 1) {
    days.push(toCalendarDay(new Date(year, monthIndex - 1, daysInPreviousMonth - index), false))
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

function toCalendarDay(date: Date, inCurrentMonth: boolean) {
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
