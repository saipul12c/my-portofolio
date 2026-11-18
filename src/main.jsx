import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tangani error chunk kadaluarsa secara otomatis saat rilis versi baru
window.addEventListener('vite:preloadError', () => {
  console.warn('[Vite] Chunk preload gagal (kemungkinan rilis baru). Memuat ulang halaman...');
  const lastReload = sessionStorage.getItem('vite_preload_retry');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem('vite_preload_retry', now.toString());
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
