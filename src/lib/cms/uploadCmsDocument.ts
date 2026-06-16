import { getSupabase } from '../../integrations/supabase/client'

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export async function uploadCmsDocument(
  file: File,
  folder: string,
): Promise<{ publicUrl: string; mediaId: string; fileName: string } | { error: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: 'Only PDF and DOCX files are supported.' }
  }

  const sb = getSupabase()
  if (!sb) return { error: 'Supabase is not configured.' }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`

  const { error: uploadError } = await sb.storage
    .from('cms-media')
    .upload(path, file, { upsert: false, contentType: file.type })

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { data: urlData } = sb.storage.from('cms-media').getPublicUrl(path)
  const publicUrl = urlData.publicUrl

  const { data: mediaRow, error: dbError } = await sb
    .from('cms_media')
    .insert({
      public_url: publicUrl,
      storage_path: path,
      folder,
      kind: 'document',
      alt_text: file.name,
      file_name: file.name,
      byte_size: file.size,
    })
    .select('id')
    .single()

  if (dbError || !mediaRow) {
    await sb.storage.from('cms-media').remove([path])
    return { error: dbError?.message ?? 'Failed to index document.' }
  }

  return { publicUrl, mediaId: mediaRow.id, fileName: file.name }
}
