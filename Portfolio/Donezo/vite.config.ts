import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getTanstackStartDemoPluginOptions,
} from '../demo-hosting.vite.ts'

const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: getDemoDevPort(3023),
  },
  plugins: [
    tailwindcss(),
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
  ],
})
