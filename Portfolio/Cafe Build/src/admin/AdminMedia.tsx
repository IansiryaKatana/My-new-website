import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { getSupabase } from '#/integrations/supabase/client'
import { uploadCmsImage } from '#/lib/cms/uploadCmsImage'
import type { Tables } from '#/integrations/supabase/database.types'
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
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

type MediaRow = Tables<'cms_media'>

export function AdminMedia() {
  const [rows, setRows] = useState<MediaRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pagination = useAdminTablePagination(rows)

  const refresh = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    const { data, error } = await supabase
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false })

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

  const handleUpload = async (file: File | null) => {
    if (!file) return
    const supabase = getSupabase()
    if (!supabase) return

    setUploading(true)
    setErr(null)

    try {
      await uploadCmsImage(supabase, file, { folder: 'library' })
      await refresh()
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    const supabase = getSupabase()
    if (!supabase) return

    const row = rows.find((item) => item.id === deleteId)
    if (row) {
      await supabase.storage.from('cms-media').remove([row.storage_path])
    }

    await supabase.from('cms_media').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading
        title="Media"
        description="Uploaded images and files indexed in the CMS media library."
        actions={
          <>
            <button type="button" className={adminBtnSecondary} onClick={() => void refresh()}>
              Refresh
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className={adminBtnPrimary}
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              Upload
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
                  <th className={adminTableTh}>Preview</th>
                  <th className={adminTableTh}>Folder</th>
                  <th className={adminTableTh}>Kind</th>
                  <th className={adminTableTh}>URL</th>
                  <th className={adminTableTh}>Created</th>
                  <th className={adminTableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageRows.map((row) => (
                  <tr key={row.id}>
                    <td className={adminTableTd}>
                      {row.kind === 'image' ? (
                        <img src={row.public_url} alt={row.alt_text} className="h-12 w-12 rounded object-cover" />
                      ) : (
                        row.kind
                      )}
                    </td>
                    <td className={adminTableTd}>{row.folder}</td>
                    <td className={adminTableTd}>{row.kind}</td>
                    <td className={adminTableTd}>
                      <a href={row.public_url} target="_blank" rel="noreferrer" className="break-all text-xs">
                        {row.public_url}
                      </a>
                    </td>
                    <td className={adminTableTd}>{new Date(row.created_at).toLocaleString()}</td>
                    <td className={adminTableTd}>
                      <button type="button" onClick={() => setDeleteId(row.id)}>
                        <Trash2 className="h-4 w-4 text-[var(--admin-danger)]" />
                      </button>
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
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete media"
        footer={
          <button type="button" className={adminBtnDanger} onClick={() => void confirmDelete()}>
            Delete
          </button>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)]">
          Delete this media asset from storage and the media index?
        </p>
      </AdminModal>
    </div>
  )
}
