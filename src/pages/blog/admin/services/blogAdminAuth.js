/**
 * 🔐 blogAdminAuth.js
 * Sistem autentikasi untuk Blog Admin.
 * Mendukung verifikasi Supabase Auth (role ADMIN/SUPER_ADMIN untuk sinkronisasi cloud)
 * serta fallback lokal untuk mode demo/offline saat Supabase belum diautentikasi.
 */

import { supabase, isSupabaseConfigured } from '../../../../lib/supabaseClient';

const AUTH_STORAGE_KEY = 'blog_admin_session';
const CREDENTIALS_KEY = 'blog_admin_credentials';
const ATTEMPTS_KEY = 'blog_admin_login_attempts';
const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

// Kredensial bawaan yang aman & mudah digunakan
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  email: 'admin@blog.id',
  password: 'admin123',
  pin: '2026',
  displayName: 'Blog Administrator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Super Admin Blog'
};

/**
 * Dapatkan kredensial aktif yang tersimpan
 */
export const getAdminCredentials = () => {
  if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (stored) {
      return { ...DEFAULT_CREDENTIALS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Error reading admin credentials:', e);
  }
  return DEFAULT_CREDENTIALS;
};

/**
 * Update kredensial admin (ganti password, nama, username)
 */
export const updateAdminCredentials = (newCredentials) => {
  try {
    const current = getAdminCredentials();
    const updated = { ...current, ...newCredentials };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));

    // Jika sedang login, perbarui data profil di sesi aktif
    const session = getAdminSession();
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        ...session,
        displayName: updated.displayName,
        username: updated.username,
        email: updated.email,
        avatar: updated.avatar
      }));
    }
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

/**
 * Cek status sesi admin saat ini
 */
export const getAdminSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    
    // Cek kadaluarsa sesi (default 7 hari jika remember, atau validasi timestamp)
    if (session && session.expiresAt && Date.now() > session.expiresAt) {
      logoutAdmin();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  return Boolean(getAdminSession());
};

/**
 * Cek pembatasan percobaan login (Rate Limiting)
 */
export const getRateLimitStatus = () => {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };
    const { count, lockUntil } = JSON.parse(raw);
    if (lockUntil && Date.now() < lockUntil) {
      const remainingSeconds = Math.ceil((lockUntil - Date.now()) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    return { isLocked: false, count: count || 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
};

/**
 * Catat kegagalan login untuk proteksi brute force
 */
const recordFailedAttempt = () => {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    let attempts = raw ? JSON.parse(raw) : { count: 0, lockUntil: null };
    attempts.count = (attempts.count || 0) + 1;

    if (attempts.count >= 5) {
      // Kunci selama 45 detik
      attempts.lockUntil = Date.now() + 45 * 1000;
    }
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
    return attempts;
  } catch {
    return { count: 1 };
  }
};

const clearFailedAttempts = () => {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    // ignore
  }
};

/**
 * Proses login khusus Blog Admin
 * Mendukung login via Email/Username + Password (prioritas Supabase Auth untuk sinkronisasi cloud)
 * serta fallback kredensial lokal / Secret PIN untuk mode lokal/demo.
 */
export const loginAdmin = async ({ identifier, password, pin, rememberMe = true }) => {
  // Cek rate limiting
  const rateLimit = getRateLimitStatus();
  if (rateLimit.isLocked) {
    throw new Error(`Terlalu banyak percobaan gagal. Silakan tunggu ${rateLimit.remainingSeconds} detik lagi.`);
  }

  const credentials = getAdminCredentials();
  let sessionData = null;
  let customAuthError = null;

  // Login via Secret PIN (mode lokal)
  if (pin) {
    if (pin.trim() === credentials.pin) {
      sessionData = {
        token: 'bat_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
        username: credentials.username,
        email: credentials.email,
        displayName: credentials.displayName,
        avatar: credentials.avatar,
        role: credentials.role,
        authMode: 'local',
        loggedInAt: new Date().toISOString(),
        expiresAt: rememberMe ? Date.now() + 14 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000
      };
    }
  } else if (identifier && password) {
    const rawIdentifier = identifier.trim();
    const id = rawIdentifier.toLowerCase();

    // 1. Jika identifier berupa email & Supabase aktif, verifikasi via Supabase Auth terlebih dahulu
    if (rawIdentifier.includes('@') && isSupabaseConfigured && supabase) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: id,
        password
      });

      if (!authError && authData?.user) {
        const metaRole = String(authData.user.app_metadata?.role || '').toUpperCase();
        const { data: profileRow } = await supabase
          .from('users')
          .select('id, nama, email, role, status')
          .eq('id', authData.user.id)
          .maybeSingle();

        const effectiveRole = String(profileRow?.role || metaRole || 'USER').toUpperCase();
        const isBanned = ['nonaktif', 'banned'].includes(String(profileRow?.status || '').toLowerCase());

        if (!ADMIN_ROLES.has(effectiveRole) || isBanned) {
          await supabase.auth.signOut().catch(() => {});
          customAuthError = 'Akun Supabase ini tidak memiliki hak akses Admin Blog atau sedang nonaktif.';
        } else {
          sessionData = {
            token: 'bat_supa_' + authData.user.id,
            supabaseUserId: authData.user.id,
            username: profileRow?.nama || authData.user.email.split('@')[0],
            email: profileRow?.email || authData.user.email,
            displayName: profileRow?.nama || credentials.displayName,
            avatar: credentials.avatar,
            role: effectiveRole === 'SUPER_ADMIN' ? 'Super Admin Blog' : 'Admin Blog',
            authMode: 'supabase',
            loggedInAt: new Date().toISOString(),
            expiresAt: rememberMe ? Date.now() + 14 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000
          };
        }
      }
    }

    // 2. Fallback ke kredensial lokal (untuk mode demo / offline)
    if (!sessionData && !customAuthError) {
      const isUserMatch = id === credentials.username.toLowerCase() || id === credentials.email.toLowerCase();
      const isPassMatch = password === credentials.password;

      if (isUserMatch && isPassMatch) {
        sessionData = {
          token: 'bat_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
          username: credentials.username,
          email: credentials.email,
          displayName: credentials.displayName,
          avatar: credentials.avatar,
          role: credentials.role,
          authMode: 'local',
          loggedInAt: new Date().toISOString(),
          expiresAt: rememberMe ? Date.now() + 14 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000
        };
      }
    }
  }

  if (!sessionData) {
    const att = recordFailedAttempt();
    if (customAuthError) {
      throw new Error(customAuthError);
    }
    const remainingTries = Math.max(0, 5 - att.count);
    if (remainingTries === 0) {
      throw new Error('5x Percobaan gagal berturut-turut. Akses dikunci selama 45 detik.');
    }
    throw new Error(`Kredensial tidak valid. Sisa percobaan: ${remainingTries}x.`);
  }

  // Berhasil login
  clearFailedAttempts();

  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  }

  return sessionData;
};

export const isSupabaseBlogAdminActive = () => {
  return Boolean(isSupabaseConfigured && supabase && getAdminSession()?.authMode === 'supabase');
};

/**
 * Logout admin
 */
export const logoutAdmin = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    if (parsed?.authMode === 'supabase' && isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch((err) => {
        console.warn('Supabase admin signOut warning:', err);
      });
    }
  } catch (e) {
    console.warn('Error during admin logout:', e);
  }
};
