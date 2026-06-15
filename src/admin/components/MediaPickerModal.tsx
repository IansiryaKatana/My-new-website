import * as Dialog from '@radix-ui/react-dialog'
import { Check, Loader2, Upload, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getSupabase } from '../../integrations/supabase/client'
import type { Tables } from '../../integrations/supabase/database.types'
import { uploadCmsImage } from '../../lib/cms/uploadCmsImage'
import { adminBtn, adminBtnPrimary, adminInput } from '../adminClassNames'
import { AdminToolbarSelect } from './AdminSelect'

type MediaRow = Tables<'cms_media'>
type MediaPickerTab = 'library' | 'upload'
type MediaAccept = 'image' | 'video' | 'all'

export function MediaPickerModal({
  open,
  onOpenChange,
  folder,
  mode = 'single',
  accept = 'image',
  title = 'Select media',
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: string
  mode?: 'single' | 'multiple'
  accept?: MediaAccept
  title?: string
  onSelect: (urls: string[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<MediaPickerTab>('library')
  const [rows, setRows] = useState<MediaRow[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [kindFilter, setKindFilter] = useState('')
  const [folderFilter, setFolderFilter] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const acceptKinds = useMemo(() => {
    if (accept === 'image') return new Set(['image'])
    if (accept === 'video') return new Set(['video'])
    return new Set(['image', 'video'])
  }, [accept])

  const folders = useMemo(
    () => [...new Set(rows.map((row) => row.folder))].sort(),
    [rows],
  )

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (!acceptKinds.has(row.kind)) return false
      if (kindFilter && row.kind !== kindFilter) return false
      if (folderFilter && row.folder !== folderFilter) return false
      if (!q) return true
      const haystack = [row.file_name, row.folder, row.alt_text, row.public_url]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, acceptKinds, kindFilter, folderFilter, search])

  async function loadLibrary() {
    const sb = getSupabase()
    if (!sb) return

    setLoading(true)
    setErr(null)
    const { data, error } = await sb
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setErr(error.message)
    else setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (!open) return
    setTab('library')
    setSearch('')
    setKindFilter('')
    setFolderFilter('')
    setSelected([])
    setErr(null)
    void loadLibrary()
  }, [open])

  function toggleSelect(url: string) {
    if (mode === 'single') {
      setSelected([url])
      return
    }
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url],
    )
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setErr(null)

    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      if (accept === 'image' && !isImage) continue
      if (accept === 'video' && !isVideo) continue
      if (accept === 'all' && !isImage && !isVideo) continue

      const result = await uploadCmsImage(file, folder)
      if ('error' in result) {
        setErr(result.error)
        break
      }
      uploaded.push(result.publicUrl)
    }

    if (uploaded.length) {
      setSelected(mode === 'single' ? [uploaded[uploaded.length - 1]] : uploaded)
      await loadLibrary()
      setTab('library')
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function confirmSelection() {
    if (!selected.length) return
    onSelect(mode === 'single' ? [selected[0]] : selected)
    onOpenChange(false)
  }

  const acceptAttr =
    accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="admin-sheet-overlay fixed inset-0 z-[60]" />
        <Dialog.Content
          className="admin-sheet admin-sheet--centered fixed inset-x-0 bottom-0 z-[61] flex max-h-[92vh] flex-col overflow-hidden border border-[#cfd0c4] shadow-2xl max-md:rounded-t-none md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[min(85vh,52rem)] md:w-[min(56rem,95vw)] md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <div className="admin-sheet-header flex shrink-0 items-start justify-between gap-4 px-5 py-4">
            <div>
              <Dialog.Title className="font-display text-2xl font-black uppercase text-[#1a1f16]">
                {title}
              </Dialog.Title>
              <p className="mt-1 font-sans text-xs text-[#5a5f52]">
                Choose from the media library or upload from your computer.
              </p>
            </div>
            <Dialog.Close
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#cfd0c4] bg-[#ebeae0] text-[#1a1f16] hover:bg-[#765f47] hover:text-[#d8d7c3]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="admin-sheet-tabs flex shrink-0 gap-1 px-5">
            <button
              type="button"
              className={`border-b-2 px-4 py-2.5 font-display text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                tab === 'library'
                  ? 'border-[#765f47] text-[#1a1f16]'
                  : 'border-transparent text-[#5a5f52] hover:text-[#1a1f16]'
              }`}
              onClick={() => setTab('library')}
            >
              Media library
            </button>
            <button
              type="button"
              className={`border-b-2 px-4 py-2.5 font-display text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                tab === 'upload'
                  ? 'border-[#765f47] text-[#1a1f16]'
                  : 'border-transparent text-[#5a5f52] hover:text-[#1a1f16]'
              }`}
              onClick={() => setTab('upload')}
            >
              Upload files
            </button>
          </div>

          <div className="admin-sheet-scroll admin-sheet-body min-h-0 flex-1 px-5 py-4">
            {tab === 'library' ? (
              <div className="grid gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <input
                    className={`${adminInput} min-w-0 flex-1 sm:max-w-xs`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search media…"
                  />
                  {accept === 'all' ? (
                    <AdminToolbarSelect
                      label="Kind"
                      value={kindFilter}
                      onChange={(e) => setKindFilter(e.target.value)}
                    >
                      <option value="">All kinds</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                    </AdminToolbarSelect>
                  ) : null}
                  <AdminToolbarSelect
                    label="Folder"
                    value={folderFilter}
                    onChange={(e) => setFolderFilter(e.target.value)}
                  >
                    <option value="">All folders</option>
                    {folders.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </AdminToolbarSelect>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-primary)]" />
                  </div>
                ) : filteredRows.length === 0 ? (
                  <p className="py-12 text-center font-sans text-sm text-[var(--admin-fg-muted)]">
                    No media found. Switch to Upload files to add new assets.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filteredRows.map((row) => {
                      const isSelected = selected.includes(row.public_url)
                      return (
                        <button
                          key={row.id}
                          type="button"
                          className={`group relative aspect-square overflow-hidden border-2 bg-white text-left transition-colors ${
                            isSelected
                              ? 'border-[#765f47] ring-2 ring-[#765f47]/30'
                              : 'border-[#e0e1d6] hover:border-[#765f47]'
                          }`}
                          onClick={() => toggleSelect(row.public_url)}
                        >
                          {row.kind === 'video' ? (
                            <video
                              src={row.public_url}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={row.public_url}
                              alt={row.alt_text ?? ''}
                              className="h-full w-full object-cover"
                            />
                          )}
                          {isSelected ? (
                            <span className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center bg-[#765f47] text-[#d8d7c3]">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : null}
                          <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-1.5 py-1 font-sans text-[10px] text-white">
                            {row.file_name ?? row.folder}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <label
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-[#cfd0c4] bg-white px-6 py-14 transition-colors hover:border-[#765f47] hover:bg-[#f7f7f2] ${uploading ? 'pointer-events-none opacity-60' : ''}`}
              >
                {uploading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-[#765f47]" />
                ) : (
                  <Upload className="h-10 w-10 text-[#8a8f84]" />
                )}
                <span className="font-sans text-sm text-[#1a1f16]">
                  {uploading ? 'Uploading…' : 'Click to upload or drop files here'}
                </span>
                <span className="font-sans text-xs text-[#5a5f52]">
                  {mode === 'multiple' ? 'Select one or more files' : 'Select a file'} · saved to{' '}
                  <strong>{folder}</strong>
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept={acceptAttr}
                  multiple={mode === 'multiple'}
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => void onUpload(e.target.files)}
                />
              </label>
            )}

            {err ? <p className="mt-4 text-sm text-[#c44]">{err}</p> : null}
          </div>

          <div className="admin-sheet-footer flex shrink-0 flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="font-sans text-xs text-[#5a5f52]">
              {selected.length
                ? `${selected.length} selected`
                : mode === 'multiple'
                  ? 'Select one or more items'
                  : 'Select an item'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Dialog.Close type="button" className={adminBtn}>
                Cancel
              </Dialog.Close>
              <button
                type="button"
                className={adminBtnPrimary}
                disabled={!selected.length}
                onClick={confirmSelection}
              >
                {mode === 'multiple' ? 'Add selected' : 'Use media'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
