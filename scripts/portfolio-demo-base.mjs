/** Shared helpers for hosting Portfolio demos under /demos/{slug}/ on the main site. */

export function demoPublicBase(slug) {
  return `/demos/${slug}/`
}

export function demoBasepath(slug) {
  return `/demos/${slug}`
}

export function normalizeDemoBasePath(value) {
  if (!value) return '/'
  const trimmed = value.endsWith('/') ? value : `${value}/`
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function demoBasepathFromEnv() {
  const base = normalizeDemoBasePath(process.env.DEMO_BASE_PATH ?? '/')
  if (base === '/') return '/'
  return base.replace(/\/$/, '')
}
