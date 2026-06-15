import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

import { demoPublicBase } from './portfolio-demo-base.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const config = JSON.parse(readFileSync(join(root, 'demos.config.json'), 'utf8'))
const slug = process.argv[2]

if (!slug) {
  console.error('Usage: npm run dev:demo -- <slug>   (example: npm run dev:demo -- aurora)')
  process.exit(1)
}

const demo = config.demos.find((entry) => entry.slug === slug)
if (!demo) {
  console.error(`Unknown demo "${slug}". Add it to demos.config.json first.`)
  process.exit(1)
}

const demoDir = join(root, 'Portfolio', demo.folder)
console.log(`Starting ${demo.slug} at http://localhost:${demo.devPort} (base ${demoPublicBase(demo.slug)})`)
console.log('Run the main site with npm run dev and open the matching /demos/{slug}/ URL.')

execSync('npm run dev', {
  cwd: demoDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    DEMO_BASE_PATH: demoPublicBase(demo.slug),
    DEMO_DEV_PORT: String(demo.devPort),
  },
})
