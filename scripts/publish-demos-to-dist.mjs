import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { publishDirectory } from './fs-utils.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'demos-dist')
const target = join(root, 'dist', 'demos-dist')

if (!existsSync(source)) {
  console.warn('No demos-dist folder found; skipping copy into dist/.')
  process.exit(0)
}

publishDirectory(source, target)
console.log(`Copied demos-dist → dist/demos-dist`)
