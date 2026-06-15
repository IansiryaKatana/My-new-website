import { useCallback, useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminPageHeading } from './components/AdminPageHeading'
import { ImageUploadField } from './components/ImageUploadField'

type Row = Database['public']['Tables']['hero_content']['Row']

export function AdminHero() {
  const { refetch: refetchCms } = useCms()
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('hero_content').select('*').limit(1).maybeSingle()
    setDraft(
      data ?? {
        id: crypto.randomUUID(),
        headline_line1: 'Energy Systems',
        headline_line2: 'for a Sustainable World.',
        cta_label: 'About Marden',
        cta_url: '#about',
        background_image_url: '',
        published: true,
      },
    )
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function save() {
    if (!draft?.background_image_url?.trim()) {
      setSaveErr('Background image URL is required.')
      return
    }
    const sb = getSupabase()
    if (!sb) return
    setBusy(true)
    const { error } = await sb.from('hero_content').upsert({
      ...draft,
      updated_at: new Date().toISOString(),
    } as Row)
    setBusy(false)
    if (error) setSaveErr(error.message)
    else {
      setSaveErr(null)
      await refetchCms()
    }
  }

  if (!draft) return <p className="text-sm">Loading...</p>

  return (
    <div>
      <AdminPageHeading title="Hero" description="Homepage cinematic hero block." />
      <div className="max-w-xl space-y-4 rounded-lg border bg-white p-6">
        <div>
          <Label>Headline line 1</Label>
          <Input
            className="mt-1"
            value={draft.headline_line1 ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d!, headline_line1: e.target.value }))}
          />
        </div>
        <div>
          <Label>Headline line 2</Label>
          <Input
            className="mt-1"
            value={draft.headline_line2 ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d!, headline_line2: e.target.value }))}
          />
        </div>
        <div>
          <Label>Subcopy</Label>
          <textarea
            className="mt-1 w-full rounded border p-2 text-sm"
            rows={3}
            value={draft.subcopy ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d!, subcopy: e.target.value }))}
          />
        </div>
        <ImageUploadField
          label="Background image"
          value={draft.background_image_url ?? ''}
          onChange={(url) => setDraft((d) => ({ ...d!, background_image_url: url }))}
        />
        <ImageUploadField
          label="Thumbnail (metrics card)"
          value={draft.thumbnail_image_url ?? ''}
          onChange={(url) => setDraft((d) => ({ ...d!, thumbnail_image_url: url }))}
        />
        {saveErr && <p className="text-xs text-red-600">{saveErr}</p>}
        <Button variant="admin" type="button" disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving...' : 'Save hero'}
        </Button>
      </div>
    </div>
  )
}
