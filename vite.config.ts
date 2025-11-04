/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    proxy: {
      '/api-euskotren': {
        target: 'https://www.euskotren.eus',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-euskotren/, ''),
      },
      '/api-metrobilbao': {
        target: 'https://api.metrobilbao.eus',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-metrobilbao/, ''),
      },
    },
  },
})
