import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/cms/types'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  navItems: NavItem[]
}

export function MobileMenu({ open, onClose, navItems }: MobileMenuProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[var(--deep-green)]"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="flex items-center justify-end px-5 pt-5 sm:px-8">
        <button
          type="button"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="size-6" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-2 px-6 sm:px-10">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={onClose}
            className={cn(
              'py-3 text-4xl font-bold uppercase tracking-wide text-white no-underline transition sm:text-5xl md:text-6xl',
              item.isHighlighted &&
                'text-[var(--lime)] drop-shadow-[0_0_12px_rgba(232,243,63,0.65)]',
              !item.isHighlighted && 'hover:text-[var(--lime)]/80',
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-6 sm:px-10">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full border border-white/30 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </div>
  )
}
