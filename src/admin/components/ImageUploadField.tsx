import { ImagePlus, Link2 } from 'lucide-react'
import { useState } from 'react'

import { adminInput, adminLabel } from '../adminClassNames'
import { MediaPickerModal } from './MediaPickerModal'

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  folder: string
  hint?: string
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showUrl, setShowUrl] = useState(false)

  return (
    <div className="grid gap-2">
      <span className={adminLabel}>{label}</span>
      {hint ? <p className="font-sans text-xs text-[var(--admin-fg-muted)]">{hint}</p> : null}

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt=""
            className="max-h-40 w-full border border-[var(--admin-border-subtle)] object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              type="button"
              className="border border-[var(--admin-border)] bg-white/95 px-2 py-1 font-sans text-xs text-[var(--admin-fg)] hover:bg-[var(--admin-primary)] hover:text-[var(--admin-cream)]"
              onClick={() => setPickerOpen(true)}
            >
              Replace
            </button>
            <button
              type="button"
              className="border border-[var(--admin-border)] bg-white/95 px-2 py-1 font-sans text-xs text-[var(--admin-fg)] hover:bg-[var(--admin-primary)] hover:text-[var(--admin-cream)]"
              onClick={() => onChange('')}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--admin-border)] bg-white px-4 py-6 transition-colors hover:border-[var(--admin-primary)] hover:bg-white/80"
          onClick={() => setPickerOpen(true)}
        >
          <ImagePlus className="h-8 w-8 text-[var(--admin-fg-subtle)]" />
          <span className="font-sans text-sm text-[var(--admin-fg)]">Select media</span>
          <span className="font-sans text-xs text-[var(--admin-fg-muted)]">
            Choose from library or upload from computer
          </span>
        </button>
      )}

      <button
        type="button"
        className="inline-flex items-center gap-1.5 self-start font-sans text-xs text-[var(--admin-fg-muted)] underline-offset-2 hover:text-[var(--admin-fg)] hover:underline"
        onClick={() => setShowUrl((v) => !v)}
      >
        <Link2 className="h-3.5 w-3.5" />
        {showUrl ? 'Hide URL field' : 'Paste image URL instead'}
      </button>

      {showUrl ? (
        <input
          className={adminInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      ) : null}

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        folder={folder}
        mode="single"
        accept="image"
        title={`Select ${label.toLowerCase()}`}
        onSelect={(urls) => onChange(urls[0] ?? '')}
      />
    </div>
  )
}
