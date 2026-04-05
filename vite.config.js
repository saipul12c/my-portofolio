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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
          'motion': ['framer-motion'],
          'ui': ['lucide-react', 'react-icons', 'emoji-picker-react'],
          'nlp': ['compromise'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    // Proxy configuration removed: using Supabase for all dynamic data
  }
})
