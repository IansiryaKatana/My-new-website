import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useCms } from '#/contexts/CmsContext'
import { getSupabase } from '#/integrations/supabase/client'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type EntityAdminConfig<Row extends { id: string }> = {
  title: string
  description: string
  table: string
  orderBy?: string
  emptyRow: () => Partial<Row>
  columns: { key: keyof Row; label: string }[]
  renderForm: (
    draft: Partial<Row>,
    setDraft: (fn: (d: Partial<Row>) => Partial<Row>) => void,
  ) => ReactNode
  validate?: (draft: Partial<Row>) => string | null
  refetchCms?: boolean
}

export function createEntityAdmin<Row extends { id: string }>(config: EntityAdminConfig<Row>) {
  return function EntityAdminPage() {
    const { refetch: refetchCms } = useCms()
    const [rows, setRows] = useState<Row[]>([])
    const [err, setErr] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<Partial<Row> | null>(null)
    const [saveErr, setSaveErr] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const pagination = useAdminTablePagination(rows)

    const refresh = useCallback(async () => {
      const sb = getSupabase()
      if (!sb) return
      const q = sb.from(config.table).select('*')
      const { data, error } = await (config.orderBy
        ? q.order(config.orderBy)
        : q.order('sort_order'))
      if (error) setErr(error.message)
      else {
        setErr(null)
        setRows((data ?? []) as Row[])
      }
    }, [])

    useEffect(() => {
      void refresh()
    }, [refresh])

    async function save() {
      if (!draft) return
      const validation = config.validate?.(draft)
      if (validation) {
        setSaveErr(validation)
        return
      }
      const sb = getSupabase()
      if (!sb) return
      setBusy(true)
      const { error } = await sb.from(config.table).upsert(draft as Row, { onConflict: 'id' })
      setBusy(false)
      if (error) {
        setSaveErr(error.message)
        return
      }
      setModalOpen(false)
      await refresh()
      if (config.refetchCms !== false) await refetchCms()
    }

    async function confirmDelete() {
      if (!deleteId) return
      const sb = getSupabase()
      if (!sb) return
      await sb.from(config.table).delete().eq('id', deleteId)
      setDeleteId(null)
      await refresh()
      if (config.refetchCms !== false) await refetchCms()
    }

    return (
      <div>
        <AdminPageHeading title={config.title} description={config.description} />
        {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
        <div className="mb-4">
          <Button
            variant="admin"
            type="button"
            onClick={() => {
              setDraft(config.emptyRow())
              setSaveErr(null)
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={String(c.key)}>{c.label}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {pagination.slice.map((row) => (
                <tr key={row.id}>
                  {config.columns.map((c) => (
                    <td key={String(c.key)}>{String(row[c.key] ?? '—')}</td>
                  ))}
                  <td className="flex gap-2">
                    <button type="button" onClick={() => { setDraft({ ...row }); setModalOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setDeleteId(row.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminTablePagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          total={pagination.total}
          onPrev={pagination.prev}
          onNext={pagination.next}
        />
        <AdminModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Edit"
          onSave={() => void save()}
          saving={busy}
          saveError={saveErr}
        >
          {draft && config.renderForm(draft, (fn) => setDraft((d) => fn(d!)))}
        </AdminModal>
        <AdminModal
          open={Boolean(deleteId)}
          onOpenChange={() => setDeleteId(null)}
          title="Delete?"
          onSave={() => void confirmDelete()}
          saveLabel="Delete"
        >
          <p className="text-sm">This cannot be undone.</p>
        </AdminModal>
      </div>
    )
  }
}
