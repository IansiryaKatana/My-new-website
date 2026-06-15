import { cn } from '../lib/utils'

type MetricPillProps = {
  label: string
  value: string
  className?: string
  progress?: number
}

export function MetricPill({
  label,
  value,
  className,
  progress = 72,
}: MetricPillProps) {
  const clamped = Math.min(100, Math.max(0, progress))

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl bg-black px-3 py-2 text-white',
        className,
      )}
    >
      <span
        className="grid size-10 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#e7b84a ${clamped * 3.6}deg, rgba(255,255,255,0.14) 0deg)`,
        }}
      >
        <span className="size-6 rounded-full bg-black" />
      </span>
      <span className="leading-none">
        <span className="block text-lg font-light tracking-[-0.05em]">
          {value}
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.16em] text-white/55">
          {label}
        </span>
      </span>
    </div>
  )
}
