import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compress from 'vite-plugin-compression'
import saipulApiHandler from './api/saipul.js'
import fs from 'node:fs'
import path from 'node:path'

// Baca info versi dari package.json
const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const currentBuildTime = Date.now();

function versionPlugin() {
  return {
    name: 'vite-plugin-app-version',
    buildStart() {
      try {
        const publicDir = path.resolve(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const versionData = {
          version: pkg.version,
          buildTime: currentBuildTime
        };
        fs.writeFileSync(path.resolve(publicDir, 'version.json'), JSON.stringify(versionData, null, 2));
      } catch (err) {
        console.warn('Gagal memperbarui public/version.json:', err);
      }
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({
          version: pkg.version,
          buildTime: currentBuildTime
        }, null, 2)
      });
    }
  };
}

function saipulApiPlugin() {
  const handleAssetImage = (req, res, next) => {
    if (req.url && req.url.startsWith('/assets/images/')) {
      const cleanPath = req.url.replace(/^\/assets\/images\//, '').split('?')[0];
      const filename = decodeURIComponent(cleanPath);
      const filePath = path.resolve(process.cwd(), 'src/assets/images', filename);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.gif': 'image/gif'
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }
    next();
  };

  const registerSaipulMiddlewares = (middlewares) => {
    middlewares.use(handleAssetImage);
    middlewares.use(async (req, res, next) => {
      const pathname = (req.url || '').split('?')[0];
      if (pathname === '/api' || pathname.startsWith('/api/')) {
        await saipulApiHandler(req, res);
        return;
      }
      next();
    });
  };

  return {
    name: 'vite-plugin-saipul-api',
    configureServer(server) {
      registerSaipulMiddlewares(server.middlewares);
    },
    configurePreviewServer(server) {
      registerSaipulMiddlewares(server.middlewares);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '#kb-datasets': path.resolve(process.cwd(), 'src/utils/ai/datasets.browser.js'),
    },
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(currentBuildTime),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(currentBuildTime),
  },
  plugins: [
    react(),
    tailwindcss(),
    saipulApiPlugin(),
    versionPlugin(),
    // Generate compressed assets (gzip and brotli) for production build
    compress(),
    compress({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  optimizeDeps: {
    exclude: ['@xenova/transformers']
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      external: ['@xenova/transformers'],
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react', 'react-icons'],
          'emoji': ['emoji-picker-react'],
          'math': ['mathjs'],
          'charts': ['recharts'],
          'markdown': ['react-markdown', 'remark-gfm'],
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
