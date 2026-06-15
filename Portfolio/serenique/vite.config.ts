import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
  server: {
    port: getDemoDevPort(3019),
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
    tailwindcss(),
  ],
})
