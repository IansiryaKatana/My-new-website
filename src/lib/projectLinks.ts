export type ResolvedProjectLink = {
  href: string
  isExternal: boolean
  kind: 'external' | 'demo' | 'internal'
}

/** Resolve a project reference link (demo preview, internal path, or external URL). */
export function resolveProjectHref(href: string | undefined | null): ResolvedProjectLink | null {
  if (!href?.trim()) return null

  const trimmed = href.trim()

  if (/^https?:\/\//i.test(trimmed)) {
    return { href: trimmed, isExternal: true, kind: 'external' }
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const normalized = path.endsWith('/') ? path : `${path}/`

  if (normalized.startsWith('/demos/')) {
    return { href: normalized, isExternal: false, kind: 'demo' }
  }

  return { href: path, isExternal: false, kind: 'internal' }
}

export function projectCaseStudyPath(slug: string) {
  return `/portfolio/${slug}`
}
