import { createClient } from '@supabase/supabase-js';

// Konfigurasi murni dari file .env (Menggunakan Publishable Key standar Supabase terbaru)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const supabaseKey = supabasePublishableKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('http')
);

// Tangani unhandled rejection khusus dari Gotrue / Web Locks secara global
// Hal ini mencegah error "Uncaught (in promise) AbortError: Lock broken by another request with the 'steal' option"
// dan "AuthRetryableFetchError: Failed to fetch" menghentikan aplikasi saat Supabase offline / domain tidak aktif.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || '');

    // 1. Supabase Web Locks "steal" abortion saat token refresh gagal/timeout
    if (
      reason?.name === 'AbortError' &&
      msg.includes("Lock broken by another request with the 'steal' option")
    ) {
      event.preventDefault();
      return;
    }

    // 2. Gotrue retryable fetch error saat offline / DNS tidak teresolusi
    if (
      reason?.name === 'AuthRetryableFetchError' ||
      (msg.includes('Failed to fetch') && (reason?.stack?.includes('gotrue') || reason?.stack?.includes('supabase')))
    ) {
      event.preventDefault();
      console.warn('[Supabase Offline] Layanan Supabase tidak dapat dijangkau. Bekerja dalam mode offline/tamu.');
      return;
    }
  });
}

const clientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    fetch: async (...args) => {
      try {
        return await fetch(...args);
      } catch (err) {
        // Log friendly warning bukannya melempar uncaught exception fatal
        console.warn('[Supabase Network] Tidak dapat menghubungi server Supabase (offline/DNS error).');
        throw err;
      }
    }
  }
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, clientOptions)
  : createClient(supabaseUrl || 'https://disabled.local', 'disabled-key', {
      auth: { persistSession: false, autoRefreshToken: false }
    });
