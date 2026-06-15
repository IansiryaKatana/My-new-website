import { ImagePlus, Link2, X } from 'lucide-react'
import { useState } from 'react'

import { adminInput, adminLabel } from '../adminClassNames'
import { MediaPickerModal } from './MediaPickerModal'

export function MultiImageUploadField({
  label,
  values,
  onChange,
  folder,
  hint,
}: {
  label: string
  values: string[]
  onChange: (urls: string[]) => void
  folder: string
  hint?: string
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index))
  }

  function addUrl() {
    const url = urlDraft.trim()
    if (!url) return
    onChange([...values, url])
    setUrlDraft('')
  }

  return (
    <div className="grid gap-2">
      <span className={adminLabel}>{label}</span>
      {hint ? <p className="font-sans text-xs text-[var(--admin-fg-muted)]">{hint}</p> : null}

      {values.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-[4/3] overflow-hidden border border-[var(--admin-border-subtle)]"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center bg-white/95 text-[var(--admin-fg)] hover:bg-[var(--admin-primary)] hover:text-[var(--admin-cream)]"
                aria-label="Remove image"
                onClick={() => removeAt(index)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--admin-border)] bg-white px-4 py-5 transition-colors hover:border-[var(--admin-primary)] hover:bg-white/80"
        onClick={() => setPickerOpen(true)}
      >
        <ImagePlus className="h-7 w-7 text-[var(--admin-fg-subtle)]" />
        <span className="font-sans text-sm text-[var(--admin-fg)]">Add media</span>
        <span className="font-sans text-xs text-[var(--admin-fg-muted)]">
          Choose from library or upload from computer
        </span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 self-start font-sans text-xs text-[var(--admin-fg-muted)] underline-offset-2 hover:text-[var(--admin-fg)] hover:underline"
        onClick={() => setShowUrl((v) => !v)}
      >
        <Link2 className="h-3.5 w-3.5" />
        {showUrl ? 'Hide URL field' : 'Paste image URL instead'}
      </button>

      {showUrl ? (
        <div className="flex flex-wrap gap-2">
          <input
            className={`${adminInput} min-w-0 flex-1`}
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
          />
          <button
            type="button"
            className="border border-[var(--admin-border)] px-3 py-2 font-sans text-xs text-[var(--admin-fg)] hover:bg-[var(--admin-primary)] hover:text-[var(--admin-cream)]"
            onClick={addUrl}
          >
            Add URL
          </button>
        </div>
      ) : null}

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        folder={folder}
        mode="multiple"
        accept="image"
        title={`Add ${label.toLowerCase()}`}
        onSelect={(urls) => onChange([...values, ...urls])}
      />
    </div>
  )
}
