import { ChevronDown } from 'lucide-react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

import { adminLabel, adminSelect } from '../adminClassNames'

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string
  wrapperClassName?: string
}

export function AdminSelect({
  className = '',
  wrapperClassName = '',
  children,
  ...props
}: AdminSelectProps) {
  return (
    <div className={`relative inline-flex min-w-0 max-w-full ${wrapperClassName}`}>
      <select className={`${adminSelect} ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-fg-muted)]"
        aria-hidden
      />
    </div>
  )
}

export function AdminSelectField({
  label,
  children,
  className,
  wrapperClassName,
  ...props
}: AdminSelectProps & { label: string }) {
  return (
    <label className="grid gap-2">
      <span className={adminLabel}>{label}</span>
      <AdminSelect className={className} wrapperClassName={wrapperClassName} {...props}>
        {children}
      </AdminSelect>
    </label>
  )
}

export function AdminToolbarSelect({
  label,
  children,
  className,
  ...props
}: AdminSelectProps & { label?: ReactNode }) {
  return (
    <label className="inline-flex min-w-0 items-center gap-2">
      {label ? (
        <span className="shrink-0 font-display text-xs font-black uppercase tracking-[0.12em] text-[var(--admin-fg-muted)]">
          {label}
        </span>
      ) : null}
      <AdminSelect className={className ?? 'min-w-[11rem]'} {...props}>
        {children}
      </AdminSelect>
    </label>
  )
}
