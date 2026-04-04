import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
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
        setTimeout(() => {
          if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
            navigate('/Live-Discussion/dashboard');
          } else {
            navigate('/Live-Discussion');
          }
        }, 1500);

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
    <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-8 border border-white/10 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-white/20">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Selamat Datang</h1>
            <p className="text-sm sm:text-base text-blue-200">Silakan masuk ke akun Anda</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm ${message.type === 'success'
              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
              : message.type === 'error'
                ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
              }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none text-white placeholder-blue-300/50 transition-all backdrop-blur-sm ${errors.email ? 'border-red-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  placeholder="contoh@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none text-white placeholder-blue-300/50 transition-all backdrop-blur-sm ${errors.password ? 'border-red-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border-white/30 text-blue-500 focus:ring-blue-400"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-white">
                Ingat email saya
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all transform active:scale-[0.98] ${loading
                ? 'bg-cyan-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Masuk
                </span>
              )}
            </button>

            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-blue-200">
                Belum punya akun?{' '}
                <a
                  href="/Live-Discussion/daftar"
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-all hover:underline"
                >
                  Daftar di sini
                </a>
              </p>
            </div>
          </form>

          <div className="mt-8 text-xs text-blue-300 text-center">
            <p>© {new Date().getFullYear()} Live Discussion System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;