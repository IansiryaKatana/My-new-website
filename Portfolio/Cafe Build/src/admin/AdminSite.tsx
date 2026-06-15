import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Json } from '#/integrations/supabase/database.types'
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminCard,
  adminInput,
  adminLabel,
} from './adminClassNames'
import { AdminPageHeading } from './components/AdminPageHeading'

interface BrandSettings {
  name: string
  tagline: string
  primaryColor: string
  limeColor: string
  creamColor: string
}

const DEFAULT_BRAND: BrandSettings = {
  name: 'NGUNJUK',
  tagline: 'Matcha On Perfect',
  primaryColor: '#103b27',
  limeColor: '#e8f33f',
  creamColor: '#f7f0da',
}

export function AdminSite() {
  const { refetch: refetchCms } = useCms()
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    setErr(null)

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'brand')
      .maybeSingle()

    if (error) {
      setErr(error.message)
    } else if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
      setBrand({ ...DEFAULT_BRAND, ...(data.value as BrandSettings) })
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const save = async () => {
    const supabase = getSupabase()
    if (!supabase) return

    if (!brand.name.trim()) {
      setSaveErr('Brand name is required.')
      return
    }

    setSaving(true)
    setSaveErr(null)

    const { error } = await supabase.from('site_settings').upsert(
      {
        key: 'brand',
        value: {
          ...brand,
          name: brand.name.trim(),
          tagline: brand.tagline.trim(),
        } as Json,
      },
      { onConflict: 'key' },
    )

    setSaving(false)

    if (error) {
      setSaveErr(error.message)
      return
    }

    document.documentElement.style.setProperty('--admin-primary', brand.primaryColor)
    window.dispatchEvent(new CustomEvent('ngunjuk-admin-brand-updated'))
    await refetchCms()
  }

  return (
    <div>
      <AdminPageHeading
        title="Site Settings"
        description="Global brand settings stored under the site_settings brand key."
        actions={
          <>
            <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
              Refresh
            </button>
            <button type="button" className={adminBtnPrimary} disabled={saving} onClick={() => void save()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save settings
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
        <div className={`${adminCard} max-w-2xl space-y-4 p-5`}>
          <div>
            <label className={adminLabel}>Brand name</label>
            <input
              className={adminInput}
              value={brand.name}
              onChange={(event) => setBrand({ ...brand, name: event.target.value })}
            />
          </div>
          <div>
            <label className={adminLabel}>Tagline</label>
            <input
              className={adminInput}
              value={brand.tagline}
              onChange={(event) => setBrand({ ...brand, tagline: event.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={adminLabel}>Primary color</label>
              <input
                type="color"
                className={`${adminInput} h-11 p-1`}
                value={brand.primaryColor}
                onChange={(event) => setBrand({ ...brand, primaryColor: event.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Lime color</label>
              <input
                type="color"
                className={`${adminInput} h-11 p-1`}
                value={brand.limeColor}
                onChange={(event) => setBrand({ ...brand, limeColor: event.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Cream color</label>
              <input
                type="color"
                className={`${adminInput} h-11 p-1`}
                value={brand.creamColor}
                onChange={(event) => setBrand({ ...brand, creamColor: event.target.value })}
              />
            </div>
          </div>
          {saveErr ? <p className="text-sm text-[var(--admin-danger)]">{saveErr}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
