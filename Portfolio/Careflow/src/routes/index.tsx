import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Camera,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Scale,
  ShieldCheck,
  VideoOff,
} from 'lucide-react'
import {
  getCareFlowData,
  updateConsultationAction,
  updateProfileAction,
  updateSubscriptionAction,
} from '../lib/careflow-actions'
import type { UserProfileInput } from '../lib/careflow-types'
import { formatDate, formatTime } from '../lib/format'
import { publicAsset } from '../../../demo-assets'
import { cn } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/')({
  loader: () => getCareFlowData(),
  component: HomeRoute,
})

function HomeRoute() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const consultation = data.consultations[0]
  const latestMetric = [...data.healthMetrics].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0]
  const upcomingAppointments = [...data.appointments]
    .filter((appointment) => appointment.status !== 'Cancelled')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 4)
  const [profile, setProfile] = useState<UserProfileInput>({
    name: data.user.name,
    age: data.user.age,
    email: data.user.email,
    phone: data.user.phone,
    carePlan: data.user.carePlan,
  })

  async function invalidate() {
    await router.invalidate()
  }

  return (
    <div className="grid min-h-full gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.85fr)]">
      <section className="grid gap-5">
        <Card
          className="care-video-enter relative min-h-[560px] overflow-hidden rounded-[2rem] bg-care-ink bg-cover bg-center lg:min-h-[630px]"
          style={{
            backgroundImage: `url("${publicAsset('hero.png')}")`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(5,17,15,0.38)_0%,rgba(5,17,15,0.16)_48%,rgba(5,17,15,0.24)_100%),linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.04)_52%,rgba(0,0,0,0.24)_100%)]" />
          <div className="absolute inset-0 p-6">
            <div className="relative z-10 h-full w-full">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                    <span
                      className={cn(
                        'size-2.5 rounded-full',
                        consultation.status === 'Live'
                          ? 'bg-[#9ee6a7]'
                          : 'bg-care-danger',
                      )}
                    />
                    {consultation.status} consultation
                  </div>
                  <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-[-0.06em] text-white md:text-6xl">
                    {consultation.doctorName}
                  </h1>
                  <p className="mt-3 text-base text-white/76">
                    {consultation.specialty}
                  </p>
                </div>
                <Badge variant="paid">Integrated care session</Badge>
              </div>

              <div className="absolute inset-x-0 bottom-0 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="grid min-w-0 grid-cols-3 gap-1.5 sm:gap-3">
                  <MetricTile
                    icon={Scale}
                    label="Weight"
                    value={`${latestMetric.weightKg} kg`}
                  />
                  <MetricTile
                    icon={HeartPulse}
                    label="Heart rate"
                    value={`${latestMetric.heartRateBpm} bpm`}
                  />
                  <MetricTile
                    icon={Droplets}
                    label="Blood glucose"
                    value={`${latestMetric.bloodGlucoseMmol.toFixed(1)} mmol/L`}
                  />
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full bg-black/30 p-1.5 backdrop-blur-md">
                  <Button
                    type="button"
                    variant={
                      consultation.status === 'Live' ? 'danger' : 'default'
                    }
                    size="icon"
                    aria-label={
                      consultation.status === 'Live'
                        ? 'End consultation'
                        : 'Start consultation'
                    }
                    onClick={async () => {
                      await updateConsultationAction({
                        data: {
                          id: consultation.id,
                          status:
                            consultation.status === 'Live' ? 'Ended' : 'Live',
                        },
                      })
                      await invalidate()
                    }}
                  >
                    {consultation.status === 'Live' ? (
                      <PhoneOff className="size-4" aria-hidden />
                    ) : (
                      <Phone className="size-4" aria-hidden />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={
                      consultation.patientVideoEnabled
                        ? 'Turn camera off'
                        : 'Turn camera on'
                    }
                    onClick={async () => {
                      await updateConsultationAction({
                        data: {
                          id: consultation.id,
                          patientVideoEnabled:
                            !consultation.patientVideoEnabled,
                        },
                      })
                      await invalidate()
                    }}
                  >
                    {consultation.patientVideoEnabled ? (
                      <Camera className="size-4" aria-hidden />
                    ) : (
                      <VideoOff className="size-4" aria-hidden />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={
                      consultation.patientMicEnabled
                        ? 'Mute microphone'
                        : 'Unmute microphone'
                    }
                    onClick={async () => {
                      await updateConsultationAction({
                        data: {
                          id: consultation.id,
                          patientMicEnabled: !consultation.patientMicEnabled,
                        },
                      })
                      await invalidate()
                    }}
                  >
                    {consultation.patientMicEnabled ? (
                      <Mic className="size-4" aria-hidden />
                    ) : (
                      <MicOff className="size-4" aria-hidden />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-fit p-5">
          <CardHeader className="mb-4 flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/appointments">Manage all</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            {upcomingAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="grid gap-3 rounded-2xl border border-transparent bg-care-green-soft p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-care-ink/10 hover:bg-white hover:shadow-[0_12px_28px_rgb(31_47_37/0.08)] md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-semibold">
                    {appointment.specialist} · {appointment.doctorName}
                  </p>
                  <p className="mt-1 text-sm text-care-muted">
                    {formatDate(appointment.date)} at{' '}
                    {formatTime(appointment.time)} · {appointment.reason}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Badge variant="muted">{appointment.status}</Badge>
                  <PaymentBadge status={appointment.paymentStatus} />
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <aside className="grid content-start gap-5">
        <Card className="bg-care-green p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-care-muted">
                Current plan
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-[-0.06em]">
                {data.subscription.plan}
              </h2>
              <p className="mt-2 text-sm text-care-ink/70">
                Renews {formatDate(data.subscription.renewsAt)}
              </p>
            </div>
            <ShieldCheck className="size-9" aria-hidden />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-5 w-full rounded-2xl"
            onClick={async () => {
              await updateSubscriptionAction({
                data: {
                  plan: data.subscription.plan === 'Pro' ? 'Free' : 'Pro',
                },
              })
              await invalidate()
            }}
          >
            {data.subscription.plan === 'Pro'
              ? 'Downgrade to Free'
              : 'Upgrade to Pro'}
          </Button>
        </Card>

        <Card className="p-5">
          <CardHeader>
            <CardTitle>Patient Profile</CardTitle>
            <p className="text-sm text-care-muted">
              Update the account record used across care modules.
            </p>
          </CardHeader>
          <form
            className="mt-4 grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault()
              await updateProfileAction({ data: profile })
              await invalidate()
            }}
          >
            <FormInput
              label="Name"
              value={profile.name}
              onChange={(value) =>
                setProfile((current) => ({ ...current, name: value }))
              }
            />
            <FormInput
              label="Age"
              type="number"
              value={profile.age}
              onChange={(value) =>
                setProfile((current) => ({ ...current, age: Number(value) }))
              }
            />
            <FormInput
              label="Email"
              type="email"
              value={profile.email}
              onChange={(value) =>
                setProfile((current) => ({ ...current, email: value }))
              }
            />
            <FormInput
              label="Phone"
              value={profile.phone}
              onChange={(value) =>
                setProfile((current) => ({ ...current, phone: value }))
              }
            />
            <Button type="submit" className="rounded-2xl">
              Save profile
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-care-muted" aria-hidden />
            <div>
              <p className="font-semibold">Use case coverage</p>
              <p className="text-sm text-care-muted">
                Patient consultation, scheduling, messaging, metrics, and plan
                management are connected through persisted server records.
              </p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  )
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Scale
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/15 p-2.5 text-white backdrop-blur-md sm:rounded-3xl sm:p-4">
      <Icon className="size-4 sm:size-5" aria-hidden />
      <p className="mt-3 truncate text-[10px] text-white/62 sm:mt-4 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 break-words text-lg font-bold leading-tight tracking-[-0.05em] sm:text-2xl">
        {value}
      </p>
    </div>
  )
}

function FormInput({
  label,
  onChange,
  type = 'text',
  value,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: number | string
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

function PaymentBadge({ status }: { status: 'Paid' | 'Unpaid' | 'Insurance' }) {
  const variant = status.toLowerCase() as 'paid' | 'unpaid' | 'insurance'

  return <Badge variant={variant}>{status}</Badge>
}
