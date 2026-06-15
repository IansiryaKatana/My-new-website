import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'static-public',
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ['react-phone-number-input', 'country-flag-icons', 'libphonenumber-js'],
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
})
