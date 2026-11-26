import { createClient } from '@supabase/supabase-js';

// Konfigurasi murni dari file .env (Menggunakan Publishable Key standar Supabase terbaru)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

export const supabaseKey = supabasePublishableKey;

// Cegah penggunaan Secret Key (sb_secret_...) di lingkungan browser/frontend
const isSecretKeyMisused = supabasePublishableKey.startsWith('sb_secret_');
if (isSecretKeyMisused) {
  console.error(
    '[Supabase Security] VITE_SUPABASE_PUBLISHABLE_KEY tidak boleh memakai sb_secret_ key! Gunakan sb_publishable_ key di frontend.'
  );
} else if (supabasePublishableKey.startsWith('eyJ') && import.meta.env.DEV) {
  console.warn(
    '[Supabase Deprecation] VITE_SUPABASE_PUBLISHABLE_KEY masih menggunakan legacy JWT anon key (eyJ...). Disarankan bermigrasi ke format sb_publishable_ terbaru.'
  );
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  !isSecretKeyMisused &&
  /^https?:\/\//i.test(supabaseUrl)
);

// Tangani AuthRetryableFetchError secara aman saat browser offline / domain Supabase tidak dapat dijangkau
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || '');

    if (
      reason?.name === 'AuthRetryableFetchError' ||
      (msg.includes('Failed to fetch') && (reason?.stack?.includes('gotrue') || reason?.stack?.includes('supabase')))
    ) {
      event.preventDefault();
      console.warn('[Supabase Offline] Layanan Supabase tidak dapat dijangkau. Bekerja dalam mode offline/tamu.');
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
        console.warn('[Supabase Network] Tidak dapat menghubungi server Supabase (offline/DNS error).');
        throw err;
      }
    }
  }
};

// Jangan membuat client palsu ke domain disabled.local saat belum dikonfigurasi
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, clientOptions)
  : null;

/**
 * Helper untuk memastikan klien Supabase siap digunakan sebelum query.
 */
export const assertSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Konfigurasi Supabase belum aktif atau tidak valid.');
  }
  return supabase;
};

let onlineUsersChannel = null;
const onlineSyncListeners = new Set();
let trackedPresencePayload = null;

const notifyOnlineSync = () => {
  if (!onlineUsersChannel) return;
  const state = onlineUsersChannel.presenceState() || {};
  onlineSyncListeners.forEach((listener) => {
    try {
      listener(state);
    } catch (err) {
      console.warn('Online presence listener error:', err);
    }
  });
};

/**
 * Subscribe secara terkoordinasi ke channel presence 'online-users' agar antar komponen
 * (mis. Live.jsx dan useChatbot.js) tidak saling memutus koneksi Realtime.
 */
export const subscribeOnlinePresence = ({ onSync, trackPayload = null } = {}) => {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  if (onSync) {
    onlineSyncListeners.add(onSync);
  }
  if (trackPayload) {
    trackedPresencePayload = trackPayload;
  }

  if (!onlineUsersChannel) {
    onlineUsersChannel = supabase.channel('online-users');
    onlineUsersChannel
      .on('presence', { event: 'sync' }, notifyOnlineSync)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && trackedPresencePayload && onlineUsersChannel) {
          try {
            await onlineUsersChannel.track(trackedPresencePayload);
          } catch (err) {
            console.warn('Online presence track failed:', err);
          }
        }
      });
  } else {
    if (onSync) {
      try {
        onSync(onlineUsersChannel.presenceState() || {});
      } catch {
        // abaikan error callback awal
      }
    }
    if (trackPayload && onlineUsersChannel.state === 'joined') {
      onlineUsersChannel.track(trackPayload).catch((err) => {
        console.warn('Online presence track failed:', err);
      });
    }
  }

  return () => {
    if (onSync) {
      onlineSyncListeners.delete(onSync);
    }
    if (trackPayload && trackedPresencePayload === trackPayload) {
      trackedPresencePayload = null;
      if (onlineUsersChannel && onlineUsersChannel.state === 'joined') {
        onlineUsersChannel.untrack().catch(() => {});
      }
    }
    if (onlineSyncListeners.size === 0 && !trackedPresencePayload && onlineUsersChannel) {
      const ch = onlineUsersChannel;
      onlineUsersChannel = null;
      supabase.removeChannel(ch);
    }
  };
};
