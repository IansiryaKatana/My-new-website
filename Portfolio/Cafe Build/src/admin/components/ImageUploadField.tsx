import { useRef, useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { getSupabase } from '#/integrations/supabase/client'
import { uploadCmsImage } from '#/lib/cms/uploadCmsImage'
import { adminBtnSecondary, adminInput, adminLabel } from '../adminClassNames'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
  altText?: string
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'general',
  altText = '',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | null) => {
    if (!file) return

    const supabase = getSupabase()
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const result = await uploadCmsImage(supabase, file, { folder, altText })
      onChange(result.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className={adminLabel}>{label}</label>

      {value ? (
        <div className="overflow-hidden rounded-[var(--admin-radius)] border border-[var(--admin-border)]">
          <img src={value} alt={altText || label} className="h-36 w-full object-cover" />
        </div>
      ) : null}

      <input
        type="url"
        className={adminInput}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://..."
      />

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          className={adminBtnSecondary}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Upload image
        </button>
      </div>

      {error ? <p className="text-xs text-[var(--admin-danger)]">{error}</p> : null}
    </div>
  )
}
