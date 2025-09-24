import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    server: {
      port: 3003,
      proxy: {
        '/api': 'http://localhost:5000',
      }
    },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer'],
  },
}) 