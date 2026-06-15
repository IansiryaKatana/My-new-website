import { useRef, useState } from 'react'
import { uploadCmsImage } from '#/lib/cms/uploadCmsImage'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'general',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onFile(file: File) {
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
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL"
      />
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void onFile(f)
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Uploading…' : 'Upload'}
        </Button>
      </div>
      {value && (
        <img src={value} alt="" className="h-24 w-auto object-cover border" />
      )}
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  )
}
