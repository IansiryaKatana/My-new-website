import { cpSync, existsSync, mkdirSync, rmSync, renameSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { basename, dirname, join } from 'node:path'

const isWindows = process.platform === 'win32'

function sleep(ms) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    // Short spin while Windows releases file handles between delete attempts.
  }
}

export function removePathRobust(targetPath, label = targetPath) {
  if (!existsSync(targetPath)) return

  const attempts = [
    () => rmSync(targetPath, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 }),
    () => {
      if (!isWindows) return
      const escaped = targetPath.replace(/'/g, "''")
      execSync(
        `powershell -NoProfile -Command "Remove-Item -LiteralPath '${escaped}' -Recurse -Force -ErrorAction Stop"`,
        { stdio: 'pipe' },
      )
    },
    () => {
      const trashPath = `${targetPath}.trash-${Date.now()}`
      renameSync(targetPath, trashPath)
      rmSync(trashPath, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 })
    },
  ]

  let lastError = null
  for (let attempt = 0; attempt < attempts.length; attempt += 1) {
    try {
      attempts[attempt]()
      if (!existsSync(targetPath)) return
    } catch (error) {
      lastError = error
      sleep(250 * (attempt + 1))
    }
  }

  if (existsSync(targetPath)) {
    throw lastError ?? new Error(`Could not remove ${label}`)
  }
}

export function mirrorCopy(sourceDir, destDir) {
  if (isWindows) {
    try {
      execSync(
        `robocopy "${sourceDir}" "${destDir}" /MIR /NFL /NDL /NJH /NJS /NC /NS /NP`,
        { stdio: 'pipe' },
      )
    } catch (error) {
      const exitCode = error && typeof error === 'object' && 'status' in error ? error.status : null
      if (exitCode == null || exitCode > 7) {
        throw error
      }
    }
    return
  }

  mkdirSync(destDir, { recursive: true })
  cpSync(sourceDir, destDir, { recursive: true, force: true })
}

/** Mirror client build output into demos-dist/{slug}, overwriting files in place when needed. */
export function publishDirectory(sourceDir, destDir) {
  try {
    mkdirSync(dirname(destDir), { recursive: true })
  } catch {
    // demos-dist may already exist while the dev server is running.
  }

  if (!isWindows && !existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }

  mirrorCopy(sourceDir, destDir)
}
