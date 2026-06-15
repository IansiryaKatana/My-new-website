import { useEffect, useState } from 'react'

import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'
import { adminBtn, adminBtnPrimary, adminInput, adminLabel } from './adminClassNames'
import { AdminPageHeading } from './components/AdminPageHeading'
import { ImageUploadField } from './components/ImageUploadField'

type HeroRow = Tables<'hero_content'>

function linesToText(lines: unknown) {
  if (!Array.isArray(lines)) return ''
  return lines.filter((l) => typeof l === 'string').join('\n')
}

function textToLines(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export function AdminHero() {
  const { refetch } = useCms()
  const [row, setRow] = useState<HeroRow | null>(null)
  const [draft, setDraft] = useState<Partial<HeroRow>>({})
  const [err, setErr] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data, error } = await sb.from('hero_content').select('*').limit(1).maybeSingle()
    if (error) {
      setErr(error.message)
      return
    }
    setRow(data)
    setDraft(data ?? { id: crypto.randomUUID(), name: '', role: '' })
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function save() {
    const sb = getSupabase()
    if (!sb || !draft.name?.trim() || !draft.role?.trim()) {
      setSaveErr('Name and role are required.')
      return
    }
    setBusy(true)
    setSaveErr(null)
    const payload = {
      ...draft,
      name: draft.name.trim(),
      role: draft.role.trim(),
      published: draft.published ?? true,
    }
    const { error } = await sb.from('hero_content').upsert(payload as HeroRow, { onConflict: 'id' })
    setBusy(false)
    if (error) {
      setSaveErr(error.message)
      return
    }
    await refresh()
    await refetch()
  }

  if (err) return <p className="text-[#e88]">{err}</p>
  if (!draft.id) return <p>Loading…</p>

  return (
    <div>
      <AdminPageHeading title="Hero" description="Homepage hero content and portrait." />
      <div className="grid max-w-3xl gap-4">
        <label className="grid gap-2">
          <span className={adminLabel}>Name</span>
          <input className={adminInput} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Role</span>
          <input className={adminInput} value={draft.role ?? ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Left intro (one line per row)</span>
          <textarea className={`${adminInput} min-h-24`} value={linesToText(draft.left_intro)} onChange={(e) => setDraft({ ...draft, left_intro: textToLines(e.target.value) })} />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Expertise line</span>
          <input className={adminInput} value={draft.expertise ?? ''} onChange={(e) => setDraft({ ...draft, expertise: e.target.value })} />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Right intro</span>
          <textarea className={`${adminInput} min-h-24`} value={linesToText(draft.right_intro)} onChange={(e) => setDraft({ ...draft, right_intro: textToLines(e.target.value) })} />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Right secondary</span>
          <textarea className={`${adminInput} min-h-20`} value={linesToText(draft.right_secondary)} onChange={(e) => setDraft({ ...draft, right_secondary: textToLines(e.target.value) })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className={adminLabel}>CTA label</span>
            <input className={adminInput} value={draft.cta_label ?? ''} onChange={(e) => setDraft({ ...draft, cta_label: e.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className={adminLabel}>CTA href</span>
            <input className={adminInput} value={draft.cta_href ?? ''} onChange={(e) => setDraft({ ...draft, cta_href: e.target.value })} />
          </label>
        </div>
        <label className="grid gap-2">
          <span className={adminLabel}>Tags (comma separated)</span>
          <input
            className={adminInput}
            value={Array.isArray(draft.tags) ? (draft.tags as string[]).join(', ') : ''}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
          />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Ticker (comma separated)</span>
          <input
            className={adminInput}
            value={Array.isArray(draft.ticker) ? (draft.ticker as string[]).join(', ') : ''}
            onChange={(e) => setDraft({ ...draft, ticker: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
          />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Badge text</span>
          <input className={adminInput} value={draft.badge_text ?? ''} onChange={(e) => setDraft({ ...draft, badge_text: e.target.value })} />
        </label>
        <ImageUploadField
          label="Subject image"
          folder="hero"
          value={draft.subject_image_url ?? ''}
          onChange={(url) => setDraft({ ...draft, subject_image_url: url })}
        />
        <label className="grid gap-2">
          <span className={adminLabel}>Subject alt text</span>
          <input className={adminInput} value={draft.subject_alt ?? ''} onChange={(e) => setDraft({ ...draft, subject_alt: e.target.value })} />
        </label>
        <label className="flex items-center gap-2 font-sans text-sm">
          <input type="checkbox" checked={draft.published ?? true} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
          Published
        </label>
        {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
        <div className="flex gap-2">
          <button type="button" className={adminBtnPrimary} disabled={busy} onClick={() => void save()}>
            {busy ? 'Saving…' : 'Save hero'}
          </button>
          {row ? (
            <button type="button" className={adminBtn} onClick={() => setDraft(row)}>
              Reset
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

