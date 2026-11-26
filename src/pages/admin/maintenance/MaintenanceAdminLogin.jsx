import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Database,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient';
import { verifyMaintenanceAdminAccess } from '../../../services/maintenanceService';
import { MAINTENANCE_ADMIN_DASHBOARD_PATH } from '../../../config/maintenanceRoutes';

const ATTEMPTS_KEY = 'saipul_m_gate_attempts';
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 1000;

function readRateLimit() {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, isLocked: false, remainingSeconds: 0 };
    const parsed = JSON.parse(raw);
    if (parsed?.lockUntil && Date.now() < parsed.lockUntil) {
      return {
        count: parsed.count || MAX_FAILED_ATTEMPTS,
        isLocked: true,
        remainingSeconds: Math.ceil((parsed.lockUntil - Date.now()) / 1000),
      };
    }
    if (parsed?.lockUntil && Date.now() >= parsed.lockUntil) {
      localStorage.removeItem(ATTEMPTS_KEY);
      return { count: 0, isLocked: false, remainingSeconds: 0 };
    }
    return { count: parsed?.count || 0, isLocked: false, remainingSeconds: 0 };
  } catch {
    return { count: 0, isLocked: false, remainingSeconds: 0 };
  }
}

function recordFailedAttempt() {
  const current = readRateLimit();
  const nextCount = current.count + 1;
  const payload = {
    count: nextCount,
    lockUntil: nextCount >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCK_DURATION_MS : null,
  };
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(payload));
  } catch {
    // Abaikan error storage
  }
  return readRateLimit();
}

function clearFailedAttempts() {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    // Abaikan error storage
  }
}

export default function MaintenanceAdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || MAINTENANCE_ADMIN_DASHBOARD_PATH;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState(readRateLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setRateLimit(readRateLimit());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkExisting = async () => {
      const access = await verifyMaintenanceAdminAccess();
      if (!mounted) return;
      if (access.authorized) {
        navigate(from, { replace: true });
        return;
      }
      setCheckingSession(false);
    };
    checkExisting();
    return () => {
      mounted = false;
    };
  }, [from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const limitState = readRateLimit();
    setRateLimit(limitState);
    if (limitState.isLocked) {
      setError(`Terlalu banyak percobaan gagal. Tunggu ${limitState.remainingSeconds} detik lagi.`);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError('Konfigurasi Supabase belum aktif di environment (.env).');
      return;
    }

    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInErr) {
        throw new Error(signInErr.message || 'Email atau password salah.');
      }

      if (!data?.user) {
        throw new Error('Gagal memverifikasi akun Supabase.');
      }

      const access = await verifyMaintenanceAdminAccess();
      if (!access.authorized) {
        await supabase.auth.signOut().catch(() => {});
        throw new Error(
          access.reason || 'Akun ini tidak memiliki role ADMIN atau SUPER_ADMIN.'
        );
      }

      clearFailedAttempts();
      navigate(from, { replace: true });
    } catch (err) {
      const updatedLimit = recordFailedAttempt();
      setRateLimit(updatedLimit);
      const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - updatedLimit.count);
      const baseMsg = err?.message || 'Gagal masuk ke Dashboard Maintenance.';
      setError(
        updatedLimit.isLocked
          ? `Akses dikunci sementara (${updatedLimit.remainingSeconds}s) karena ${MAX_FAILED_ATTEMPTS}x percobaan gagal.`
          : `${baseMsg} (Sisa percobaan: ${remaining}x)`
      );
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <Helmet>
          <title>Akses Terbatas</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="flex flex-col items-center gap-3 text-teal-300">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-mono text-gray-400">Memeriksa otorisasi internal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <Helmet>
        <title>Internal Gate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-teal-300 transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Situs
          </Link>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/25">
            <Database className="w-3.5 h-3.5" />
            Private RLS Gate
          </span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-teal-950/40">
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-400/30 flex items-center justify-center shadow-lg">
              <Wrench className="w-7 h-7 text-teal-300" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-teal-100 to-cyan-300 bg-clip-text text-transparent">
              Maintenance Control Hub
            </h1>
            <p className="text-xs text-gray-400 mt-1.5">
              Portal internal tersembunyi — khusus akun ADMIN & SUPER_ADMIN
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  autoComplete="email"
                  disabled={rateLimit.isLocked}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={rateLimit.isLocked}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || rateLimit.isLocked}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : rateLimit.isLocked ? (
                <span>Terkunci ({rateLimit.remainingSeconds}s)</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk ke Console Maintenance</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-[11px] text-gray-400 space-y-1.5">
            <p>• Verifikasi server Supabase Auth + RLS role wajib terpenuhi.</p>
            <p>• Halaman ini diproteksi rate-limit dan diblokir dari mesin pencari (`noindex`).</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
