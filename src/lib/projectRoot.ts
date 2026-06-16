import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

let cachedProjectRoot: string | null = null

function hasDemoArtifacts(dir: string) {
  return (
    existsSync(join(dir, 'demos-dist')) ||
    existsSync(join(dir, 'dist', 'demos-dist'))
  )
}

function isProjectRoot(dir: string) {
  if (!existsSync(join(dir, 'package.json'))) return false
  return existsSync(join(dir, 'demos.config.json')) || hasDemoArtifacts(dir)
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

export function getDemosDistCandidates() {
  const root = getProjectRoot()
  return [join(root, 'dist', 'demos-dist'), join(root, 'demos-dist')]
}

export function resolveDemosDistRoot() {
  for (const dir of getDemosDistCandidates()) {
    if (existsSync(dir) && readdirSync(dir).length > 0) {
      return dir
    }
  }

  return getDemosDistCandidates()[0]
}
