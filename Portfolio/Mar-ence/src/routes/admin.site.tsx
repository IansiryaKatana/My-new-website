import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getSupabase } from '#/integrations/supabase/client'
import { AdminPageHeading } from '#/admin/components/AdminPageHeading'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/admin/site')({
  component: AdminSitePage,
})

function AdminSitePage() {
  const [siteName, setSiteName] = useState('Valence Capital')
  const [adminPrimary, setAdminPrimary] = useState('#061426')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    void sb.from('site_settings').select('key, value').then(({ data }) => {
      for (const row of data ?? []) {
        if (row.key === 'siteName') setSiteName(String(row.value))
        if (row.key === 'adminPrimary') setAdminPrimary(String(row.value))
      }
    })
  }, [])

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    await sb.from('site_settings').upsert([
      { key: 'siteName', value: siteName as unknown as Record<string, never> },
      { key: 'adminPrimary', value: adminPrimary as unknown as Record<string, never> },
    ])
    document.documentElement.style.setProperty('--admin-primary', adminPrimary)
    setMsg('Saved.')
    setTimeout(() => setMsg(null), 2000)
  }

  return (
    <div>
      <AdminPageHeading
        title="Site settings"
        description="Global branding and admin theme colors."
      />
      <div className="bg-white border rounded-lg p-6 max-w-md space-y-4">
        <div className="space-y-2">
          <Label>Site name</Label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Admin primary color</Label>
          <Input
            value={adminPrimary}
            onChange={(e) => setAdminPrimary(e.target.value)}
          />
        </div>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <Button type="button" onClick={() => void save()}>
          Save
        </Button>
      </div>
    </div>
  )
}
