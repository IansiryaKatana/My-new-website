import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getTanstackStartDemoPluginOptions,
} from '../demo-hosting.vite.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  server: {
    port: getDemoDevPort(3026),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
    tailwindcss(),
  ],
})
