import { getSupabase } from '#/integrations/supabase/client'

export async function uploadCmsImage(
  file: File,
  folder = 'general',
): Promise<{ publicUrl: string; storagePath: string } | { error: string }> {
  const sb = getSupabase()
  if (!sb) return { error: 'Supabase is not configured' }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${folder}/${Date.now()}-${safeName}`

  const { error: uploadError } = await sb.storage
    .from('cms-media')
    .upload(storagePath, file, { upsert: false })

  if (uploadError) return { error: uploadError.message }

  const {
    data: { publicUrl },
  } = sb.storage.from('cms-media').getPublicUrl(storagePath)

  const { error: dbError } = await sb.from('cms_media').insert({
    public_url: publicUrl,
    storage_path: storagePath,
    folder,
    kind: file.type.startsWith('video/') ? 'video' : 'image',
    alt_text: safeName,
  })

  if (dbError) {
    await sb.storage.from('cms-media').remove([storagePath])
    return { error: dbError.message }
  }

  return { publicUrl, storagePath }
}
