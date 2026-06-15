import { useMemo, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  createHealthMetricAction,
  deleteHealthMetricAction,
  getCareFlowData,
  updateHealthMetricAction,
} from '../lib/careflow-actions'
import type { HealthMetric, HealthMetricInput } from '../lib/careflow-types'
import { formatDate, toDateInput } from '../lib/format'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/statistics')({
  loader: () => getCareFlowData(),
  component: StatisticsRoute,
})

const emptyMetric: HealthMetricInput = {
  date: toDateInput(),
  weightKg: 58,
  heartRateBpm: 70,
  bloodGlucoseMmol: 4.5,
  systolic: 115,
  diastolic: 74,
  oxygenSaturation: 99,
  notes: '',
}

function StatisticsRoute() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const [draft, setDraft] = useState<HealthMetricInput>(emptyMetric)
  const [editingId, setEditingId] = useState<string | null>(null)
  const metrics = [...data.healthMetrics].sort((a, b) =>
    b.date.localeCompare(a.date),
  )
  const latestMetric = metrics[0]
  const trendPath = useMemo(() => buildTrendPath(metrics), [metrics])

  async function saveMetric() {
    if (editingId) {
      await updateHealthMetricAction({ data: { ...draft, id: editingId } })
    } else {
      await createHealthMetricAction({ data: draft })
    }
    setDraft(emptyMetric)
    setEditingId(null)
    await router.invalidate()
  }

  function editMetric(metric: HealthMetric) {
    setEditingId(metric.id)
    setDraft({
      date: metric.date,
      weightKg: metric.weightKg,
      heartRateBpm: metric.heartRateBpm,
      bloodGlucoseMmol: metric.bloodGlucoseMmol,
      systolic: metric.systolic,
      diastolic: metric.diastolic,
      oxygenSaturation: metric.oxygenSaturation,
      notes: metric.notes,
    })
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="grid gap-5">
        <Card className="overflow-hidden bg-care-green p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <Badge variant="paid">Health analytics</Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-[-0.07em] md:text-5xl">
                Latest patient vitals
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-care-ink/70">
                Metrics are persisted as clinical records and power the
                dashboard trend cards.
              </p>
              {latestMetric && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Stat label="Weight" value={`${latestMetric.weightKg} kg`} />
                  <Stat
                    label="Heart rate"
                    value={`${latestMetric.heartRateBpm} bpm`}
                  />
                  <Stat
                    label="Glucose"
                    value={`${latestMetric.bloodGlucoseMmol.toFixed(1)} mmol/L`}
                  />
                </div>
              )}
            </div>
            <svg
              viewBox="0 0 520 220"
              className="min-h-[220px] w-full rounded-[2rem] bg-white/30 p-4"
              role="img"
              aria-label="Weight trend chart"
            >
              <path
                d={trendPath}
                fill="none"
                stroke="#0b0d0c"
                strokeLinecap="round"
                strokeWidth="7"
              />
            </svg>
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader className="mb-4 flex-row items-center justify-between">
            <CardTitle>Metric History</CardTitle>
            <Badge variant="muted">{metrics.length} records</Badge>
          </CardHeader>
          <CardContent className="grid gap-3">
            {metrics.map((metric) => (
              <article
                key={metric.id}
                className="grid gap-4 rounded-3xl border border-transparent bg-care-green-soft p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-care-ink/10 hover:bg-white hover:shadow-[0_14px_35px_rgb(31_47_37/0.1)] lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div>
                  <h2 className="font-bold">{formatDate(metric.date)}</h2>
                  <p className="mt-1 text-sm text-care-muted">
                    {metric.weightKg} kg · {metric.heartRateBpm} bpm ·{' '}
                    {metric.bloodGlucoseMmol.toFixed(1)} mmol/L ·{' '}
                    {metric.systolic}/{metric.diastolic} mmHg ·{' '}
                    {metric.oxygenSaturation}% SpO2
                  </p>
                  {metric.notes && <p className="mt-2 text-sm">{metric.notes}</p>}
                </div>
                <div className="flex gap-2 lg:justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => editMetric(metric)}
                  >
                    <Pencil className="mr-2 size-3.5" aria-hidden />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      await deleteHealthMetricAction({ data: { id: metric.id } })
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
      </section>

      <Card className="h-fit p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" aria-hidden />
            {editingId ? 'Edit Metric' : 'Add Metric'}
          </CardTitle>
          <p className="text-sm text-care-muted">
            Capture daily patient measurements with validation.
          </p>
        </CardHeader>
        <form
          className="mt-5 grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault()
            await saveMetric()
          }}
        >
          <MetricField
            label="Date"
            type="date"
            value={draft.date}
            onChange={(date) => setDraft((current) => ({ ...current, date }))}
          />
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <MetricField
              label="Weight kg"
              type="number"
              value={draft.weightKg}
              onChange={(weightKg) =>
                setDraft((current) => ({
                  ...current,
                  weightKg: Number(weightKg),
                }))
              }
            />
            <MetricField
              label="Heart rate"
              type="number"
              value={draft.heartRateBpm}
              onChange={(heartRateBpm) =>
                setDraft((current) => ({
                  ...current,
                  heartRateBpm: Number(heartRateBpm),
                }))
              }
            />
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <MetricField
              label="Glucose mmol/L"
              type="number"
              value={draft.bloodGlucoseMmol}
              onChange={(bloodGlucoseMmol) =>
                setDraft((current) => ({
                  ...current,
                  bloodGlucoseMmol: Number(bloodGlucoseMmol),
                }))
              }
            />
            <MetricField
              label="SpO2 %"
              type="number"
              value={draft.oxygenSaturation}
              onChange={(oxygenSaturation) =>
                setDraft((current) => ({
                  ...current,
                  oxygenSaturation: Number(oxygenSaturation),
                }))
              }
            />
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <MetricField
              label="Systolic"
              type="number"
              value={draft.systolic}
              onChange={(systolic) =>
                setDraft((current) => ({
                  ...current,
                  systolic: Number(systolic),
                }))
              }
            />
            <MetricField
              label="Diastolic"
              type="number"
              value={draft.diastolic}
              onChange={(diastolic) =>
                setDraft((current) => ({
                  ...current,
                  diastolic: Number(diastolic),
                }))
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
              className="min-h-24 w-full min-w-0 rounded-2xl border border-care-line bg-white px-3 py-3 text-sm outline-none transition focus:border-care-ink/30 focus:ring-2 focus:ring-care-ink/10"
            />
          </label>
          <Button type="submit" className="rounded-2xl">
            <Plus className="mr-2 size-4" aria-hidden />
            {editingId ? 'Save metric' : 'Add metric'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/40 p-4">
      <p className="text-xs font-semibold text-care-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-[-0.05em]">{value}</p>
    </div>
  )
}

function MetricField({
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
    <label className="grid min-w-0 gap-1.5 text-sm font-semibold">
      {label}
      <input
        required
        min={type === 'number' ? 0 : undefined}
        step={type === 'number' ? '0.1' : undefined}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full min-w-0 rounded-2xl border border-care-line bg-white px-3 text-sm outline-none transition focus:border-care-ink/30 focus:ring-2 focus:ring-care-ink/10"
      />
    </label>
  )
}

function buildTrendPath(metrics: HealthMetric[]) {
  const ordered = [...metrics].sort((a, b) => a.date.localeCompare(b.date))
  if (ordered.length === 0) return 'M 20 120 L 500 120'
  const max = Math.max(...ordered.map((metric) => metric.weightKg))
  const min = Math.min(...ordered.map((metric) => metric.weightKg))
  const range = Math.max(max - min, 1)

  return ordered
    .map((metric, index) => {
      const x =
        ordered.length === 1 ? 260 : 30 + (index / (ordered.length - 1)) * 460
      const y = 170 - ((metric.weightKg - min) / range) * 115
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}
