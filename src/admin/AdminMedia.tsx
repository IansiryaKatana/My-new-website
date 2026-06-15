import { ImagePlus, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getSupabase } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'
import { generateMediaAltText } from '../lib/cms/generateMediaAltText'
import { uploadCmsImage } from '../lib/cms/uploadCmsImage'
import {
  adminBtn,
  adminBtnDanger,
  adminBtnPrimary,
  adminInput,
  adminTable,
  adminTd,
  adminTh,
} from './adminClassNames'
import { AdminConfirmDialog } from './components/AdminConfirmDialog'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminToolbarSelect } from './components/AdminSelect'
import { AdminTablePagination } from './components/AdminTablePagination'
import { useAdminTablePagination } from './useAdminTablePagination'

type Row = Tables<'cms_media'>

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function MediaPreview({ row }: { row: Row }) {
  if (row.kind === 'video') {
    return (
      <video
        src={row.public_url}
        className="h-12 w-12 object-cover"
        muted
        playsInline
        preload="metadata"
        aria-label={row.alt_text ?? 'Video preview'}
      />
    )
  }

  return (
    <img
      src={row.public_url}
      alt={row.alt_text ?? ''}
      className="h-12 w-12 object-cover"
    />
  )
}

export function AdminMedia() {
  const [rows, setRows] = useState<Row[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [kindFilter, setKindFilter] = useState('')
  const [folderFilter, setFolderFilter] = useState('')
  const [search, setSearch] = useState('')
  const [savingAltId, setSavingAltId] = useState<string | null>(null)

  const folders = useMemo(
    () => [...new Set(rows.map((r) => r.folder))].sort(),
    [rows],
  )

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (kindFilter && row.kind !== kindFilter) return false
      if (folderFilter && row.folder !== folderFilter) return false
      if (!q) return true
      const haystack = [
        row.file_name,
        row.storage_path,
        row.folder,
        row.alt_text,
        row.public_url,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, kindFilter, folderFilter, search])

  const pagination = useAdminTablePagination(filteredRows)

  useEffect(() => {
    pagination.setPage(0)
  }, [kindFilter, folderFilter, search])

  async function backfillMissingAlt(data: Row[]): Promise<Row[]> {
    const sb = getSupabase()
    if (!sb) return data

    const missing = data.filter((row) => !row.alt_text?.trim())
    if (!missing.length) return data

    const next = [...data]
    for (const row of missing) {
      const alt_text = generateMediaAltText(
        row.file_name ?? row.storage_path,
        row.folder,
        row.kind === 'video' ? 'video' : 'image',
      )
      await sb.from('cms_media').update({ alt_text }).eq('id', row.id)
      const index = next.findIndex((item) => item.id === row.id)
      if (index >= 0) next[index] = { ...next[index], alt_text }
    }
    return next
  }

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return

    setLoading(true)
    setErr(null)

    const { data, error } = await sb
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErr(error.message)
      setLoading(false)
      return
    }

    const withAlt = await backfillMissingAlt(data ?? [])
    setRows(withAlt)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onUpload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    setErr(null)

    const failures: string[] = []
    for (const file of Array.from(files)) {
      const result = await uploadCmsImage(file, 'library')
      if ('error' in result) failures.push(`${file.name}: ${result.error}`)
    }

    if (failures.length) {
      setErr(failures.join(' · '))
    }

    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
    await refresh()
  }

  async function saveAlt(row: Row, altText: string) {
    const sb = getSupabase()
    if (!sb) return

    setSavingAltId(row.id)
    const { error } = await sb
      .from('cms_media')
      .update({ alt_text: altText.trim() || null })
      .eq('id', row.id)

    if (error) setErr(error.message)
    else {
      setRows((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, alt_text: altText.trim() || null } : item,
        ),
      )
    }
    setSavingAltId(null)
  }

  async function confirmDelete() {
    if (!deleteId) return
    const sb = getSupabase()
    if (!sb) return
    const row = rows.find((r) => r.id === deleteId)
    if (!row) return
    await sb.storage.from('cms-media').remove([row.storage_path])
    await sb.from('cms_media').delete().eq('id', deleteId)
    setDeleteId(null)
    await refresh()
  }

  return (
    <div>
      <AdminPageHeading
        title="Media library"
        description="All images and videos indexed in cms_media — including uploads from hero, projects, and other admin fields."
        actions={
          <>
            <button type="button" className={adminBtn} onClick={() => void refresh()}>
              Refresh
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="sr-only"
              onChange={(e) => void onUpload(e.target.files)}
            />
            <button
              type="button"
              className={adminBtnPrimary}
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {busy ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <ImagePlus className="mr-1.5 h-4 w-4" />
                  Upload files
                </>
              )}
            </button>
          </>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <input
          className={`${adminInput} min-w-0 flex-1 lg:max-w-xs`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search file, folder, alt text…"
        />
        <AdminToolbarSelect
          label="Kind"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
        >
          <option value="">All kinds</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </AdminToolbarSelect>
        <AdminToolbarSelect
          label="Folder"
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
        >
          <option value="">All folders</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </AdminToolbarSelect>
        <span className="font-sans text-xs text-[var(--admin-fg-muted)]">
          {filteredRows.length} of {rows.length} assets
        </span>
      </div>

      {err ? <p className="mb-4 text-sm text-[#c44]">{err}</p> : null}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className={adminTable}>
              <thead>
                <tr>
                  <th className={adminTh}>Preview</th>
                  <th className={adminTh}>File</th>
                  <th className={adminTh}>Kind</th>
                  <th className={adminTh}>Folder</th>
                  <th className={adminTh}>Alt text</th>
                  <th className={adminTh}>Size</th>
                  <th className={adminTh}>Uploaded</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.slice.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={`${adminTd} text-center text-[var(--admin-fg-muted)]`}>
                      {rows.length === 0
                        ? 'No media yet. Upload files or add images in other admin sections.'
                        : 'No assets match your filters.'}
                    </td>
                  </tr>
                ) : (
                  pagination.slice.map((row) => (
                    <tr key={row.id}>
                      <td className={adminTd}>
                        <MediaPreview row={row} />
                      </td>
                      <td className={adminTd}>
                        <p className="max-w-[12rem] truncate font-medium">
                          {row.file_name ?? row.storage_path.split('/').pop()}
                        </p>
                        <a
                          href={row.public_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-0.5 block max-w-[12rem] truncate text-xs text-[var(--admin-fg-muted)] underline-offset-2 hover:underline"
                        >
                          Open
                        </a>
                      </td>
                      <td className={adminTd}>{row.kind}</td>
                      <td className={adminTd}>{row.folder}</td>
                      <td className={adminTd}>
                        <input
                          className={`${adminInput} min-w-[12rem] text-xs`}
                          defaultValue={row.alt_text ?? ''}
                          key={`${row.id}-${row.alt_text ?? ''}`}
                          disabled={savingAltId === row.id}
                          placeholder="SEO alt text"
                          onBlur={(e) => {
                            const next = e.target.value.trim()
                            const current = row.alt_text?.trim() ?? ''
                            if (next !== current) void saveAlt(row, next)
                          }}
                        />
                      </td>
                      <td className={adminTd}>{formatBytes(row.byte_size)}</td>
                      <td className={adminTd}>
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className={adminTd}>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className={adminBtn}
                            onClick={() => void navigator.clipboard.writeText(row.public_url)}
                          >
                            Copy URL
                          </button>
                          <button
                            type="button"
                            className={adminBtnDanger}
                            onClick={() => setDeleteId(row.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AdminTablePagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} />
        </>
      )}

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete media file?"
        description="The file will be removed from storage and the media library. Content that references this URL will show a broken image."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
