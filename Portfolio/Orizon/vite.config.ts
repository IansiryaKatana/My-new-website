import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getHostedDemoDefineExtras,
  getHostedViteBuildConfig,
  getTanstackStartDemoPluginOptions,
} from '../demo-hosting.vite.ts'

const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  ...getHostedDemoDefineExtras(),
  resolve: { tsconfigPaths: true },
  server: {
    port: getDemoDevPort(3011),
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
  ],
})
