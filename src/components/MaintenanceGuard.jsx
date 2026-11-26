import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Eye, Settings } from 'lucide-react';
import { useMaintenance } from '../context/useMaintenance';
import { useAuth } from '../context/useAuth';
import {
  MAINTENANCE_ADMIN_DASHBOARD_PATH,
  resolveRouteMaintenance,
} from '../config/maintenanceRoutes';
import Maintenance from '../pages/errors/Maintenance';

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

export default function MaintenanceGuard({ children }) {
  const location = useLocation();
  const { config, isPreviewMode, setPreviewMode } = useMaintenance();
  const { user } = useAuth();

  const resolution = useMemo(
    () => resolveRouteMaintenance(location.pathname, config),
    [location.pathname, config]
  );

  const isAdminUser = Boolean(
    user && ADMIN_ROLES.has(String(user.role || '').toUpperCase())
  );
  const canBypassAsAdmin = Boolean(
    resolution.isUnderMaintenance &&
      config?.allowAdminBypass !== false &&
      isAdminUser &&
      !isPreviewMode
  );

  if (resolution.isUnderMaintenance && !canBypassAsAdmin) {
    return (
      <Maintenance
        matchedPage={resolution.matchedPage}
        scope={resolution.scope}
        pageNote={resolution.pageNote}
        pageConfig={resolution.pageConfig}
        isPreview={isPreviewMode}
        onExitPreview={isPreviewMode ? () => setPreviewMode(false) : undefined}
      />
    );
  }

  return (
    <>
      {children}
      {canBypassAsAdmin && (
        <div className="fixed bottom-4 left-4 z-[9990] max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 text-amber-100 rounded-2xl px-4 py-2.5 shadow-2xl shadow-amber-950/40 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Mode Maintenance Aktif</strong>
              {resolution.scope === 'global'
                ? ' (Global)'
                : ` (${resolution.matchedPage?.label || location.pathname})`}
              {' '}— Bypass Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 font-medium transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Pengunjung
            </button>
            <Link
              to={MAINTENANCE_ADMIN_DASHBOARD_PATH}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 font-medium transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
