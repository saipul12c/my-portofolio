import { createClient } from '@supabase/supabase-js';

// Pastikan selalu ada URL valid agar createClient tidak melempar error inisialisasi
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

const supabaseUrl = (rawUrl && rawUrl.startsWith('http')) ? rawUrl : fallbackUrl;
const supabaseAnonKey = rawKey || fallbackKey;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('placeholder')
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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
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
});
