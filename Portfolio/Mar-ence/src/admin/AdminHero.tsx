import { useCallback, useEffect, useState } from 'react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { ImageUploadField } from './components/ImageUploadField'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'

type Row = Database['public']['Tables']['hero_content']['Row']

export function AdminHero() {
  const { refetch } = useCms()
  const [row, setRow] = useState<Row | null>(null)
  const [draft, setDraft] = useState<Partial<Row>>({})
  const [open, setOpen] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('hero_content').select('*').limit(1).maybeSingle()
    setRow(data)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  function openEdit() {
    setDraft(
      row ?? {
        id: crypto.randomUUID(),
        logo_text: 'Valence Capital',
        title_line_one: 'Valence',
        title_line_two: 'Capital',
        intro_text: '',
        statement: '',
        background_image_url: '',
        primary_cta_label: 'Submit Opportunity',
        primary_cta_href: '#submit',
        secondary_cta_label: "Let's Talk",
        secondary_cta_href: '#contact',
        published: true,
      },
    )
    setSaveErr(null)
    setOpen(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb || !draft.logo_text) return
    setBusy(true)
    setSaveErr(null)
    const payload = {
      ...draft,
      updated_at: new Date().toISOString(),
    } as Row
    const { error } = await sb.from('hero_content').upsert(payload, { onConflict: 'id' })
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
      <AdminPageHeading
        title="Hero"
        description="Homepage hero: title, copy, background image, and CTAs."
      />
      <Button type="button" onClick={openEdit}>
        {row ? 'Edit hero' : 'Create hero'}
      </Button>
      {row && (
        <div className="mt-6 bg-white border rounded-lg p-4 text-sm space-y-1">
          <p>
            <strong>Title:</strong> {row.title_line_one} {row.title_line_two}
          </p>
          <p className="text-gray-600 line-clamp-2">{row.intro_text}</p>
        </div>
      )}

      <AdminModal
        open={open}
        onOpenChange={setOpen}
        title="Edit hero"
        onSave={() => void save()}
        busy={busy}
        saveError={saveErr}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo text</Label>
            <Input
              value={draft.logo_text ?? ''}
              onChange={(e) => setDraft({ ...draft, logo_text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Title line 1</Label>
            <Input
              value={draft.title_line_one ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, title_line_one: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Title line 2</Label>
            <Input
              value={draft.title_line_two ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, title_line_two: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Intro</Label>
            <textarea
              className="admin-input min-h-[80px]"
              value={draft.intro_text ?? ''}
              onChange={(e) => setDraft({ ...draft, intro_text: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Statement (use new lines)</Label>
            <textarea
              className="admin-input min-h-[60px]"
              value={draft.statement ?? ''}
              onChange={(e) => setDraft({ ...draft, statement: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Background image"
              value={draft.background_image_url ?? ''}
              onChange={(url) =>
                setDraft({ ...draft, background_image_url: url })
              }
              folder="hero"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA label</Label>
            <Input
              value={draft.primary_cta_label ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, primary_cta_label: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA href</Label>
            <Input
              value={draft.primary_cta_href ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, primary_cta_href: e.target.value })
              }
            />
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
