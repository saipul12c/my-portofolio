import { USER_TIERS, USER_ROLES } from './constants';

export const generateUserColor = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getTierColor = (tier) => {
  const tierColors = {
    [USER_TIERS.BRONZE]: '#cd7f32',
    [USER_TIERS.SILVER]: '#c0c0c0',
    [USER_TIERS.GOLD]: '#ffd700',
    [USER_TIERS.PLATINUM]: '#e5e4e2',
    [USER_TIERS.EMERALD]: '#50c878',
    [USER_TIERS.DIAMOND]: '#b9f2ff'
  };
  return tierColors[tier] || '#72767d';
};

export const getRoleBadge = (role) => {
  const roleBadges = {
    [USER_ROLES.SUPERVISOR]: { text: 'SUPERVISOR', color: 'bg-red-600' },
    [USER_ROLES.ADMIN]: { text: 'ADMIN', color: 'bg-purple-600' },
    [USER_ROLES.USER]: { text: 'USER', color: 'bg-gray-600' }
  };
  return roleBadges[role] || roleBadges[USER_ROLES.USER];
};

export const canManageServer = (userRole) => {
  return [USER_ROLES.SUPERVISOR, USER_ROLES.ADMIN].includes(userRole);
};

export const friendlyFetchError = (err, res) => {
  // Prefer server-provided message
  if (res && typeof res.status === 'number') {
    if (res.status === 503) return 'Server sedang dalam pemeliharaan atau tidak tersedia. Silakan coba lagi nanti.';
    if (res.status === 502 || res.status === 504) return 'Tidak bisa terhubung ke server upstream. Silakan coba lagi nanti.';
    if (res.status === 500) return 'Terjadi masalah pada server. Tim kami sudah diberitahu.';
    if (res.status === 401) return 'Anda perlu masuk kembali.';
    if (res.status === 404) return 'Sumber tidak ditemukan.';
  }

  if (err) {
    const msg = (err.message || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network request failed')) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.';
    }
    if (msg.includes('timeout')) return 'Permintaan memakan waktu terlalu lama. Coba lagi.';
  }

  return 'Terjadi kesalahan. Silakan coba lagi.';
};