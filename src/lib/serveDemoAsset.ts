import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { join, normalize } from 'node:path'

import { getDemoBySlug } from './demoLinks'
import { getProjectRoot } from './projectRoot'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

export function getDemosDistRoot() {
  return join(getProjectRoot(), 'demos-dist')
}

export function resolveDemoAssetPath(slug: string, assetPath: string) {
  const demoRoot = join(getDemosDistRoot(), slug)
  const relativePath = assetPath.replace(/^\/+/, '') || 'index.html'
  const resolved = normalize(join(demoRoot, relativePath))

  if (!resolved.startsWith(normalize(demoRoot))) {
    return null
  }

  return resolved
}

export function serveDemoAsset(slug: string, assetPath: string) {
  const demo = getDemoBySlug(slug)
  if (!demo) {
    return new Response('Demo not found', { status: 404 })
  }

  const filePath = resolveDemoAssetPath(slug, assetPath)
  if (!filePath || !existsSync(filePath)) {
    return new Response(
      `Demo "${slug}" is not built yet. Run: npm run build:demos -- ${slug}`,
      { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  }

  const ext = filePath.slice(filePath.lastIndexOf('.'))
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'

  if (ext === '.html') {
    return new Response(readFileSync(filePath, 'utf8'), {
      headers: { 'Content-Type': contentType },
    })
  }

  const stream = createReadStream(filePath)
  return new Response(stream as unknown as BodyInit, {
    headers: { 'Content-Type': contentType },
  })
}

export function demoAssetExists(slug: string) {
  return existsSync(resolveDemoAssetPath(slug, 'index.html') ?? '')
}
