import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Json, Tables } from '#/integrations/supabase/database.types'
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminInput,
  adminLabel,
} from './adminClassNames'
import { AdminPageHeading } from './components/AdminPageHeading'
import { ImageUploadField } from './components/ImageUploadField'

type SectionRow = Tables<'content_sections'>

const SECTION_KEYS = ['hero', 'essence', 'promo', 'flavor', 'footer'] as const

type SectionKey = (typeof SECTION_KEYS)[number]

type FieldDef =
  | { key: string; label: string; type: 'text' | 'url' | 'checkbox' }
  | { key: string; label: string; type: 'string-list' }
  | { key: string; label: string; type: 'fruit-cards' }

const SECTION_FIELDS: Record<SectionKey, FieldDef[]> = {
  hero: [
    { key: 'headlineMain', label: 'Headline main', type: 'text' },
    { key: 'headlineSub', label: 'Headline sub', type: 'text' },
    { key: 'bgImageUrl', label: 'Background image', type: 'url' },
    { key: 'ctaText', label: 'CTA text', type: 'text' },
    { key: 'ctaHref', label: 'CTA href', type: 'text' },
    { key: 'badgeText', label: 'Badge text', type: 'text' },
    { key: 'microCardTitle', label: 'Micro card title', type: 'text' },
    { key: 'microCardDescription', label: 'Micro card description', type: 'text' },
    { key: 'showFrame', label: 'Show frame', type: 'checkbox' },
  ],
  essence: [
    { key: 'headingMain', label: 'Heading main', type: 'text' },
    { key: 'headingAccent', label: 'Heading accent', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'imageUrl', label: 'Image', type: 'url' },
    { key: 'captionLeft', label: 'Caption left', type: 'text' },
    { key: 'captionRight', label: 'Caption right', type: 'text' },
  ],
  promo: [
    { key: 'leftTitle', label: 'Left title', type: 'text' },
    { key: 'leftAccent', label: 'Left accent', type: 'text' },
    { key: 'productImageUrl', label: 'Product image', type: 'url' },
    { key: 'lifestyleImageUrl', label: 'Lifestyle image', type: 'url' },
    { key: 'ctaText', label: 'CTA text', type: 'text' },
    { key: 'ctaHref', label: 'CTA href', type: 'text' },
    { key: 'supportLines', label: 'Support lines (one per line)', type: 'string-list' },
    { key: 'marqueeWords', label: 'Marquee words (one per line)', type: 'string-list' },
  ],
  flavor: [
    { key: 'headingMain', label: 'Heading main', type: 'text' },
    { key: 'headingAccent', label: 'Heading accent', type: 'text' },
    { key: 'productImageUrl', label: 'Product image', type: 'url' },
    { key: 'productLabel', label: 'Product label', type: 'text' },
    { key: 'ctaText', label: 'CTA text', type: 'text' },
    { key: 'ctaHref', label: 'CTA href', type: 'text' },
    { key: 'labelLeft', label: 'Label left', type: 'text' },
    { key: 'labelRight', label: 'Label right', type: 'text' },
    { key: 'fruitCards', label: 'Fruit cards', type: 'fruit-cards' },
  ],
  footer: [
    { key: 'newsletterTitle', label: 'Newsletter title', type: 'text' },
    { key: 'newsletterPlaceholder', label: 'Newsletter placeholder', type: 'text' },
    { key: 'wordmark', label: 'Wordmark', type: 'text' },
    { key: 'copyright', label: 'Copyright', type: 'text' },
  ],
}

function asRecord(payload: Json): Record<string, unknown> {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload as Record<string, unknown>
  }
  return {}
}

