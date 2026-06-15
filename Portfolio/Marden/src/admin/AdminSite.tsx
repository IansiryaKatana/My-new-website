import { useCallback, useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'

export function AdminSite() {
  const { refetch: refetchCms } = useCms()
  const [brand, setBrand] = useState('Marden')
  const [primary, setPrimary] = useState('#003F35')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('site_settings').select('key, value')
    for (const row of data ?? []) {
      if (row.key === 'brand_name') setBrand(String(row.value).replace(/"/g, '') || 'Marden')
      if (row.key === 'admin_primary') setPrimary(String(row.value).replace(/"/g, '') || '#003F35')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    setBusy(true)
    await sb.from('site_settings').upsert([
      { key: 'brand_name', value: brand },
      { key: 'admin_primary', value: primary },
    ])
    setBusy(false)
    setMsg('Saved.')
    document.documentElement.style.setProperty('--admin-primary', primary)
    await refetchCms()
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Site settings</h1>
      <div className="max-w-md space-y-4 rounded-lg border bg-white p-6">
        <div>
          <Label>Brand name</Label>
          <Input className="mt-1" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div>
          <Label>Admin primary color</Label>
          <Input className="mt-1" value={primary} onChange={(e) => setPrimary(e.target.value)} />
        </div>
        {msg && <p className="text-xs text-green-700">{msg}</p>}
        <Button variant="admin" type="button" disabled={busy} onClick={() => void save()}>
          Save settings
        </Button>
      </div>
    </div>
  )
}
