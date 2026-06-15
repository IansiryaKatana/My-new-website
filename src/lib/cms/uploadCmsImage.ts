import { getSupabase } from '../../integrations/supabase/client'
import { generateMediaAltText } from './generateMediaAltText'

export interface UploadCmsImageOptions {
  altText?: string
}

export async function uploadCmsImage(
  file: File,
  folder: string,
  options: UploadCmsImageOptions = {},
): Promise<{ publicUrl: string; mediaId: string } | { error: string }> {
  const sb = getSupabase()
  if (!sb) return { error: 'Supabase is not configured.' }

  const kind = file.type.startsWith('video/') ? 'video' : 'image'
  const altText =
    options.altText?.trim() ||
    generateMediaAltText(file.name, folder, kind)

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
      kind,
      alt_text: altText,
      file_name: file.name,
      byte_size: file.size,
    })
    .select('id')
    .single()

  if (dbError || !mediaRow) {
    await sb.storage.from('cms-media').remove([path])
    return { error: dbError?.message ?? 'Failed to index media.' }
  }

  return { publicUrl, mediaId: mediaRow.id }
}
