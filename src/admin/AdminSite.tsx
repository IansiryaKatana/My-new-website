import { useEffect, useRef, useState } from 'react'

import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'
import { siteConfig as staticSite } from '../data/site'
import { uploadCmsDocument } from '../lib/cms/uploadCmsDocument'
import { adminBtn, adminBtnPrimary, adminInput, adminLabel } from './adminClassNames'
import { AdminPageHeading } from './components/AdminPageHeading'

export function AdminSite() {
  const { refetch, snapshot } = useCms()
  const [json, setJson] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [cvUrl, setCvUrl] = useState('')
  const [cvFileName, setCvFileName] = useState('')
  const [cvBusy, setCvBusy] = useState(false)
  const [cvErr, setCvErr] = useState<string | null>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setJson(JSON.stringify(snapshot.siteConfig, null, 2))
    setCvUrl(snapshot.siteConfig.cvUrl ?? '')
    setCvFileName(snapshot.siteConfig.cvFileName ?? '')
  }, [snapshot.siteConfig])

  async function saveProfile(profile: Record<string, unknown>) {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase is not configured.' }

    const { error } = await sb
      .from('site_settings')
      .upsert({ key: 'profile', value: profile as never }, { onConflict: 'key' })

    if (error) return { error: error.message }
    await refetch()
    return {}
  }

  async function save() {
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
    const result = await saveProfile(parsed as Record<string, unknown>)
    setBusy(false)
    if (result.error) {
      setSaveErr(result.error)
    }
  }

  async function saveCvFields(nextUrl: string, nextFileName: string) {
    const profile = {
      ...snapshot.siteConfig,
      cvUrl: nextUrl || undefined,
      cvFileName: nextFileName || undefined,
    }
    const result = await saveProfile(profile as Record<string, unknown>)
    if (result.error) {
      setCvErr(result.error)
      return false
    }
    setJson(JSON.stringify(profile, null, 2))
    return true
  }

  async function handleCvUpload(file: File) {
    setCvBusy(true)
    setCvErr(null)

    const result = await uploadCmsDocument(file, 'documents/cv')
    if ('error' in result) {
      setCvBusy(false)
      setCvErr(result.error)
      return
    }

    const saved = await saveCvFields(result.publicUrl, result.fileName)
    if (saved) {
      setCvUrl(result.publicUrl)
      setCvFileName(result.fileName)
    }
    setCvBusy(false)
  }

  async function removeCv() {
    setCvBusy(true)
    setCvErr(null)
    const saved = await saveCvFields('', '')
    if (saved) {
      setCvUrl('')
      setCvFileName('')
    }
    setCvBusy(false)
  }

  async function loadFromStatic() {
    setJson(JSON.stringify(staticSite, null, 2))
  }

  return (
    <div className="grid gap-10">
      <section className="grid gap-4">
        <AdminPageHeading
          title="CV / Resume"
          description="Upload your latest PDF or DOCX. Visitors can download it from the About and Experience pages."
        />

        <input
          ref={cvInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleCvUpload(file)
            e.target.value = ''
          }}
        />

        {cvUrl ? (
          <div className="grid gap-3 rounded border border-[var(--admin-cream)]/20 p-4">
            <p className="font-sans text-sm">
              Current file:{' '}
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {cvFileName || 'Download CV'}
              </a>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={adminBtnPrimary}
                disabled={cvBusy}
                onClick={() => cvInputRef.current?.click()}
              >
                {cvBusy ? 'Uploading…' : 'Replace CV'}
              </button>
              <button type="button" className={adminBtn} disabled={cvBusy} onClick={() => void removeCv()}>
                Remove CV
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={adminBtnPrimary}
            disabled={cvBusy}
            onClick={() => cvInputRef.current?.click()}
          >
            {cvBusy ? 'Uploading…' : 'Upload CV (PDF or DOCX)'}
          </button>
        )}

        {cvErr ? <p className="text-sm text-[#e88]">{cvErr}</p> : null}
      </section>

      <section className="grid gap-4">
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
      </section>
    </div>
  )
}
