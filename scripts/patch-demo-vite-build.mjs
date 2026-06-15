import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const config = JSON.parse(readFileSync(join(root, 'demos.config.json'), 'utf8'))

for (const demo of config.demos) {
  const vitePath = join(root, 'Portfolio', demo.folder, 'vite.config.ts')
  if (!existsSync(vitePath)) continue

  let source = readFileSync(vitePath, 'utf8')

  if (!source.includes('getHostedDemoDefineExtras')) {
    source = source.replace(
      /getHostedViteBuildConfig,\n/,
      'getHostedDemoDefineExtras,\n  getHostedViteBuildConfig,\n',
    )

    if (!source.includes('getHostedDemoDefineExtras')) {
      source = source.replace(
        /getPortfolioDemoViteConfig,\n/,
        'getPortfolioDemoViteConfig,\n  getHostedDemoDefineExtras,\n',
      )
    }
  }

  source = source.replace(/\n\s*build: getHostedViteBuildConfig\(\),\n/, '\n')

  if (!source.includes('...getHostedDemoDefineExtras()')) {
    source = source.replace(
      /(export default defineConfig\(\{\n\s*base: demo\.base,\n)/,
      '$1  ...getHostedDemoDefineExtras(),\n',
    )
  }

  writeFileSync(vitePath, source, 'utf8')
  console.log(`Patched ${demo.folder}/vite.config.ts`)
}