export function AdminSections() {
  const { refetch: refetchCms } = useCms()
  const [rows, setRows] = useState<SectionRow[]>([])
  const [activeKey, setActiveKey] = useState<SectionKey>('hero')
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  const activeRow = rows.find((row) => row.section_key === activeKey)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .in('section_key', [...SECTION_KEYS])
      .order('section_key')

    if (error) setErr(error.message)
    else setRows(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const row = rows.find((item) => item.section_key === activeKey)
    setDraft(asRecord(row?.payload ?? {}))
    setPublished(row?.published ?? true)
  }, [rows, activeKey])

  const setField = (key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setSaving(true)
    setSaveErr(null)

    const payload = {
      id: activeRow?.id ?? crypto.randomUUID(),
      section_key: activeKey,
      payload: draft as Json,
      published,
    }

    const { error } = await supabase.from('content_sections').upsert(payload, { onConflict: 'id' })
    setSaving(false)

    if (error) {
      setSaveErr(error.message)
      return
    }

    await refresh()
    await refetchCms()
  }

  const renderField = (field: FieldDef) => {
    const value = draft[field.key]

    if (field.type === 'url') {
      return (
        <ImageUploadField
          key={field.key}
          label={field.label}
          value={String(value ?? '')}
          folder={`sections/${activeKey}`}
          onChange={(url) => setField(field.key, url)}
        />
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label key={field.key} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => setField(field.key, event.target.checked)}
          />
          {field.label}
        </label>
      )
    }

    if (field.type === 'string-list') {
      const lines = Array.isArray(value) ? value.map(String).join('\n') : ''
      return (
        <div key={field.key}>
          <label className={adminLabel}>{field.label}</label>
          <textarea
            className={`${adminInput} min-h-28`}
            value={lines}
            onChange={(event) =>
              setField(
                field.key,
                event.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
      )
    }

    if (field.type === 'fruit-cards') {
      const cards = Array.isArray(value)
        ? (value as Array<{ name?: string; imageUrl?: string }>)
        : []
      return (
        <div key={field.key} className="space-y-3">
          <p className={adminLabel}>{field.label}</p>
          {cards.map((card, index) => (
            <div key={index} className="grid gap-3 rounded-[var(--admin-radius)] border border-[var(--admin-border)] p-3 sm:grid-cols-2">
              <div>
                <label className={adminLabel}>Name</label>
                <input
                  className={adminInput}
                  value={card.name ?? ''}
                  onChange={(event) => {
                    const next = [...cards]
                    next[index] = { ...next[index], name: event.target.value }
                    setField(field.key, next)
                  }}
                />
              </div>
              <ImageUploadField
                label="Image"
                value={card.imageUrl ?? ''}
                folder="sections/flavor"
                onChange={(url) => {
                  const next = [...cards]
                  next[index] = { ...next[index], imageUrl: url }
                  setField(field.key, next)
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className={adminBtnSecondary}
            onClick={() => setField(field.key, [...cards, { name: '', imageUrl: '' }])}
          >
            Add fruit card
          </button>
        </div>
      )
    }

    return (
      <div key={field.key}>
        <label className={adminLabel}>{field.label}</label>
        <input
          className={adminInput}
          value={String(value ?? '')}
          onChange={(event) => setField(field.key, event.target.value)}
        />
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeading
        title="Landing Sections"
        description="Edit hero, essence, promo, flavor, and footer content blocks."
        actions={
          <>
            <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
              Refresh
            </button>
            <button type="button" className={adminBtnPrimary} disabled={saving} onClick={() => void save()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save section
            </button>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
        </div>
      ) : null}
      {err ? <p className="text-sm text-[var(--admin-danger)]">{err}</p> : null}

      {!loading ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-wrap gap-2 lg:w-56 lg:flex-col">
            {SECTION_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={`rounded-[var(--admin-radius)] px-4 py-2 text-left text-sm font-medium capitalize transition ${
                  activeKey === key
                    ? 'bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]'
                    : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-muted)]'
                }`}
                onClick={() => setActiveKey(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <div className={`${adminCard} flex-1 space-y-4 p-5`}>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
              Published
            </label>
            {SECTION_FIELDS[activeKey].map(renderField)}
            {saveErr ? <p className="text-sm text-[var(--admin-danger)]">{saveErr}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
