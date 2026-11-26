import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMaintenance } from '../context/useMaintenance';
import { useAuth } from '../context/useAuth';
import {
  MAINTENANCE_PAGE_CATALOG,
  isBypassMaintenancePath,
  resolveRouteMaintenance,
} from '../config/maintenanceRoutes';

const DISMISS_STORAGE_KEY = 'saipul_maintenance_notice_dismissed_sig';
const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

/**
 * Hook untuk mendeteksi status Maintenance di seluruh halaman website secara otomatis
 * (serupa dengan useVersionCheck untuk deteksi pembaruan versi).
 */
export function useMaintenanceCheck() {
  const location = useLocation();
  const {
    config,
    liveChatMaintenance,
    loading,
    syncSource,
    realtimeStatus,
    lastSyncedAt,
    refreshMaintenance,
    isPreviewMode,
  } = useMaintenance();
  const { user } = useAuth();

  const [dismissedSignature, setDismissedSignature] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [recoveredInfo, setRecoveredInfo] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const isAdminUser = Boolean(
    user && ADMIN_ROLES.has(String(user.role || '').toUpperCase())
  );

  // Kumpulkan seluruh halaman yang sedang berstatus Maintenance saat ini
  const activeMaintenancePages = useMemo(() => {
    const pageOverrides = config?.pageOverrides || {};
    const pageConfigs = config?.pageConfigs || {};
    const pageNotes = config?.pageNotes || {};
    const customPaths = Array.isArray(config?.customPaths) ? config.customPaths : [];

    const catalogItems = MAINTENANCE_PAGE_CATALOG.filter(
      (entry) => pageOverrides[entry.key] === true
    ).map((entry) => {
      const custom = pageConfigs[entry.key] || {};
      const def = entry.defaultMaintenance || {};
      return {
        key: entry.key,
        label: entry.label,
        category: entry.category,
        badge: custom.badge || def.badge || 'Dalam Perawatan',
        title: custom.title || def.title || `${entry.label} Sedang Dalam Perawatan`,
        description:
          custom.description || pageNotes[entry.key] || def.description || config.description,
        targetTime: custom.targetTime || config.targetTime || '',
      };
    });

    const customItems = customPaths
      .filter((p) => pageOverrides[p] === true)
      .map((p) => {
        const custom = pageConfigs[p] || {};
        return {
          key: p,
          label: p,
          category: 'Kustom',
          badge: custom.badge || 'Dalam Perawatan',
          title: custom.title || `Halaman ${p} Sedang Dalam Perawatan`,
          description: custom.description || pageNotes[p] || config.description,
          targetTime: custom.targetTime || config.targetTime || '',
        };
      });

    return [...catalogItems, ...customItems];
  }, [config]);

  const currentResolution = useMemo(
    () => resolveRouteMaintenance(location.pathname, config),
    [location.pathname, config]
  );

  const isBypassPath = isBypassMaintenancePath(location.pathname);

  // Apakah layar saat ini sudah digantikan penuh oleh Maintenance.jsx
  const isCurrentScreenBlocked = Boolean(
    currentResolution.isUnderMaintenance &&
      !(config?.allowAdminBypass !== false && isAdminUser && !isPreviewMode)
  );

  const hasAnyMaintenance = Boolean(
    config?.globalEnabled ||
      activeMaintenancePages.length > 0 ||
      liveChatMaintenance ||
      config?.helpButtonMaintenance
  );

  // Tanda tangan unik status maintenance saat ini; bila berubah, notifikasi muncul ulang
  const statusSignature = useMemo(() => {
    if (!hasAnyMaintenance) return '';
    return JSON.stringify({
      g: Boolean(config?.globalEnabled),
      p: activeMaintenancePages.map((p) => p.key).sort(),
      l: Boolean(liveChatMaintenance),
      h: Boolean(config?.helpButtonMaintenance),
      t: config?.targetTime || '',
    });
  }, [
    hasAnyMaintenance,
    config?.globalEnabled,
    config?.helpButtonMaintenance,
    config?.targetTime,
    activeMaintenancePages,
    liveChatMaintenance,
  ]);

  // Deteksi pemulihan otomatis (ketika sebelumnya ada maintenance lalu kembali online)
  const prevHasMaintenanceRef = useRef(false);
  const prevPageCountRef = useRef(0);

  useEffect(() => {
    if (loading) return;

    if (prevHasMaintenanceRef.current && !hasAnyMaintenance) {
      setRecoveredInfo({
        message: 'Semua halaman dan layanan telah selesai perawatan dan kembali normal.',
        recoveredAt: new Date().toISOString(),
      });
    } else if (
      prevPageCountRef.current > 0 &&
      activeMaintenancePages.length < prevPageCountRef.current &&
      hasAnyMaintenance
    ) {
      setRecoveredInfo({
        message: 'Sebagian halaman telah selesai perawatan dan kembali online.',
        recoveredAt: new Date().toISOString(),
      });
    }

    prevHasMaintenanceRef.current = hasAnyMaintenance;
    prevPageCountRef.current = activeMaintenancePages.length;
  }, [loading, hasAnyMaintenance, activeMaintenancePages.length]);

  useEffect(() => {
    if (!recoveredInfo) return;
    const timer = setTimeout(() => setRecoveredInfo(null), 6000);
    return () => clearTimeout(timer);
  }, [recoveredInfo]);

  const dismissNotice = useCallback(() => {
    if (!statusSignature) return;
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, statusSignature);
    } catch {
      // Abaikan error storage
    }
    setDismissedSignature(statusSignature);
  }, [statusSignature]);

  const dismissRecovered = useCallback(() => {
    setRecoveredInfo(null);
  }, []);

  const checkMaintenanceNow = useCallback(async () => {
    setIsChecking(true);
    try {
      await refreshMaintenance();
    } finally {
      setIsChecking(false);
    }
  }, [refreshMaintenance]);

  const shouldShowNotification = Boolean(
    hasAnyMaintenance &&
      !isBypassPath &&
      !isCurrentScreenBlocked &&
      statusSignature !== dismissedSignature
  );

  return {
    loading,
    isChecking,
    config,
    syncSource,
    realtimeStatus,
    lastSyncedAt,
    isGlobalMaintenance: Boolean(config?.globalEnabled),
    activeMaintenancePages,
    liveChatMaintenance: Boolean(liveChatMaintenance),
    helpButtonMaintenance: Boolean(config?.helpButtonMaintenance),
    hasAnyMaintenance,
    shouldShowNotification,
    recoveredInfo,
    currentResolution,
    dismissNotice,
    dismissRecovered,
    checkMaintenanceNow,
  };
}
