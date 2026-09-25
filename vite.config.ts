import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.ZOAT_RELATIVE_BASE === '1' ? './' : '/',
  plugins: [
    react(),
    {
      name: 'zoat-ad-page',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url || ''
          if (url === '/ad' || url === '/ad/' || url.startsWith('/ad/?')) {
            req.url = '/ad/index.html'
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
  },
})
