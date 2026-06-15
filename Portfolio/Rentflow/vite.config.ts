import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

import {
  getDemoDevPort,
  getPortfolioDemoViteConfig,
  getHostedDemoDefineExtras,
  getHostedViteBuildConfig,
  getTanstackStartDemoPluginOptions,
  isHostedDemoBuild,
} from '../demo-hosting.vite.ts'

export default defineConfig(({ command, mode }) => {
  const demo = getPortfolioDemoViteConfig()
  const hostedDemo = isHostedDemoBuild()

  const envDefine: Record<string, string> = {}
  const loadedEnv = loadEnv(mode, process.cwd(), 'VITE_')
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value)
  }

  return {
    base: demo.base,
    define: envDefine,
    resolve: {
      alias: {
        '@': `${process.cwd()}/src`,
      },
      dedupe: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@tanstack/react-query',
        '@tanstack/query-core',
      ],
    },
    server: {
      host: '::',
      port: getDemoDevPort(3014),
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ['./tsconfig.json'] }),
      tanstackStart(
        getTanstackStartDemoPluginOptions({
          importProtection: {
            behavior: 'error',
            client: {
              files: ['**/server/**'],
              specifiers: ['server-only'],
            },
          },
          server: { entry: 'server' },
        }),
      ),
      ...(command === 'build' && !hostedDemo
        ? [
            nitro({
              preset: process.env.NITRO_PRESET ?? 'cloudflare-module',
              output: {
                dir: 'dist',
                serverDir: 'dist/server',
                publicDir: 'dist/client',
              },
              cloudflare: { nodeCompat: true, deployConfig: true },
            }),
          ]
        : []),
      viteReact(),
    ],
  }
})
