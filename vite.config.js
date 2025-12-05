import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compress from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Generate compressed assets (gzip and brotli) for production build
    compress(),
    compress({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  server: {
    proxy: {
      // Proxy REST API requests to backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      // Proxy socket.io websocket connections
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        secure: false
      }
      ,
      // Proxy avatar static assets to backend
      '/avatar': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
