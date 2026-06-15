import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getHostedDemoDefineExtras,
  getHostedViteBuildConfig,
  getTanstackStartDemoPluginOptions,
  isHostedDemoBuild,
} from '../demo-hosting.vite.ts'

const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  ...getHostedDemoDefineExtras(),
  server: {
    port: getDemoDevPort(3013),
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(
      getTanstackStartDemoPluginOptions({
        server: { entry: 'server' },
      }),
    ),
    ...(isHostedDemoBuild() ? [] : [nitro()]),
    viteReact(),
  ],
})
