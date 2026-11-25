import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession } from './services/blogAdminAuth';

/**
 * 🛡️ BlogAdminProtectedRoute
 * Memastikan hanya admin yang memiliki sesi valid yang bisa mengakses Blog Dashboard.
 * Jika belum login, dialihkan ke halaman login rahasia blog (/blog-admin/login).
 */
export default function BlogAdminProtectedRoute({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const session = getAdminSession();
    setIsAuth(Boolean(session));
    setChecking(false);
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-sm tracking-wider font-mono text-gray-400">Memverifikasi Otorisasi Blog Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/blog-admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
