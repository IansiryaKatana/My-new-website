import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { CalendarPlus, Pencil, Trash2 } from 'lucide-react'
import {
  createAppointmentAction,
  deleteAppointmentAction,
  getCareFlowData,
  updateAppointmentAction,
} from '../lib/careflow-actions'
import type { Appointment, AppointmentInput } from '../lib/careflow-types'
import { formatDate, formatTime, toDateInput } from '../lib/format'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export const Route = createFileRoute('/appointments')({
  loader: () => getCareFlowData(),
  component: AppointmentsRoute,
})

const emptyAppointment: AppointmentInput = {
  specialist: '',
  doctorName: '',
  date: toDateInput(),
  time: '09:00',
  reason: '',
  paymentStatus: 'Unpaid',
  status: 'Scheduled',
  notes: '',
}

function AppointmentsRoute() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const [draft, setDraft] = useState<AppointmentInput>(emptyAppointment)
  const [editingId, setEditingId] = useState<string | null>(null)
  const appointments = [...data.appointments].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  )

  async function saveAppointment() {
    if (editingId) {
      await updateAppointmentAction({ data: { ...draft, id: editingId } })
    } else {
      await createAppointmentAction({ data: draft })
    }
    setDraft(emptyAppointment)
    setEditingId(null)
    await router.invalidate()
  }

  function editAppointment(appointment: Appointment) {
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

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(380px,420px)_1fr]">
      <Card className="p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="size-5" aria-hidden />
            {editingId ? 'Edit Appointment' : 'Create Appointment'}
          </CardTitle>
          <p className="text-sm text-care-muted">
            Appointments are persisted and reflected in the dashboard and
            calendar.
          </p>
        </CardHeader>
        <form
          className="mt-5 grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault()
            await saveAppointment()
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
              onChange={(date) => setDraft((current) => ({ ...current, date }))}
            />
            <Field
              label="Time"
              type="time"
              value={draft.time}
              onChange={(time) => setDraft((current) => ({ ...current, time }))}
            />
          </div>
          <Field
            label="Reason"
            value={draft.reason}
            onChange={(reason) =>
              setDraft((current) => ({ ...current, reason }))
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Payment"
              value={draft.paymentStatus}
              options={['Paid', 'Unpaid', 'Insurance']}
              onChange={(paymentStatus) =>
                setDraft((current) => ({ ...current, paymentStatus }))
              }
            />
            <SelectField
              label="Status"
              value={draft.status}
              options={['Scheduled', 'Completed', 'Cancelled']}
              onChange={(status) =>
                setDraft((current) => ({ ...current, status }))
              }
            />
          </div>
          <label className="grid gap-1.5 text-sm font-semibold">
            Notes
            <textarea
              value={draft.notes}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="min-h-24 rounded-2xl border border-care-line bg-white px-3 py-3 text-sm outline-none transition focus:border-care-ink/30 focus:ring-2 focus:ring-care-ink/10"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="submit" className="rounded-2xl">
              {editingId ? 'Save Changes' : 'Create Appointment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                setEditingId(null)
                setDraft(emptyAppointment)
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <CardHeader className="mb-4 flex-row items-center justify-between">
          <CardTitle>Appointment Registry</CardTitle>
          <Badge variant="muted">{appointments.length} records</Badge>
        </CardHeader>
        <CardContent className="grid gap-3">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="grid gap-4 rounded-3xl border border-transparent bg-care-green-soft p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-care-ink/10 hover:bg-white hover:shadow-[0_14px_35px_rgb(31_47_37/0.1)] lg:grid-cols-[1fr_auto] lg:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold tracking-[-0.04em]">
                    {appointment.specialist}
                  </h2>
                  <StatusBadge label={appointment.status} />
                  <PaymentBadge status={appointment.paymentStatus} />
                </div>
                <p className="mt-1 text-sm text-care-muted">
                  {appointment.doctorName} · {formatDate(appointment.date)} at{' '}
                  {formatTime(appointment.time)}
                </p>
                <p className="mt-3 text-sm">{appointment.reason}</p>
                {appointment.notes && (
                  <p className="mt-2 text-sm text-care-muted">
                    {appointment.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => editAppointment(appointment)}
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
    </div>
  )
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

function SelectField<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: T) => void
  options: T[]
  value: T
}) {
  return (
    <div className="grid min-w-0 gap-1.5 text-sm font-semibold">
      {label}
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as T)}
      >
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function PaymentBadge({ status }: { status: Appointment['paymentStatus'] }) {
  const variant = status.toLowerCase() as 'paid' | 'unpaid' | 'insurance'
  return <Badge variant={variant}>{status}</Badge>
}

function StatusBadge({ label }: { label: string }) {
  return <Badge variant={label === 'Cancelled' ? 'unpaid' : 'muted'}>{label}</Badge>
}
