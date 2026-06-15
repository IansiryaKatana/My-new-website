import { useCallback, useEffect, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import { getSupabase } from '@/integrations/supabase/client'
import { adminBtn, adminInput } from '../adminClassNames'
import { AdminPageHeading } from '../components/AdminPageHeading'

const KEYS = [
  { key: 'brand_name', label: 'Brand name' },
  { key: 'hero_headline', label: 'Hero headline' },
  { key: 'hero_subheadline', label: 'Hero subheadline' },
  { key: 'hero_trust_copy', label: 'Hero trust copy' },
  { key: 'contact_phone', label: 'Contact phone' },
  { key: 'contact_availability', label: 'Availability note' },
  { key: 'hero_image', label: 'Hero image URL' },
  { key: 'faq_image', label: 'FAQ image URL' },
  { key: 'cta_image', label: 'CTA image URL' },
] as const

export function AdminSiteSettings() {
  const { refetch } = useCms()
  const [values, setValues] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('site_settings').select('key, value')
    const map: Record<string, string> = {}
    for (const row of data ?? []) {
      const v = row.value
      map[row.key] =
        typeof v === 'string' ? v.replace(/^"|"$/g, '') : JSON.stringify(v)
    }
    setValues(map)
  }, [])

  useEffect(() => { void load() }, [load])

  const save = async () => {
    setBusy(true)
    const sb = getSupabase()
    if (!sb) return
    for (const { key } of KEYS) {
      const raw = values[key] ?? ''
      await sb.from('site_settings').upsert({
        key,
        value: JSON.stringify(raw),
        updated_at: new Date().toISOString(),
      })
    }
    setBusy(false)
    setMsg('Saved. Public site will refresh on next load.')
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title="Site settings" description="Branding and global copy" />
      <div className="max-w-xl space-y-4 border border-[#d8d2c7] bg-white p-6">
        {KEYS.map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs uppercase tracking-wider text-[#8b897f]">{label}</label>
            <input
              className={`${adminInput} mt-1`}
              value={values[key] ?? ''}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
          </div>
        ))}
        <button type="button" className={adminBtn} disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save settings'}
        </button>
        {msg && <p className="text-sm text-[#46482f]">{msg}</p>}
      </div>
    </div>
  )
}
