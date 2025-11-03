import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true, // Force re-optimization to resolve imports
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  }
})
