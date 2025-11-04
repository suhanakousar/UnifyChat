import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['vite'] // 'lodash/debounce' should NOT be here
    }
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://unifychat-2.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
