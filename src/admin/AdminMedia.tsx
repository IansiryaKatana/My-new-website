import { useEffect, useRef, useState } from 'react'

import { getSupabase } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'
import { uploadCmsImage } from '../lib/cms/uploadCmsImage'
import {
  adminBtn,
  adminBtnDanger,
  adminBtnPrimary,
  adminTable,
  adminTd,
  adminTh,
} from './adminClassNames'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Tables<'cms_media'>

export function AdminMedia() {
  const [rows, setRows] = useState<Row[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const pagination = useAdminTablePagination(rows)

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from('cms_media').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onUpload(file: File | null) {
    if (!file) return
    setBusy(true)
    await uploadCmsImage(file, 'library')
    setBusy(false)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading
        title="Media library"
        description="Uploaded assets from the cms-media storage bucket."
        actions={
          <>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void onUpload(e.target.files?.[0] ?? null)} />
            <button type="button" className={adminBtnPrimary} disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? 'Uploading…' : 'Upload'}
            </button>
          </>
        }
      />
      <div className="overflow-x-auto">
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTh}>Preview</th>
              <th className={adminTh}>File</th>
              <th className={adminTh}>Folder</th>
              <th className={adminTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.slice.map((row) => (
              <tr key={row.id}>
                <td className={adminTd}>
                  <img src={row.public_url} alt="" className="h-12 w-12 object-cover" />
                </td>
                <td className={adminTd}>{row.file_name ?? row.storage_path}</td>
                <td className={adminTd}>{row.folder}</td>
                <td className={adminTd}>
                  <button
                    type="button"
                    className={adminBtnDanger}
                    onClick={async () => {
                      const sb = getSupabase()
                      if (!sb) return
                      await sb.storage.from('cms-media').remove([row.storage_path])
                      await sb.from('cms_media').delete().eq('id', row.id)
                      await refresh()
                    }}
                  >
                    Delete
                  </button>
                  <button type="button" className={`${adminBtn} ml-2`} onClick={() => void navigator.clipboard.writeText(row.public_url)}>
                    Copy URL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminTablePagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} />
    </div>
  )
}

