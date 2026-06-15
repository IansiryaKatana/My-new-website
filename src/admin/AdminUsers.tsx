import { useEffect, useState } from 'react'

import { canManageUsers, useAdminAuth } from '../contexts/AdminAuthContext'
import { getSupabase } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'
import {
  adminBtn,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminTable,
  adminTd,
  adminTh,
} from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'

type Row = Tables<'admin_users'>

export function AdminUsers() {
  const { adminUser, refreshAdminUser } = useAdminAuth()
  const [rows, setRows] = useState<Row[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<Row> & { password?: string }>({})
  const [saveErr, setSaveErr] = useState<string | null>(null)

  if (!canManageUsers(adminUser?.role)) {
    return <p className="font-sans text-sm">You do not have permission to manage users.</p>
  }

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('admin_users').select('*').order('created_at')
    setRows(data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function save() {
    if (!draft.email?.trim()) {
      setSaveErr('Email is required.')
      return
    }
    const sb = getSupabase()
    if (!sb) return

    if (draft.id) {
      const { error } = await sb
        .from('admin_users')
        .update({
          email: draft.email.trim(),
          role: draft.role ?? 'editor',
          is_active: draft.is_active ?? true,
        })
        .eq('id', draft.id)
      if (error) {
        setSaveErr(error.message)
        return
      }
    } else {
      const { error } = await sb.from('admin_users').insert({
        id: crypto.randomUUID(),
        email: draft.email.trim(),
        role: draft.role ?? 'editor',
        is_active: true,
      })
      if (error) {
        setSaveErr(error.message)
        return
      }
    }

    setModalOpen(false)
    await refresh()
    await refreshAdminUser()
  }

  return (
    <div>
      <AdminPageHeading
        title="Admin users"
        description="CMS roles. Create Supabase Auth users separately, then link by email on first login."
        actions={
          <button
            type="button"
            className={adminBtnPrimary}
            onClick={() => {
              setDraft({ email: '', role: 'editor', is_active: true })
              setSaveErr(null)
              setModalOpen(true)
            }}
          >
            Add user record
          </button>
        }
      />
      <div className="overflow-x-auto">
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTh}>Email</th>
              <th className={adminTh}>Role</th>
              <th className={adminTh}>Active</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={adminTd}>{row.email}</td>
                <td className={adminTd}>{row.role}</td>
                <td className={adminTd}>{row.is_active ? 'Yes' : 'No'}</td>
                <td className={adminTd}>
                  <button
                    type="button"
                    className={adminBtn}
                    onClick={() => {
                      setDraft({ ...row })
                      setModalOpen(true)
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft.id ? 'Edit admin user' : 'New admin user'}
        footer={
          <>
            <button type="button" className={adminBtn} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className={adminBtnPrimary} onClick={() => void save()}>
              Save
            </button>
          </>
        }
      >
        <label className="grid gap-2">
          <span className={adminLabel}>Email</span>
          <input
            className={adminInput}
            type="email"
            value={draft.email ?? ''}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
        </label>
        <label className="grid gap-2">
          <span className={adminLabel}>Role</span>
          <select
            className={adminInput}
            value={draft.role ?? 'editor'}
            onChange={(e) =>
              setDraft({ ...draft, role: e.target.value as Row['role'] })
            }
          >
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <label className="flex items-center gap-2 font-sans text-sm">
          <input
            type="checkbox"
            checked={draft.is_active ?? true}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
          />
          Active
        </label>
        {saveErr ? <p className="text-sm text-[#e88]">{saveErr}</p> : null}
      </AdminModal>
    </div>
  )
}

