import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

import { publishDirectory, removePathRobust } from './fs-utils.mjs'
import { demoPublicBase } from './portfolio-demo-base.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const portfolioRoot = join(root, 'Portfolio')
const publicDemosRoot = join(root, 'demos-dist')

const config = JSON.parse(readFileSync(join(root, 'demos.config.json'), 'utf8'))
const onlySlug = process.argv[2]

const targets = onlySlug
  ? config.demos.filter((demo) => demo.slug === onlySlug)
  : config.demos

if (onlySlug && targets.length === 0) {
  console.error(`Unknown demo slug "${onlySlug}". Add it to demos.config.json first.`)
  process.exit(1)
}

function findManifestFile(demoDir, buildRootRel) {
  const candidates = [
    join(demoDir, buildRootRel, 'server', 'assets'),
    join(demoDir, 'dist', 'server', 'assets'),
  ]

  for (const assetsDir of candidates) {
    if (!existsSync(assetsDir)) continue
    const manifest = readdirSync(assetsDir).find((file) => file.startsWith('_tanstack-start-manifest_v-'))
    if (manifest) return join(assetsDir, manifest)
  }

  return null
}

function resolveClientDir(demoDir, buildRootRel) {
  const hostedClient = join(demoDir, buildRootRel, 'client')
  if (existsSync(hostedClient)) return hostedClient
  return join(demoDir, 'dist', 'client')
}

function pruneOldHostedBuilds(demoDir, slug, keepBuildRootRel) {
  const hostedRoot = join(demoDir, '.hosted-build')
  if (!existsSync(hostedRoot)) return

  const keepPath = resolve(join(demoDir, keepBuildRootRel))
  for (const entry of readdirSync(hostedRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (entry.name !== slug && !entry.name.startsWith(`${slug}-`)) continue

    const candidate = resolve(join(hostedRoot, entry.name))
    if (candidate === keepPath) continue

    try {
      removePathRobust(candidate, entry.name)
    } catch {
      // Best-effort; locked folders are left for manual cleanup.
    }
  }
}

function writeDemoIndexHtmlFallback(targetDir, demoDir, buildRootRel) {
  const prerenderedIndex = join(targetDir, 'index.html')
  if (existsSync(prerenderedIndex)) {
    return
  }

  const manifestPath = findManifestFile(demoDir, buildRootRel)
  if (!manifestPath) {
    console.warn(`No prerendered index.html or TanStack manifest for ${targetDir}`)
    return
  }

  const manifestSource = readFileSync(manifestPath, 'utf8')
  const clientEntry = manifestSource.match(/clientEntry:\s*"([^"]+)"/)?.[1]
  const cssHref = manifestSource.match(/css:\s*\["([^"]+)"\]/)?.[1]

  if (!clientEntry) {
    console.warn(`Could not resolve client entry for ${targetDir}`)
    return
  }

  console.warn(
    `No prerendered index.html for ${targetDir}; writing minimal shell (hydration may fail without SSR markup).`,
  )

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    ${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ''}
  </head>
  <body>
    <script type="module" src="${clientEntry}"></script>
  </body>
</html>
`

  writeFileSync(prerenderedIndex, html, 'utf8')
}

mkdirSync(publicDemosRoot, { recursive: true })

console.log(
  'Tip: stop `npm run dev` while building if publish fails with EPERM on Windows.\n',
)

const succeeded = []
const failed = []

for (const demo of targets) {
  const demoDir = join(portfolioRoot, demo.folder)
  const viteConfigPath = join(demoDir, 'vite.config.ts')

  if (!existsSync(demoDir)) {
    console.warn(`Skipping ${demo.slug}: folder not found at Portfolio/${demo.folder}`)
    failed.push({ slug: demo.slug, reason: 'folder not found' })
    continue
  }

  if (!existsSync(viteConfigPath)) {
    console.warn(`Skipping ${demo.slug}: missing vite.config.ts`)
    failed.push({ slug: demo.slug, reason: 'missing vite.config.ts' })
    continue
  }

  const demoBase = demoPublicBase(demo.slug)
  const buildRootRel = `.hosted-build/${demo.slug}-${Date.now()}`
  console.log(`\nBuilding ${demo.slug} → ${demoBase}`)

  if (!existsSync(join(demoDir, 'node_modules'))) {
    console.log(`Installing dependencies for ${demo.slug}...`)
    try {
      execSync('npm install', {
        cwd: demoDir,
        stdio: 'inherit',
      })
    } catch {
      console.error(`Dependency install failed for ${demo.slug}`)
      failed.push({ slug: demo.slug, reason: 'npm install failed' })
      continue
    }
  }

  try {
    execSync('npm run build', {
      cwd: demoDir,
      env: {
        ...process.env,
        DEMO_BASE_PATH: demoBase,
        DEMO_PRERENDER: 'true',
        DEMO_BUILD_ROOT: buildRootRel,
      },
      stdio: 'inherit',
    })
  } catch {
    console.error(`Build failed for ${demo.slug}`)
    failed.push({ slug: demo.slug, reason: 'build failed' })
    continue
  }

  const clientDir = resolveClientDir(demoDir, buildRootRel)
  if (!existsSync(clientDir)) {
    console.warn(`Skipping copy for ${demo.slug}: dist/client not found`)
    failed.push({ slug: demo.slug, reason: 'dist/client not found' })
    continue
  }

  try {
    const targetDir = join(publicDemosRoot, demo.slug)
    publishDirectory(clientDir, targetDir)

    const sourceIndex = join(clientDir, 'index.html')
    const targetIndex = join(targetDir, 'index.html')
    if (existsSync(sourceIndex)) {
      copyFileSync(sourceIndex, targetIndex)
    }

    writeDemoIndexHtmlFallback(targetDir, demoDir, buildRootRel)
    pruneOldHostedBuilds(demoDir, demo.slug, buildRootRel)
    console.log(`Published ${demo.slug} to demos-dist/${demo.slug}/`)
    succeeded.push(demo.slug)
  } catch (error) {
    console.error(`Publish failed for ${demo.slug}:`, error instanceof Error ? error.message : error)
    failed.push({ slug: demo.slug, reason: 'publish failed' })
  }
}

for (const entry of readdirSync(publicDemosRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  if (entry.name.includes('.trash-')) {
    try {
      removePathRobust(join(publicDemosRoot, entry.name), entry.name)
    } catch {
      // Best-effort cleanup of leftover trash folders.
    }
  }
}

console.log('\n--- Demo build summary ---')
console.log(`Published: ${succeeded.length}${succeeded.length ? ` (${succeeded.join(', ')})` : ''}`)
if (failed.length) {
  console.log(`Failed: ${failed.length}`)
  for (const item of failed) {
    console.log(`  - ${item.slug}: ${item.reason}`)
  }
}

console.log('\nIn admin, set reference link to /demos/{slug}/ (example: /demos/aurora/)')

if (failed.length && !succeeded.length) {
  process.exit(1)
}
