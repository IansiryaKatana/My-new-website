import { useCallback, useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Database } from '#/integrations/supabase/database.types'
import { AdminPageHeading } from './components/AdminPageHeading'

type Row = Database['public']['Tables']['section_copy']['Row']

const SECTIONS = [
  { key: 'projects', label: 'Projects section intro' },
  { key: 'process', label: 'Process section intro' },
] as const

export function AdminSections() {
  const { refetch: refetchCms } = useCms()
  const [rows, setRows] = useState<Record<string, Partial<Row>>>({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('section_copy').select('*')
    const map: Record<string, Partial<Row>> = {}
    for (const s of SECTIONS) {
      map[s.key] =
        data?.find((r) => r.section_key === s.key) ?? {
          id: crypto.randomUUID(),
          section_key: s.key,
          published: true,
        }
    }
    setRows(map)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function save(key: string) {
    const sb = getSupabase()
    const draft = rows[key]
    if (!sb || !draft) return
    setBusy(true)
    await sb.from('section_copy').upsert({
      ...draft,
      section_key: key,
      updated_at: new Date().toISOString(),
    } as Row)
    setBusy(false)
    setMsg(`Saved ${key}.`)
    await refetchCms()
  }

  return (
    <div>
      <AdminPageHeading
        title="Section copy"
        description="Eyebrow, heading, and body text for Projects and Process blocks."
      />
      <div className="space-y-8">
        {SECTIONS.map((s) => {
          const draft = rows[s.key]
          if (!draft) return null
          return (
            <div key={s.key} className="max-w-xl rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-sm font-medium">{s.label}</h2>
              <div className="space-y-3">
                <div>
                  <Label>Eyebrow</Label>
                  <Input
                    className="mt-1"
                    value={draft.eyebrow ?? ''}
                    onChange={(e) =>
                      setRows((r) => ({
                        ...r,
                        [s.key]: { ...r[s.key], eyebrow: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Heading</Label>
                  <Input
                    className="mt-1"
                    value={draft.heading ?? ''}
                    onChange={(e) =>
                      setRows((r) => ({
                        ...r,
                        [s.key]: { ...r[s.key], heading: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Body</Label>
                  <textarea
                    className="mt-1 w-full rounded border p-2 text-sm"
                    rows={3}
                    value={draft.body ?? ''}
                    onChange={(e) =>
                      setRows((r) => ({
                        ...r,
                        [s.key]: { ...r[s.key], body: e.target.value },
                      }))
                    }
                  />
                </div>
                <Button
                  variant="admin"
                  type="button"
                  disabled={busy}
                  onClick={() => void save(s.key)}
                >
                  Save {s.key}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      {msg && <p className="mt-4 text-xs text-green-700">{msg}</p>}
    </div>
  )
}
