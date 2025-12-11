import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // listen on all interfaces
    port: 5173,            // your mapped port
    strictPort: true,
    hmr: {
      host: 'localhost',   // or your host IP if needed
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
    },
  },
})

