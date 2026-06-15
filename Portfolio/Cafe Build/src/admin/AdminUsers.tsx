import { useCallback, useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { getSupabase } from '#/integrations/supabase/client'
import type { Tables } from '#/integrations/supabase/database.types'
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminLabel,
  adminTable,
  adminTableHead,
  adminTableTd,
  adminTableTh,
  adminTableWrap,
} from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type AdminUserRow = Tables<'admin_users'>

function emptyUser(): AdminUserRow {
  return {
    id: crypto.randomUUID(),
    auth_user_id: null,
    email: '',
    role: 'editor',
    is_active: true,
    display_name: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AdminUsers() {
  const { user } = useAdminAuth()
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<AdminUserRow | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    const { data, error } = await supabase.from('admin_users').select('*').order('created_at')
    if (error) setErr(error.message)
    else {
      setRows(data ?? [])
      pagination.resetPage()
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const save = async () => {
    if (!draft?.email.trim()) {
      setSaveErr('Email is required.')
      return
    }

    const supabase = getSupabase()
    if (!supabase) return

    setSaving(true)
    const { error } = await supabase.from('admin_users').upsert(
      {
        ...draft,
        email: draft.email.trim().toLowerCase(),
        display_name: draft.display_name.trim() || draft.email.split('@')[0],
      },
      { onConflict: 'id' },
    )
    setSaving(false)

    if (error) {
      setSaveErr(error.message)
      return
    }

    setModalOpen(false)
    setDraft(null)
    await refresh()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    const supabase = getSupabase()
    if (!supabase) return

    await supabase.from('admin_users').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading
        title="Users"
        description="Manage admin accounts and roles. Visible to owners and admins only."
        actions={
          <>
            <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
              Refresh
            </button>
            <button
              type="button"
              className={adminBtnPrimary}
              onClick={() => {
                setDraft(emptyUser())
                setSaveErr(null)
                setModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Add user
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
        <>
          <div className={adminTableWrap}>
            <table className={adminTable}>
              <thead className={adminTableHead}>
                <tr>
                  <th className={adminTableTh}>Display name</th>
                  <th className={adminTableTh}>Email</th>
                  <th className={adminTableTh}>Role</th>
                  <th className={adminTableTh}>Active</th>
                  <th className={adminTableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageRows.map((row) => (
                  <tr key={row.id}>
                    <td className={adminTableTd}>{row.display_name}</td>
                    <td className={adminTableTd}>
                      {row.email}
                      {row.auth_user_id === user?.id ? (
                        <span className="ml-2 text-xs text-[var(--admin-primary)]">(you)</span>
                      ) : null}
                    </td>
                    <td className={adminTableTd}>{row.role}</td>
                    <td className={adminTableTd}>{row.is_active ? 'Yes' : 'No'}</td>
                    <td className={adminTableTd}>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({ ...row })
                            setSaveErr(null)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={row.auth_user_id === user?.id}
                          onClick={() => setDeleteId(row.id)}
                        >
                          <Trash2 className="h-4 w-4 text-[var(--admin-danger)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination {...pagination} onPageChange={pagination.goToPage} />
        </>
      ) : null}

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft && rows.some((row) => row.id === draft.id) ? 'Edit user' : 'New user'}
        footer={
          <button type="button" className={adminBtnPrimary} disabled={saving} onClick={() => void save()}>
            Save
          </button>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className={adminLabel}>Display name</label>
              <input
                className={adminInput}
                value={draft.display_name}
                onChange={(event) => setDraft({ ...draft, display_name: event.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Email</label>
              <input
                type="email"
                className={adminInput}
                value={draft.email}
                onChange={(event) => setDraft({ ...draft, email: event.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Role</label>
              <select
                className={adminInput}
                value={draft.role}
                onChange={(event) => setDraft({ ...draft, role: event.target.value })}
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(event) => setDraft({ ...draft, is_active: event.target.checked })}
              />
              Active
            </label>
            {saveErr ? <p className="text-sm text-[var(--admin-danger)]">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete user"
        footer={
          <button type="button" className={adminBtnDanger} onClick={() => void confirmDelete()}>
            Delete
          </button>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">Remove this admin user record?</p>
      </AdminModal>
    </div>
  )
}
