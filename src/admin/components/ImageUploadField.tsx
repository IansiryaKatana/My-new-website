import { useState } from 'react'

import { uploadCmsImage } from '../../lib/cms/uploadCmsImage'
import { adminBtn, adminInput, adminLabel } from '../adminClassNames'

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  folder: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

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

  return (
    <div className="grid gap-2">
      <span className={adminLabel}>{label}</span>
      <input
        className={adminInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className={adminBtn}>
          {busy ? 'Uploading…' : 'Upload file'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {value ? (
        <img src={value} alt="" className="mt-2 max-h-32 border border-[var(--admin-cream)]/20 object-cover" />
      ) : null}
      {err ? <p className="text-xs text-[#e88]">{err}</p> : null}
    </div>
  )
}

