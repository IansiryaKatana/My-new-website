import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
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
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: getDemoDevPort(3025),
  },
  plugins: [tanstackStart(getTanstackStartDemoPluginOptions()), tailwindcss(), viteReact()],
})
