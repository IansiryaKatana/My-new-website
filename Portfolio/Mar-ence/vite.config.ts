import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getTanstackStartDemoPluginOptions,
} from '../demo-hosting.vite.ts'

const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  resolve: { tsconfigPaths: true },
  server: {
    port: getDemoDevPort(3016),
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
  ],
})
