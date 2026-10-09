import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))
const serviceIds = ['computer-repairs', 'custom-pcs', 'web-design'] as const

export default defineConfig({
  base: process.env.ZOAT_RELATIVE_BASE === '1' ? './' : '/',
  plugins: [
    react(),
    {
      name: 'zoat-html-pages',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const raw = req.url || ''
          const path = raw.split('?')[0]
          const extra = raw.slice(path.length)
          const folders = ['ad', ...serviceIds]
          for (const id of folders) {
            if (path === `/${id}` || path === `/${id}/`) {
              req.url = `/${id}/index.html${extra}`
              break
            }
          }
          next()
        })
      },
    },
  ],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        'computer-repairs': resolve(root, 'computer-repairs/index.html'),
        'custom-pcs': resolve(root, 'custom-pcs/index.html'),
        'web-design': resolve(root, 'web-design/index.html'),
      },
    },
  },
})
