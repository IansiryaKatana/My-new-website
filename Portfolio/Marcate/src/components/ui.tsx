import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'
import type { InputHTMLAttributes, ReactNode, ButtonHTMLAttributes } from 'react'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-xl border border-[var(--border)] bg-[var(--card)]', className)}>{children}</div>
}

export function Button({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition',
        'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-9 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none',
        'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
        props.className,
      )}
    />
  )
}

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        'bg-slate-100 text-slate-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function CrudDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(95vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-md p-1 hover:bg-slate-100" aria-label="Close dialog">
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
