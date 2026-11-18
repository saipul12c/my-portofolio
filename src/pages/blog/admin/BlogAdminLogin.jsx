import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  AlertCircle, 
  Info,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { loginAdmin, isAdminAuthenticated, getRateLimitStatus, getAdminCredentials } from './services/blogAdminAuth';

export default function BlogAdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode login: 'credentials' (Username/Password) atau 'pin' (Secret PIN)
  const [loginMode, setLoginMode] = useState('credentials');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [rateLimit, setRateLimit] = useState({ isLocked: false, remainingSeconds: 0 });

  const from = location.state?.from || '/blog-admin/dashboard';

  // Jika sudah terautentikasi, langsung arahkan ke dashboard
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/blog-admin/dashboard', { replace: true });
    }
  }, [navigate]);

  // Cek rate limiting setiap detik jika terkunci
  useEffect(() => {
    const checkRate = () => {
      const status = getRateLimitStatus();
      setRateLimit(status);
    };
    checkRate();
    const interval = setInterval(checkRate, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (loginMode === 'pin') {
        if (!pin.trim()) throw new Error('Harap masukkan PIN Keamanan Rahasia.');
        await loginAdmin({ pin: pin.trim(), rememberMe });
      } else {
        if (!identifier.trim() || !password) throw new Error('Username/Email dan Password wajib diisi.');
        await loginAdmin({ identifier: identifier.trim(), password, rememberMe });
      }

      // Berhasil login!
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal masuk ke sistem.');
      setIsSubmitting(false);
    }
  };

  const defaultCreds = getAdminCredentials();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 🌌 Background Glow & Grid Ornaments */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Tombol Kembali ke Blog Publik */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-cyan-400 transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Blog Publik
          </Link>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Hidden Admin Route
          </span>
        </div>

        {/* Kotak Utama Login */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-cyan-950/50">
          
          {/* Header Identitas Sistem */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 group">
              <BookOpen className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Blog Control Hub
            </h1>
            <p className="text-xs text-gray-400 mt-1.5">
              Portal Manajemen & Pengelolaan Data Konten Khusus Blog
            </p>
          </div>

          {/* Toggle Tab Mode Login (Password vs Secret PIN) */}
          <div className="flex p-1 mb-6 rounded-xl bg-slate-950/70 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => { setLoginMode('credentials'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loginMode === 'credentials'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Username & Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('pin'); setError(null); }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loginMode === 'pin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Secret PIN
            </button>
          </div>

          {/* Alert Error / Lockout */}
          <AnimatePresence>
            {rateLimit.isLocked && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Terlalu banyak percobaan. Akses dikunci sementara: <strong>{rateLimit.remainingSeconds}s</strong></span>
              </motion.div>
            )}

            {error && !rateLimit.isLocked && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMode === 'credentials' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                    <span>Username atau Email</span>
                    <span className="text-[10px] text-gray-500 font-mono">admin@blog.id</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Username atau email"
                      required
                      autoFocus
                      disabled={rateLimit.isLocked || isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Password Khusus
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={rateLimit.isLocked || isSubmitting}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Secret Security PIN</span>
                  <span className="text-[10px] text-gray-500 font-mono">Kode Rahasia</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan 4 Digit PIN Rahasia"
                    maxLength={10}
                    required
                    autoFocus
                    disabled={rateLimit.isLocked || isSubmitting}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 text-sm font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Simpan sesi (14 hari)</span>
              </label>

              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Petunjuk Akses</span>
              </button>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={rateLimit.isLocked || isSubmitting}
              className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memvalidasi Kredensial...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buka Dashboard Blog</span>
                </>
              )}
            </button>
          </form>

          {/* Modal Petunjuk Akses / Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2 text-gray-300"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <Terminal className="w-4 h-4" />
                  <span>Kredensial Default Super Admin:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-gray-500 block">Username:</span>
                    <strong className="text-cyan-300">{defaultCreds.username}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Password:</span>
                    <strong className="text-cyan-300">{defaultCreds.password}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email:</span>
                    <strong className="text-cyan-300">{defaultCreds.email}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">PIN Cepat:</span>
                    <strong className="text-cyan-300">{defaultCreds.pin}</strong>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 pt-1">
                  * Kredensial ini dapat diubah kapan saja di tab <strong>Pengaturan</strong> pada Blog Dashboard.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer rahasia */}
        <div className="text-center mt-6 text-xs text-gray-500 flex items-center justify-center gap-2">
          <span>Khusus Administrator Blog</span>
          <span>•</span>
          <span>Terisolasi & Mandiri</span>
        </div>
      </motion.div>
    </div>
  );
}
