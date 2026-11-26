import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import maintenanceData from '../data/maintenance/maintenanceData.json';

export const SITE_MAINTENANCE_KEY = 'site_maintenance';
export const LIVE_MAINTENANCE_KEY = 'maintenance_mode';
const CACHE_STORAGE_KEY = 'saipul_site_maintenance_cache_v1';
const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

const FALLBACK_MESSAGES = Array.isArray(maintenanceData?.messages) && maintenanceData.messages.length > 0
  ? maintenanceData.messages
  : [
      'Memeriksa koneksi jaringan...',
      'Mengatur ulang pengaturan sistem...',
      'Memastikan data tetap aman...',
      'Hampir selesai, tinggal sentuhan akhir... ✨',
    ];

export const DEFAULT_MAINTENANCE_CONFIG = {
  globalEnabled: false,
  pageOverrides: {},
  pageNotes: {},
  pageConfigs: {},
  customPaths: [],
  helpButtonMaintenance: false,
  allowAdminBypass: true,
  title: 'Situs Sedang Dalam Perawatan',
  description:
    'Kami sedang memperbarui sistem agar lebih cepat, aman, dan nyaman untuk semua pengunjung 🌍 Terima kasih sudah menunggu dengan sabar 🙏',
  startedAt: '',
  targetTime: '',
  footerNote: 'Kami berusaha agar semuanya siap sebelum kamu sempat refill kopi ☕',
  contactEmail: '',
  showHomeButton: true,
  showProgressBar: true,
  showCountdown: true,
  messages: [...FALLBACK_MESSAGES],
  updatedAt: '',
  updatedBy: '',
};

function normalizePageConfigs(rawPageConfigs) {
  if (!rawPageConfigs || typeof rawPageConfigs !== 'object' || Array.isArray(rawPageConfigs)) {
    return {};
  }
  const normalized = {};
  for (const [key, val] of Object.entries(rawPageConfigs)) {
    if (!val || typeof val !== 'object') continue;
    const customMessages = Array.isArray(val.messages)
      ? val.messages.map((m) => String(m || '').trim()).filter(Boolean)
      : [];
    normalized[key] = {
      badge: typeof val.badge === 'string' ? val.badge : '',
      title: typeof val.title === 'string' ? val.title : '',
      description: typeof val.description === 'string' ? val.description : '',
      footerNote: typeof val.footerNote === 'string' ? val.footerNote : '',
      startedAt: typeof val.startedAt === 'string' ? val.startedAt : '',
      targetTime: typeof val.targetTime === 'string' ? val.targetTime : '',
      messages: customMessages,
    };
  }
  return normalized;
}

export function normalizeMaintenanceConfig(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const messages = Array.isArray(source.messages)
    ? source.messages.map((m) => String(m || '').trim()).filter(Boolean)
    : [];

  return {
    ...DEFAULT_MAINTENANCE_CONFIG,
    ...source,
    globalEnabled: Boolean(source.globalEnabled),
    helpButtonMaintenance: Boolean(source.helpButtonMaintenance),
    allowAdminBypass: source.allowAdminBypass !== false,
    showHomeButton: source.showHomeButton !== false,
    showProgressBar: source.showProgressBar !== false,
    showCountdown: source.showCountdown !== false,
    pageOverrides:
      source.pageOverrides && typeof source.pageOverrides === 'object' && !Array.isArray(source.pageOverrides)
        ? { ...source.pageOverrides }
        : {},
    pageNotes:
      source.pageNotes && typeof source.pageNotes === 'object' && !Array.isArray(source.pageNotes)
        ? { ...source.pageNotes }
        : {},
    pageConfigs: normalizePageConfigs(source.pageConfigs),
    customPaths: Array.isArray(source.customPaths)
      ? Array.from(new Set(source.customPaths.map((p) => String(p || '').trim()).filter(Boolean)))
      : [],
    title: typeof source.title === 'string' && source.title.trim() ? source.title : DEFAULT_MAINTENANCE_CONFIG.title,
    description:
      typeof source.description === 'string' && source.description.trim()
        ? source.description
        : DEFAULT_MAINTENANCE_CONFIG.description,
    startedAt: typeof source.startedAt === 'string' ? source.startedAt : '',
    targetTime: typeof source.targetTime === 'string' ? source.targetTime : '',
    footerNote:
      typeof source.footerNote === 'string'
        ? source.footerNote
        : DEFAULT_MAINTENANCE_CONFIG.footerNote,
    contactEmail: typeof source.contactEmail === 'string' ? source.contactEmail : '',
    messages: messages.length > 0 ? messages : [...FALLBACK_MESSAGES],
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : '',
    updatedBy: typeof source.updatedBy === 'string' ? source.updatedBy : '',
  };
}

