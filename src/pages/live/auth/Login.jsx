import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabaseClient';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Login with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      if (authError) {
        throw new Error('Email atau password salah');
      }

      // Ambil user profil dari tabel public.users
      const { data: users, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email.toLowerCase());

      if (dbError || !users || users.length === 0) {
        throw new Error('Data profil belum lengkap di server. Silakan coba sebentar lagi.');
      }

      const user = users[0];

      if (user) {
        const userStatus = user.status?.toLowerCase();
        if (userStatus !== 'aktif' && userStatus !== 'active') {
          await supabase.auth.signOut(); // force logout
          throw new Error('Akun Anda tidak aktif. Hubungi administrator.');
        }

        // Deteksi role otomatis dari database
        const userRole = user.role?.toUpperCase() || 'USER';
        const roleConfig = {
          'SUPER_ADMIN': { level: 6, name: 'Super Admin', badge: '👑', color: 'from-purple-600 to-pink-600' },
          'ADMIN': { level: 5, name: 'Admin', badge: '🛡️', color: 'from-red-500 to-orange-500' },
          'MODERATOR': { level: 4, name: 'Moderator', badge: '⭐', color: 'from-blue-500 to-cyan-500' },
          'PREMIUM': { level: 3, name: 'Premium', badge: '💎', color: 'from-green-500 to-emerald-500' },
          'VERIFIED': { level: 2, name: 'Verified', badge: '✅', color: 'from-yellow-500 to-amber-500' },
          'USER': { level: 1, name: 'User', badge: '👤', color: 'from-gray-500 to-gray-700' }
        };

        const config = roleConfig[userRole] || roleConfig.USER;

        setMessage({
          type: 'success',
          text: `Login berhasil! Selamat datang ${config.name}. Mengarahkan...`
        });

        // Simpan session dengan informasi role lengkap
        const localUser = {
          id: authData.user.id,
          username: user.nama || formData.email.split('@')[0],
          email: user.email,
          role: userRole,
          roleName: config.name,
          roleLevel: config.level,
          roleBadge: config.badge,
          roleColor: config.color,
          messageCount: parseInt(user.message_count) || 0,
          lastReset: user.last_reset || new Date().toISOString().split('T')[0],
          joinDate: user.tanggal_daftar || new Date().toISOString(),
          loginTime: new Date().toISOString()
        };

        // Simpan ke localStorage
        localStorage.setItem('local_user', JSON.stringify(localUser));

        // Jika remember me dicentang, simpan email
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect berdasarkan role
        if (['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(userRole)) {
          navigate('/Live-Discussion/dashboard');
        } else {
          navigate('/Live-Discussion');
        }

      } else {
        throw new Error('Profil pengguna tidak ditemukan');
      }

    } catch (error) {
      console.error('Login error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Koneksi gagal. Periksa koneksi internet Anda.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Immersive Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, -60, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
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
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight italic uppercase">DENTITAS LIVE</h1>
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
              <label className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Secure Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.email ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Access Protocol</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.password ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/20 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              <a href="#" className="text-[10px] font-bold text-cyan-400/50 hover:text-cyan-400 uppercase tracking-widest transition-colors">Forgot Hash?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
              whileTap={{ scale: 0.98 }}
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
                <a
                  href="/Live-Discussion/daftar"
                  className="text-cyan-400 hover:text-white font-black transition-colors ml-1"
                >
                  Create Identity
                </a>
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