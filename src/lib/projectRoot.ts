import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

let cachedProjectRoot: string | null = null

function isProjectRoot(dir: string) {
  return (
    existsSync(join(dir, 'package.json')) &&
    existsSync(join(dir, 'demos.config.json'))
  )
}

/** Resolve repo root from the running module path (stable in dev and bundled server output). */
export function getProjectRoot() {
  if (cachedProjectRoot) return cachedProjectRoot

  let dir = dirname(fileURLToPath(import.meta.url))

  while (true) {
    if (isProjectRoot(dir)) {
      cachedProjectRoot = dir
      return dir
    }

    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  cachedProjectRoot = process.cwd()
  return cachedProjectRoot
}