export function readCachedMaintenanceState() {
  if (typeof window === 'undefined') {
    return { config: DEFAULT_MAINTENANCE_CONFIG, liveChatMaintenance: false };
  }
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return { config: DEFAULT_MAINTENANCE_CONFIG, liveChatMaintenance: false };
    const parsed = JSON.parse(raw);
    return {
      config: normalizeMaintenanceConfig(parsed?.config),
      liveChatMaintenance: Boolean(parsed?.liveChatMaintenance),
    };
  } catch {
    return { config: DEFAULT_MAINTENANCE_CONFIG, liveChatMaintenance: false };
  }
}

export function writeCachedMaintenanceState(config, liveChatMaintenance) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CACHE_STORAGE_KEY,
      JSON.stringify({
        config: normalizeMaintenanceConfig(config),
        liveChatMaintenance: Boolean(liveChatMaintenance),
        cachedAt: new Date().toISOString(),
      })
    );
  } catch {
    // Abaikan error kuota localStorage
  }
}

export async function verifyMaintenanceAdminAccess() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      authorized: false,
      user: null,
      reason: 'Konfigurasi Supabase belum aktif.',
    };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const authUser = authData?.user;
    if (authError || !authUser) {
      return {
        authorized: false,
        user: null,
        reason: 'Sesi login tidak ditemukan. Silakan masuk terlebih dahulu.',
      };
    }

    const { data: profileRow, error: profileErr } = await supabase
      .from('users')
      .select('id, nama, email, role, status')
      .eq('id', authUser.id)
      .maybeSingle();

    const jwtRole = String(authUser.app_metadata?.role || '').toUpperCase();
    const dbRole = String(profileRow?.role || '').toUpperCase();
    const effectiveRole = dbRole || jwtRole || 'USER';
    const status = String(profileRow?.status || 'aktif').toLowerCase();

    if (status === 'banned' || status === 'nonaktif') {
      return {
        authorized: false,
        user: null,
        reason: 'Akun Anda sedang dinonaktifkan atau diblokir.',
      };
    }

    if (!ADMIN_ROLES.has(effectiveRole)) {
      return {
        authorized: false,
        user: {
          id: authUser.id,
          email: authUser.email,
          nama: profileRow?.nama || authUser.email?.split('@')[0],
          role: effectiveRole,
        },
        reason: profileErr
          ? `Role akun (${effectiveRole}) tidak memiliki izin Admin Maintenance.`
          : `Akun ber-role "${effectiveRole}" tidak diizinkan. Hanya ADMIN atau SUPER_ADMIN yang dapat mengelola Maintenance.`,
      };
    }

    return {
      authorized: true,
      user: {
        id: authUser.id,
        email: profileRow?.email || authUser.email,
        nama: profileRow?.nama || authUser.user_metadata?.nama || authUser.email?.split('@')[0] || 'Admin',
        role: effectiveRole,
      },
      reason: '',
    };
  } catch (err) {
    return {
      authorized: false,
      user: null,
      reason: err?.message || 'Gagal memverifikasi akses admin.',
    };
  }
}

