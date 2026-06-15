import { ImagePlus, Link2 } from 'lucide-react'
import { useState } from 'react'

import { uploadCmsImage } from '../../lib/cms/uploadCmsImage'
import { adminInput, adminLabel } from '../adminClassNames'

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
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [showUrl, setShowUrl] = useState(false)

  async function onFile(file: File | null) {
    if (!file) return
    setBusy(true)
    setErr(null)
    const result = await uploadCmsImage(file, folder)
    setBusy(false)
    if ('error' in result) {
      setErr(result.error)
      return
    }
    onChange(result.publicUrl)
  }

  async function onFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) await onFile(file)
  }

  return (
    <div className="grid gap-2">
      <span className={adminLabel}>{label}</span>
      {hint ? <p className="font-sans text-xs text-[var(--admin-fg-muted)]">{hint}</p> : null}

      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[var(--admin-border)] bg-white px-4 py-6 transition-colors hover:border-[var(--admin-primary)] hover:bg-white/80 ${busy ? 'pointer-events-none opacity-60' : ''}`}
      >
        <ImagePlus className="h-8 w-8 text-[var(--admin-fg-subtle)]" />
        <span className="font-sans text-sm text-[var(--admin-fg)]">
          {busy ? 'Uploading…' : 'Click to upload or drop an image'}
        </span>
        <span className="font-sans text-xs text-[var(--admin-fg-muted)]">PNG, JPG, WebP, GIF</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={busy}
          onChange={(e) => void onFiles(e.target.files)}
        />
      </label>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt=""
            className="max-h-40 w-full border border-[var(--admin-border-subtle)] object-cover"
          />
          <button
            type="button"
            className="absolute right-2 top-2 border border-[var(--admin-border)] bg-white/95 px-2 py-1 font-sans text-xs text-[var(--admin-fg)] hover:bg-[var(--admin-primary)] hover:text-[var(--admin-cream)]"
            onClick={() => onChange('')}
          >
            Remove
          </button>
        </div>
      ) : null}

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

      {err ? <p className="text-xs text-[#c44]">{err}</p> : null}
    </div>
  )
}
