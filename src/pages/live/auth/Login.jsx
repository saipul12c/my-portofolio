import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-redirect jika pengguna sudah memiliki sesi login aktif yang sah (Standar Modern Supabase: getUser & onAuthStateChange)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let isMounted = true;

    const checkActiveSession = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const isExplicitLogout = searchParams.get('logout') === 'true';

        // Jika navigasi berasal dari logout, bersihkan sesi secara tuntas
        if (isExplicitLogout) {
          try {
            await supabase.auth.signOut();
          } catch { /* ignore */ }
          localStorage.removeItem('local_user');
          return;
        }

        // Gunakan getUser() (Standar Baru Supabase) untuk memverifikasi token ke server auth, bukan sekadar cache lokal getSession()
        const authRes = await supabase.auth.getUser().catch(() => null);
        const authUser = authRes?.data?.user;
        if (!authUser) return;

        const localUserRaw = localStorage.getItem('local_user');

        // Jika local_user kosong tetapi session ada (gejala logout tidak lengkap dari tab/komponen lain),
        // lakukan sign out agar user tidak terjebak dalam siklus redirect loop
        if (!localUserRaw) {
          try {
            await supabase.auth.signOut();
          } catch { /* ignore */ }
          return;
        }

        // Ambil profil terkini dari database untuk memverifikasi role dan status secara akurat (Anti-Spoofing & Anti-Banned)
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, role, status')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!isMounted) return;

        // Jika status akun dinonaktifkan atau dibanned, putuskan sesi segera
        if (dbUser?.status === 'banned' || dbUser?.status === 'nonaktif') {
          await supabase.auth.signOut();
          localStorage.removeItem('local_user');
          setMessage({
            type: 'error',
            text: 'Akun Anda dinonaktifkan atau diblokir. Hubungi administrator.'
          });
          return;
        }

        let verifiedRole = dbUser?.role;
        if (!verifiedRole && localUserRaw) {
          try {
            verifiedRole = JSON.parse(localUserRaw)?.role;
          } catch { /* ignore */ }
        }
        verifiedRole = (verifiedRole || authUser.app_metadata?.role || 'USER').toUpperCase();

        if (['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(verifiedRole)) {
          navigate('/Live-Discussion/dashboard', { replace: true });
        } else {
          navigate('/Live-Discussion', { replace: true });
        }
      } catch (err) {
        console.warn('Session check failed', err);
      }
    };

    checkActiveSession();

    // Listener realtime perubahan status auth (Standar Baru Supabase)
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('local_user');
      }
    });

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [navigate, location.search]);

  // Cek jika ada data login yang diingat
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const cleanEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(cleanEmail)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setMessage({ type: 'error', text: newErrors.email || newErrors.password });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hapus pesan error field saat user mengetik
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isSupabaseConfigured) {
      setMessage({
        type: 'error',
        text: 'Konfigurasi database Supabase belum terpasang atau tidak aktif.'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      // 1. Auth Login Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password
      });

      if (authError) {
        console.error('Supabase Auth signIn error:', authError);
        const errLower = authError.message?.toLowerCase() || '';

        if (errLower.includes('email not confirmed')) {
          throw new Error('Email belum diverifikasi! Silakan periksa inbox/spam email Anda untuk konfirmasi, atau nonaktifkan "Confirm email" di Dashboard Supabase jika sedang tahap testing.');
        } else if (errLower.includes('invalid login credentials') || errLower.includes('invalid credentials')) {
          throw new Error('Email atau password salah. Pastikan akun sudah terdaftar dan kredensial sudah sesuai.');
        } else if (errLower.includes('too many requests') || errLower.includes('rate limit')) {
          throw new Error('Terlalu banyak percobaan gagal. Mohon tunggu beberapa saat sebelum mencoba kembali.');
        } else {
          throw new Error(authError.message || 'Koneksi gagal. Periksa koneksi internet Anda.');
        }
      }

      if (!authData?.user) {
        throw new Error('Gagal mendapatkan data sesi pengguna.');
      }

      // 2. Profile Fetch with Retry
      let user = null;
      let retries = 3;

      while (retries > 0 && !user) {
        const { data: userData, error: userFetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (userData) {
          user = userData;
        } else if (userFetchError) {
          console.warn('Profile fetch warning:', userFetchError.message);
          retries--;
          if (retries > 0) await new Promise(res => setTimeout(res, 500));
        } else {
          retries--;
          if (retries > 0) await new Promise(res => setTimeout(res, 500));
        }
      }

      // Self-Healing Profile Sync: Hanya gunakan INSERT (bukan upsert paksa) jika row belum terbuat oleh trigger
      if (!user) {
        const fallbackNama = authData.user.user_metadata?.nama || cleanEmail.split('@')[0];
        try {
          const { data: healedUser, error: healError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: cleanEmail,
              nama: fallbackNama,
              role: 'USER',
              status: 'aktif',
              is_shadowbanned: false
            })
            .select()
            .maybeSingle();

          if (!healError && healedUser) {
            user = healedUser;
          } else if (healError) {
            console.warn('Self-healing insert note:', healError.message);
          }
        } catch (healErr) {
          console.warn('Self-healing insert skipped or failed:', healErr);
        }

        if (!user) {
          // Coba fetch ulang jika gagal karena trigger/race condition sudah membuat row
          const { data: retryUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();
          if (retryUser) user = retryUser;
        }
      }

      // 3. Status Check (Proteksi akun nonaktif atau dibanned)
      const userStatus = user?.status?.toLowerCase();
      if (userStatus === 'nonaktif' || userStatus === 'banned') {
        await supabase.auth.signOut();
        localStorage.removeItem('local_user');
        throw new Error('Akun Anda tidak aktif atau diblokir. Hubungi administrator.');
      }

      // 4. Role Config Mapping (Hanya percaya Database dan App Metadata dari server, bukan user_metadata)
      const userRole = (user?.role || authData.user.app_metadata?.role || 'USER').toUpperCase();
      const roleConfig = {
        'SUPER_ADMIN': { level: 10, name: 'Super Admin', badge: '👑', color: 'from-purple-600 to-pink-600' },
        'ADMIN': { level: 8, name: 'Admin', badge: '🛡️', color: 'from-red-500 to-orange-500' },
        'MODERATOR': { level: 5, name: 'Moderator', badge: '⭐', color: 'from-blue-500 to-cyan-500' },
        'PREMIUM': { level: 3, name: 'Premium', badge: '💎', color: 'from-green-500 to-emerald-500' },
        'VERIFIED': { level: 2, name: 'Verified', badge: '✅', color: 'from-yellow-500 to-amber-500' },
        'USER': { level: 1, name: 'User', badge: '👤', color: 'from-gray-500 to-gray-700' }
      };

      const config = roleConfig[userRole] || roleConfig.USER;

      // 5. Save Session Data secara lengkap dan konsisten dengan Live.jsx & dashboard.jsx
      const localUser = {
        id: authData.user.id,
        username: user?.nama || authData.user.user_metadata?.nama || cleanEmail.split('@')[0],
        email: user?.email || authData.user.email,
        role: userRole,
        roleName: config.name,
        roleLevel: config.level,
        roleBadge: config.badge,
        roleColor: config.color,
        messageCount: parseInt(user?.message_count) || 0,
        lastReset: user?.last_reset || new Date().toISOString().split('T')[0],
        joinDate: user?.tanggal_daftar || authData.user.created_at || new Date().toISOString(),
        muteUntil: user?.mute_until || null,
        isShadowbanned: user?.is_shadowbanned || false,
        banReason: user?.ban_reason || null,
        muteReason: user?.mute_reason || null,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('local_user', JSON.stringify(localUser));
      if (rememberMe) localStorage.setItem('rememberedEmail', cleanEmail);
      else localStorage.removeItem('rememberedEmail');

      setMessage({ type: 'success', text: 'Sinyal terhubung! Mengarahkan...' });

      // 6. Redirect dengan replace: true agar tidak terjebak di history back
      redirectTimerRef.current = setTimeout(() => {
        if (['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(userRole)) {
          navigate('/Live-Discussion/dashboard', { replace: true });
        } else {
          navigate('/Live-Discussion', { replace: true });
        }
      }, 500);

    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: error.message || 'Koneksi gagal.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-900)] flex items-center justify-center p-4 sm:p-8 relative overflow-y-auto">
      {/* Immersive Background Orbs - Hardware Accelerated */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-pulse will-change-transform"
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-pulse will-change-transform"
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 my-auto py-6"
      >
        {/* Tombol Navigasi Kembali ke Live Discussion */}
        <div className="mb-4">
          <Link
            to="/Live-Discussion"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 hover:border-cyan-500/20 hover:bg-white/[0.05] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Diskusi
          </Link>
        </div>

        <div className="group bg-white/[0.01] backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-8 border border-white/5 transition-all duration-500 hover:border-cyan-500/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl mb-4 border border-white/5 shadow-inner group-hover:scale-105 transition-transform duration-500"
            >
              <LogIn className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight italic uppercase">IDENTITAS LIVE</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Sinkronisasi Sesi Diskusi</p>
          </div>

          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-4 p-3 rounded-xl flex items-center gap-2 backdrop-blur-md ${message.type === 'success'
                  ? 'bg-green-500/10 text-green-300 border border-green-500/20'
                  : 'bg-red-500/20 text-red-200 border border-red-500/20'
                  }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-tight">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Secure Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  aria-label="Secure Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.email ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-400 ml-1 font-semibold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Access Protocol</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  aria-label="Password Access Protocol"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.password ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/20 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-400 ml-1 font-semibold">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center ml-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-lg bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500/30 transition-all cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 text-[10px] font-bold text-white/30 uppercase tracking-widest cursor-pointer hover:text-white/50 transition-colors">
                  Remember Node
                </label>
              </div>
            </div>

            <motion.button
              whileHover={loading ? {} : { scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
              whileTap={loading ? {} : { scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all border border-cyan-400/20 overflow-hidden relative group ${loading ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 shadow-xl shadow-cyan-500/10'}`}
            >
              <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Syncing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 relative z-10 italic">
                  Initiate Connection
                  <LogIn className="w-4 h-4" />
                </span>
              )}
            </motion.button>

            <div className="text-center pt-6 border-t border-white/5 mt-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                New Signal?{' '}
                <Link
                  to="/Live-Discussion/daftar"
                  className="text-cyan-400 hover:text-white font-black transition-colors ml-1"
                >
                  Create Identity
                </Link>
              </p>
            </div>
          </form>

          <footer className="mt-8 text-[8px] font-black text-white/10 text-center uppercase tracking-[0.3em]">
            <p>© {new Date().getFullYear()} Live Discussion • End-to-End Encrypted Tunnel</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