export async function fetchMaintenanceState() {
  const cached = readCachedMaintenanceState();

  if (!isSupabaseConfigured || !supabase) {
    return {
      config: cached.config,
      liveChatMaintenance: cached.liveChatMaintenance,
      source: 'default',
      error: 'Supabase belum dikonfigurasi.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('key, value, updated_at')
      .in('key', [SITE_MAINTENANCE_KEY, LIVE_MAINTENANCE_KEY]);

    if (error) throw error;

    const siteRow = (data || []).find((row) => row.key === SITE_MAINTENANCE_KEY);
    const liveRow = (data || []).find((row) => row.key === LIVE_MAINTENANCE_KEY);

    const config = siteRow
      ? normalizeMaintenanceConfig({
          ...siteRow.value,
          updatedAt: siteRow.value?.updatedAt || siteRow.updated_at || '',
        })
      : DEFAULT_MAINTENANCE_CONFIG;

    const liveChatMaintenance = Boolean(liveRow?.value);
    writeCachedMaintenanceState(config, liveChatMaintenance);

    return {
      config,
      liveChatMaintenance,
      hasDbSeed: Boolean(siteRow),
      source: 'supabase',
      error: null,
    };
  } catch (err) {
    console.warn('[MaintenanceService] Gagal membaca config dari Supabase, memakai cache lokal:', err?.message || err);
    return {
      config: cached.config,
      liveChatMaintenance: cached.liveChatMaintenance,
      hasDbSeed: false,
      source: 'cache',
      error: err?.message || 'Gagal mengambil konfigurasi.',
    };
  }
}

async function appendMaintenanceLog({ admin, action, scope, details }) {
  if (!isSupabaseConfigured || !supabase || !admin?.id) return { ok: false, tableMissing: false };
  try {
    const { error } = await supabase.from('maintenance_logs').insert({
      admin_id: admin.id,
      admin_name: admin.nama || admin.email || 'Admin',
      action,
      scope,
      details: details || {},
    });
    if (error) {
      const code = String(error.code || '');
      if (code === '42P01' || code === 'PGRST205') {
        return { ok: false, tableMissing: true };
      }
      console.warn('[MaintenanceService] Gagal mencatat log maintenance:', error.message);
      return { ok: false, tableMissing: false };
    }
    return { ok: true, tableMissing: false };
  } catch {
    return { ok: false, tableMissing: false };
  }
}

export async function saveMaintenanceConfig(nextConfig, meta = {}) {
  const access = await verifyMaintenanceAdminAccess();
  if (!access.authorized) {
    throw new Error(access.reason || 'Akses ditolak. Hanya ADMIN/SUPER_ADMIN yang diizinkan.');
  }

  const now = new Date().toISOString();
  const normalized = normalizeMaintenanceConfig({
    ...nextConfig,
    updatedAt: now,
    updatedBy: access.user.nama || access.user.email,
  });

  const { error } = await supabase
    .from('system_config')
    .upsert(
      {
        key: SITE_MAINTENANCE_KEY,
        value: normalized,
        updated_at: now,
      },
      { onConflict: 'key' }
    );

  if (error) {
    throw new Error(error.message || 'Gagal menyimpan konfigurasi maintenance ke database.');
  }

  const cached = readCachedMaintenanceState();
  writeCachedMaintenanceState(normalized, cached.liveChatMaintenance);

  await appendMaintenanceLog({
    admin: access.user,
    action: meta.action || (normalized.globalEnabled ? 'ENABLE_GLOBAL' : 'UPDATE_CONFIG'),
    scope: meta.scope || (normalized.globalEnabled ? 'global' : 'site'),
    details: {
      globalEnabled: normalized.globalEnabled,
      activePages: Object.entries(normalized.pageOverrides)
        .filter(([, active]) => active)
        .map(([path]) => path),
      helpButtonMaintenance: normalized.helpButtonMaintenance,
      ...(meta.details || {}),
    },
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('saipul_maintenance_updated', { detail: { config: normalized } }));
  }

  return normalized;
}

export async function saveLiveChatMaintenance(enabled) {
  const access = await verifyMaintenanceAdminAccess();
  if (!access.authorized) {
    throw new Error(access.reason || 'Akses ditolak.');
  }

  const now = new Date().toISOString();
  const value = Boolean(enabled);

  const { error } = await supabase
    .from('system_config')
    .upsert(
      {
        key: LIVE_MAINTENANCE_KEY,
        value,
        updated_at: now,
      },
      { onConflict: 'key' }
    );

  if (error) {
    throw new Error(error.message || 'Gagal memperbarui mode maintenance Live Discussion.');
  }

  const cached = readCachedMaintenanceState();
  writeCachedMaintenanceState(cached.config, value);

  await appendMaintenanceLog({
    admin: access.user,
    action: value ? 'ENABLE_LIVE_CHAT_LOCKDOWN' : 'DISABLE_LIVE_CHAT_LOCKDOWN',
    scope: 'live_chat',
    details: { maintenance_mode: value },
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('saipul_maintenance_updated', { detail: { liveChatMaintenance: value } })
    );
  }

  return value;
}

export async function fetchMaintenanceLogs(limit = 30) {
  if (!isSupabaseConfigured || !supabase) {
    return { logs: [], tableMissing: false, error: 'Supabase belum aktif.' };
  }

  try {
    const { data, error } = await supabase
      .from('maintenance_logs')
      .select('id, admin_id, admin_name, action, scope, details, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      const code = String(error.code || '');
      if (code === '42P01' || code === 'PGRST205') {
        return { logs: [], tableMissing: true, error: null };
      }
      throw error;
    }

    return { logs: data || [], tableMissing: false, error: null };
  } catch (err) {
    return {
      logs: [],
      tableMissing: false,
      error: err?.message || 'Gagal memuat riwayat maintenance.',
    };
  }
}
