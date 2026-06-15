import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Database,
  Json,
  Tables,
  TablesInsert,
} from '#/integrations/supabase/database.types'

const CMS_MEDIA_BUCKET = 'cms-media'

export interface UploadCmsImageOptions {
  folder?: string
  altText?: string
  metadata?: Json
}

export interface UploadCmsImageResult {
  media: Tables<'cms_media'>
  publicUrl: string
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function inferMediaKind(file: File): 'image' | 'video' | 'other' {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return 'other'
}

export async function uploadCmsImage(
  supabase: SupabaseClient<Database>,
  file: File,
  options: UploadCmsImageOptions = {},
): Promise<UploadCmsImageResult> {
  const folder = options.folder ?? 'general'
  const safeName = sanitizeFileName(file.name || 'upload')
  const storagePath = `${folder}/${crypto.randomUUID()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(CMS_MEDIA_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data: publicUrlData } = supabase.storage
    .from(CMS_MEDIA_BUCKET)
    .getPublicUrl(storagePath)

  const publicUrl = publicUrlData.publicUrl

  const mediaRow: TablesInsert<'cms_media'> = {
    public_url: publicUrl,
    storage_path: storagePath,
    folder,
    kind: inferMediaKind(file),
    alt_text: options.altText ?? '',
    metadata: options.metadata ?? {},
  }

  const { data: media, error: insertError } = await supabase
    .from('cms_media')
    .insert(mediaRow)
    .select('*')
    .single()

  if (insertError || !media) {
    await supabase.storage.from(CMS_MEDIA_BUCKET).remove([storagePath])
    throw new Error(insertError?.message ?? 'Failed to create cms_media row.')
  }

  return { media, publicUrl }
}
