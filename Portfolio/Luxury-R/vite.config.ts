import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getTanstackStartDemoPluginOptions,
} from '../demo-hosting.vite.ts'

const demo = getPortfolioDemoViteConfig()

export default defineConfig({
  base: demo.base,
  server: {
    port: getDemoDevPort(3020),
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart(getTanstackStartDemoPluginOptions()),
    viteReact(),
  ],
})
