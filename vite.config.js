import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compress from 'vite-plugin-compression'
// removed unused imports (fs, path) to satisfy ESLint

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
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            try {
              const parsed = new URL(req.url, 'http://localhost')
              if (parsed.pathname && parsed.pathname.startsWith('/api/placeholder')) {
                const parts = parsed.pathname.split('/')
                const w = parseInt(parts[3]) || 128
                const h = parseInt(parts[4]) || 128
                const text = parsed.searchParams.get('text') || ''
                const fontSize = Math.max(10, Math.floor(Math.min(w, h) / 3))
                const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e6e6e6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="#666">${text}</text></svg>`
                res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
                res.end(svg)
                return
              }
            } catch {
              // ignore parse errors
            }
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'backend unavailable' }))
            } else {
              try { res.end() } catch { /* ignore */ }
            }
          })
        }
      },
      // Proxy socket.io websocket connections
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', () => undefined)
        }
      }
      ,
      // Proxy avatar static assets to backend
      '/avatar': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'avatar service unavailable' }))
            } else {
              try { res.end() } catch { /* ignore */ }
            }
          })
        }
      }
    }
  }
})
