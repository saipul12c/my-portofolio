import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { verifyMaintenanceAdminAccess } from '../../../services/maintenanceService';
import { MAINTENANCE_ADMIN_LOGIN_PATH } from '../../../config/maintenanceRoutes';

export default function MaintenanceAdminProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState({ checking: true, authorized: false, adminUser: null });

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      const res = await verifyMaintenanceAdminAccess();
      if (!mounted) return;
      setStatus({
        checking: false,
        authorized: res.authorized,
        adminUser: res.user,
      });
    };
    verify();
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  if (status.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-teal-400">
        <Helmet>
          <title>Akses Terbatas</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
          <p className="text-xs tracking-wider font-mono text-gray-400">
            Memverifikasi Otorisasi Maintenance Admin...
          </p>
        </div>
      </div>
    );
  }

  if (!status.authorized) {
    return (
      <Navigate
        to={MAINTENANCE_ADMIN_LOGIN_PATH}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return React.isValidElement(children)
    ? React.cloneElement(children, { adminUser: status.adminUser })
    : children;
}
