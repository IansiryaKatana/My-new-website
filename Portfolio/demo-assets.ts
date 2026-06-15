/** Resolve a file from a portfolio project's `public/` folder (respects hosted demo base path). */
export function publicAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
