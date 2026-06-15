import { useCallback, useEffect, useState } from 'react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import { AdminModal } from '../components/AdminModal'
import { AdminPageHeading } from '../components/AdminPageHeading'
import { ImageUploadField } from '../components/ImageUploadField'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'

type Field = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'image'
}

type AdminSingletonSectionProps = {
  title: string
  description: string
  table: string
  fields: Field[]
  emptyRow: () => Record<string, unknown>
}

export function AdminSingletonSection({
  title,
  description,
  table,
  fields,
  emptyRow,
}: AdminSingletonSectionProps) {
  const { refetch } = useCms()
  const [row, setRow] = useState<Record<string, unknown> | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [open, setOpen] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb
      .from(table as 'perspective_section')
      .select('*')
      .limit(1)
      .maybeSingle()
    setRow(data as Record<string, unknown> | null)
  }, [table])

  useEffect(() => {
    void refresh()
  }, [refresh])

  function openEdit() {
    setDraft(row ?? emptyRow())
    setSaveErr(null)
    setOpen(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    setBusy(true)
    const { error } = await sb
      .from(table as 'perspective_section')
      .upsert({ ...draft, updated_at: new Date().toISOString() } as never, {
        onConflict: 'id',
      })
    setBusy(false)
    if (error) {
      setSaveErr(error.message)
      return
    }
    setOpen(false)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title={title} description={description} />
      <Button type="button" onClick={openEdit}>
        {row ? 'Edit section' : 'Create section'}
      </Button>

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title={`Edit ${title}`}
        onSave={() => void save()}
        busy={busy}
        saveError={saveErr}
      >
        {fields.map((f) =>
          f.type === 'image' ? (
            <ImageUploadField
              key={f.key}
              label={f.label}
              value={String(draft[f.key] ?? '')}
              onChange={(url) => setDraft({ ...draft, [f.key]: url })}
              folder={table}
            />
          ) : f.type === 'textarea' ? (
            <div key={f.key} className="space-y-2">
              <Label>{f.label}</Label>
              <textarea
                className="admin-input min-h-[100px] w-full"
                value={String(draft[f.key] ?? '')}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </div>
          ) : (
            <div key={f.key} className="space-y-2">
              <Label>{f.label}</Label>
              <Input
                value={String(draft[f.key] ?? '')}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </div>
          ),
        )}
      </AdminModal>
    </div>
  )
}
