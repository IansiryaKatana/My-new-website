import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getTanstackStartDemoPluginOptions,
} from '../demo-hosting.vite.ts'

const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  server: {
    port: getDemoDevPort(3022),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
  ],
})
