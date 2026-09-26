import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige /api al backend de Express durante el desarrollo
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
