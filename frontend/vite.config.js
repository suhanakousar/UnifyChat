import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['vite']
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
