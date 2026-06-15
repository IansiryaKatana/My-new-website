import { useEffect, useState } from 'react'

import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'
import { siteConfig as staticSite } from '../data/site'
import { adminBtnPrimary, adminInput, adminLabel } from './adminClassNames'
import { AdminPageHeading } from './components/AdminPageHeading'

export function AdminSite() {
  const { refetch, snapshot } = useCms()
  const [json, setJson] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setJson(JSON.stringify(snapshot.siteConfig, null, 2))
  }, [snapshot.siteConfig])

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    setBusy(true)
    setSaveErr(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch {
      setBusy(false)
      setSaveErr('Invalid JSON.')
      return
    }
    const { error } = await sb
      .from('site_settings')
      .upsert({ key: 'profile', value: parsed as never }, { onConflict: 'key' })
    setBusy(false)
    if (error) {
      setSaveErr(error.message)
      return
    }
    await refetch()
  }

  async function loadFromStatic() {
    setJson(JSON.stringify(staticSite, null, 2))
  }

  return (
    <div>
      <AdminPageHeading
        title="Site settings"
        description="Global profile, navigation, contact, and SEO defaults (stored as profile key)."
        actions={
          <button type="button" className={adminBtnPrimary} onClick={() => void loadFromStatic()}>
            Load static defaults
          </button>
        }
      />
      {err ? <p className="text-[#e88]">{err}</p> : null}
      <textarea
        className={`${adminInput} min-h-[480px] font-mono text-xs`}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      {saveErr ? <p className="mt-2 text-sm text-[#e88]">{saveErr}</p> : null}
      <button type="button" className={`${adminBtnPrimary} mt-4`} disabled={busy} onClick={() => void save()}>
        {busy ? 'Saving…' : 'Save site settings'}
      </button>
    </div>
  )
}

