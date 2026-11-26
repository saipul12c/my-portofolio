import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { MaintenanceContext } from './maintenanceContextObject';
import {
  DEFAULT_MAINTENANCE_CONFIG,
  LIVE_MAINTENANCE_KEY,
  SITE_MAINTENANCE_KEY,
  fetchMaintenanceState,
  normalizeMaintenanceConfig,
  readCachedMaintenanceState,
  writeCachedMaintenanceState,
} from '../services/maintenanceService';
import { MAINTENANCE_PAGE_CATALOG } from '../config/maintenanceRoutes';
import { setMaintenanceStatusData } from '../utils/ai/knowledgeBase';

export function MaintenanceProvider({ children }) {
  const initialCache = useRef(readCachedMaintenanceState());
  const [config, setConfig] = useState(initialCache.current.config);
  const [liveChatMaintenance, setLiveChatMaintenance] = useState(initialCache.current.liveChatMaintenance);
  const [loading, setLoading] = useState(true);
  const [syncSource, setSyncSource] = useState('cache');
  const [realtimeStatus, setRealtimeStatus] = useState('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const configRef = useRef(config);
  const liveRef = useRef(liveChatMaintenance);

  useEffect(() => {
    configRef.current = config;
    const overrides = config?.pageOverrides || {};
    const activePages = [
      ...MAINTENANCE_PAGE_CATALOG.filter((p) => overrides[p.key] === true).map((p) => ({
        key: p.key,
        label: p.label,
        badge: config?.pageConfigs?.[p.key]?.badge || p.defaultMaintenance?.badge || 'Dalam Perawatan',
      })),
      ...(Array.isArray(config?.customPaths) ? config.customPaths : [])
        .filter((p) => overrides[p] === true)
        .map((p) => ({
          key: p,
          label: p,
          badge: config?.pageConfigs?.[p]?.badge || 'Dalam Perawatan',
        })),
    ];
    const isUnderMaintenance = Boolean(
      config?.globalEnabled || activePages.length > 0 || liveChatMaintenance || config?.helpButtonMaintenance
    );
    setMaintenanceStatusData({
      isUnderMaintenance,
      globalEnabled: Boolean(config?.globalEnabled),
      activePages,
      liveChatMaintenance: Boolean(liveChatMaintenance),
      helpButtonMaintenance: Boolean(config?.helpButtonMaintenance),
      title: config?.title || '',
      description: config?.description || '',
      targetTime: config?.targetTime || '',
    });
  }, [config, liveChatMaintenance]);

  useEffect(() => {
    liveRef.current = liveChatMaintenance;
  }, [liveChatMaintenance]);

  const refreshMaintenance = useCallback(async () => {
    const result = await fetchMaintenanceState();
    setConfig(result.config);
    setLiveChatMaintenance(result.liveChatMaintenance);
    setSyncSource(result.source);
    setLastSyncedAt(new Date().toISOString());
    setLoading(false);
    return result;
  }, []);

  useEffect(() => {
    refreshMaintenance();

    // Sinkronisasi via custom event di tab yang sama
    const handleLocalUpdate = (event) => {
      const detail = event?.detail;
      if (detail?.config) {
        const nextCfg = normalizeMaintenanceConfig(detail.config);
        setConfig(nextCfg);
        writeCachedMaintenanceState(nextCfg, liveRef.current);
      }
      if (typeof detail?.liveChatMaintenance === 'boolean') {
        setLiveChatMaintenance(detail.liveChatMaintenance);
        writeCachedMaintenanceState(configRef.current, detail.liveChatMaintenance);
      }
      setLastSyncedAt(new Date().toISOString());
    };

    // Sinkronisasi lintas tab lewat localStorage event
    const handleStorage = (event) => {
      if (event.key === 'saipul_site_maintenance_cache_v1' && event.newValue) {
        const next = readCachedMaintenanceState();
        setConfig(next.config);
        setLiveChatMaintenance(next.liveChatMaintenance);
      }
    };

    // Refresh saat tab kembali aktif
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshMaintenance();
      }
    };

    window.addEventListener('saipul_maintenance_updated', handleLocalUpdate);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    // Fallback polling setiap 60 detik bila Realtime belum diaktifkan pada public.system_config
    const pollTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshMaintenance();
      }
    }, 60000);

    let channel = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public:system_config:maintenance')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'system_config' },
          (payload) => {
            const row = payload?.new || payload?.old;
            if (!row?.key) return;

            if (row.key === SITE_MAINTENANCE_KEY) {
              const nextCfg =
                payload.eventType === 'DELETE'
                  ? DEFAULT_MAINTENANCE_CONFIG
                  : normalizeMaintenanceConfig(row.value);
              setConfig(nextCfg);
              setSyncSource('supabase');
              setLastSyncedAt(new Date().toISOString());
              writeCachedMaintenanceState(nextCfg, liveRef.current);
            }

            if (row.key === LIVE_MAINTENANCE_KEY) {
              const nextLive = payload.eventType === 'DELETE' ? false : Boolean(row.value);
              setLiveChatMaintenance(nextLive);
              setSyncSource('supabase');
              setLastSyncedAt(new Date().toISOString());
              writeCachedMaintenanceState(configRef.current, nextLive);
            }
          }
        )
        .subscribe((status) => {
          setRealtimeStatus(status);
        });
    }

    return () => {
      window.removeEventListener('saipul_maintenance_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollTimer);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [refreshMaintenance]);

  return (
    <MaintenanceContext.Provider
      value={{
        config,
        liveChatMaintenance,
        loading,
        syncSource,
        realtimeStatus,
        lastSyncedAt,
        refreshMaintenance,
        isPreviewMode,
        setPreviewMode: setIsPreviewMode,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}
