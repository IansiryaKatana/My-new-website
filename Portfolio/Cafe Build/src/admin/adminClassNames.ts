import { cn } from '@/lib/utils'

export const adminBtnPrimary = cn(
  'inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius)]',
  'bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white',
  'transition hover:bg-[var(--admin-primary-hover)]',
  'disabled:pointer-events-none disabled:opacity-50',
)

export const adminBtnSecondary = cn(
  'inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius)]',
  'border border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] px-4 py-2',
  'text-sm font-semibold text-[var(--admin-text)] transition hover:bg-[var(--admin-surface-muted)]',
  'disabled:pointer-events-none disabled:opacity-50',
)

export const adminBtnDanger = cn(
  'inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius)]',
  'bg-[var(--admin-danger)] px-4 py-2 text-sm font-semibold text-white',
  'transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50',
)

export const adminBtnGhost = cn(
  'inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius)]',
  'px-3 py-2 text-sm font-medium text-[var(--admin-text-muted)]',
  'transition hover:bg-[var(--admin-primary-soft)] hover:text-[var(--admin-text)]',
)

export const adminBtnIcon = cn(
  'inline-flex h-9 w-9 items-center justify-center rounded-[var(--admin-radius)]',
  'text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-soft)] hover:text-[var(--admin-text)]',
)

export const adminInput = cn(
  'w-full rounded-[var(--admin-radius)] border border-[var(--admin-border)]',
  'bg-[var(--admin-surface-elevated)] px-3 py-2 text-sm text-[var(--admin-text)]',
  'placeholder:text-[var(--admin-text-muted)] outline-none',
  'focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary-soft)]',
)

export const adminLabel = cn('mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]')

export const adminCard = cn(
  'rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)]',
  'bg-[var(--admin-surface-elevated)] shadow-[var(--admin-shadow)]',
)

export const adminTableWrap = cn('overflow-x-auto rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)]')

export const adminTable = cn('w-full min-w-[640px] border-collapse text-sm')

export const adminTableHead = cn(
  'bg-[var(--admin-surface-muted)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]',
)

export const adminTableTh = cn('px-4 py-3')

export const adminTableTd = cn('border-t border-[var(--admin-border)] px-4 py-3 align-middle')

export const adminNavLink = cn(
  'flex items-center gap-3 rounded-[var(--admin-radius)] px-3 py-2.5 text-sm font-medium',
  'text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-soft)] hover:text-[var(--admin-text)]',
)

export const adminNavLinkActive = cn(
  'bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] font-semibold',
)

export const adminFieldError = cn('mt-1 text-xs text-[var(--admin-danger)]')
