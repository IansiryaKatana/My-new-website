import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

type Props = {
  label: string
  value: string
  onChange: (url: string) => void
}

export function ImageUploadField({ label, value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload via Media library"
      />
      {value && (
        <img src={value} alt="" className="h-20 w-32 rounded object-cover border" />
      )}
      <p className="text-[11px] text-[var(--admin-muted)]">
        Paste a public image URL. Connect Supabase Storage + Media page for uploads.
      </p>
    </div>
  )
}
