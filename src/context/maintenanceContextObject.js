import { createContext } from 'react';
import { DEFAULT_MAINTENANCE_CONFIG } from '../services/maintenanceService';

export const MaintenanceContext = createContext({
  config: DEFAULT_MAINTENANCE_CONFIG,
  liveChatMaintenance: false,
  loading: false,
  syncSource: 'default',
  realtimeStatus: 'idle',
  lastSyncedAt: null,
  refreshMaintenance: async () => {},
  setPreviewMode: () => {},
  isPreviewMode: false,
});
