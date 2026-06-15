import { siteConfig } from '../../data/site'

const FOLDER_CONTEXT: Record<string, string> = {
  hero: 'Portrait of Ian Sirya, Lead Full-Stack Developer',
  library: 'Portfolio media',
  'projects/covers': 'Project cover',
  'projects/featured': 'Featured project image',
  'projects/thumbnails': 'Project gallery image',
  general: 'Website image',
}

function humanizeFileName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, '')
  const withoutTimestamp = withoutExt.replace(/^\d+-/, '')
  const words = withoutTimestamp
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  const phrase = words.join(' ')
  if (!phrase || phrase.length < 3 || /^\d+$/.test(phrase)) return ''
  return phrase
}

export function generateMediaAltText(
  fileName: string,
  folder: string,
  kind: 'image' | 'video' = 'image',
): string {
  const folderLabel = FOLDER_CONTEXT[folder] ?? FOLDER_CONTEXT.general
  const fromName = humanizeFileName(fileName.split('/').pop() ?? fileName)
  const site = siteConfig.name

  if (kind === 'video') {
    if (fromName) return `${fromName} — ${folderLabel} video | ${site}`
    return `${folderLabel} video | ${site}`
  }

  if (fromName) return `${fromName} — ${folderLabel} | ${site}`
  return `${folderLabel} | ${site}`
}
