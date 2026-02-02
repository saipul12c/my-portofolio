// Utilities untuk Role Features di Live Discussion

export const ROLE_FEATURES = {
  SUPER_ADMIN: {
    features: ['system_stats', 'ban_system', 'role_assign', 'server_config', 'user_logs'],
    description: 'Full control atas sistem',
    messageLimit: 9999,
    permissions: ['ban', 'warn', 'assign_role', 'grant_achievement', 'access_logs', 'config_system']
  },
  ADMIN: {
    features: ['mod_tools', 'community_config', 'user_reports', 'content_review'],
    description: 'Kelola komunitas',
    messageLimit: 500,
    permissions: ['ban', 'warn', 'assign_moderator', 'grant_achievement', 'moderate_content']
  },
  MODERATOR: {
    features: ['warn_users', 'message_delete', 'user_support'],
    description: 'Bantu menjaga komunitas',
    messageLimit: 100,
    permissions: ['warn', 'delete_message', 'help_user']
  },
  PREMIUM: {
    features: ['priority_support', 'custom_badge', 'extended_messages', 'reactions'],
    description: 'Fitur premium eksklusif',
    messageLimit: 50,
    permissions: ['priority', 'custom_display', 'reactions']
  },
  VERIFIED: {
    features: ['verified_badge', 'more_messages'],
    description: 'Akun terverifikasi',
    messageLimit: 10,
    permissions: ['verified']
  },
  USER: {
    features: ['basic_chat', 'personal_tags', 'mention'],
    description: 'User biasa',
    messageLimit: 5,
    permissions: ['chat', 'mention']
  }
};

// Fungsi untuk check fitur apa saja yang bisa di-akses user
export const getAvailableFeatures = (userRole) => {
  const roleConfig = ROLE_FEATURES[userRole] || ROLE_FEATURES.USER;
  return roleConfig.features;
};

// Fungsi untuk check permission
export const hasPermission = (userRole, permission) => {
  const roleConfig = ROLE_FEATURES[userRole] || ROLE_FEATURES.USER;
  return roleConfig.permissions.includes(permission);
};

// Fungsi untuk mendapatkan message limit
export const getMessageLimit = (userRole) => {
  const roleConfig = ROLE_FEATURES[userRole] || ROLE_FEATURES.USER;
  return roleConfig.messageLimit;
};

// Fungsi untuk format role name dengan badge
export const getRoleDisplay = (role) => {
  const roleData = {
    SUPER_ADMIN: { name: 'Super Admin', badge: '👑', color: '#6b21a8' },
    ADMIN: { name: 'Admin', badge: '🛡️', color: '#dc2626' },
    MODERATOR: { name: 'Moderator', badge: '⭐', color: '#0369a1' },
    PREMIUM: { name: 'Premium', badge: '💎', color: '#059669' },
    VERIFIED: { name: 'Verified', badge: '✅', color: '#ca8a04' },
    USER: { name: 'User', badge: '👤', color: '#4b5563' }
  };
  
  return roleData[role] || roleData.USER;
};

// Fungsi untuk check apakah user bisa edit profile tertentu
export const canEditProfile = (currentUserRole, currentUserEmail, targetUserEmail) => {
  // Hanya user sendiri atau admin/super admin yang bisa edit
  if (currentUserEmail === targetUserEmail) return true;
  if (currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') return true;
  return false;
};

// Fungsi untuk check apakah user bisa lihat profile tertentu
export const canViewProfile = (currentUserRole, currentUserEmail, targetUserEmail) => {
  // Semua bisa lihat profile orang lain
  return true;
};

// Fungsi untuk calculate experience/level
export const calculateLevel = (messageCount) => {
  return Math.floor(messageCount / 10) || 1;
};

// Fungsi untuk calculate experience points menuju level berikutnya
export const getNextLevelProgress = (messageCount) => {
  const currentLevel = calculateLevel(messageCount);
  const currentExp = messageCount - (currentLevel * 10);
  return {
    currentLevel,
    currentExp,
    expNeeded: 10,
    progress: (currentExp / 10) * 100
  };
};
