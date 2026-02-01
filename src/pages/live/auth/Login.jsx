import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from 'lucide-react';

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

  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL_AKUN;

  if (!SHEETDB_URL) {
    console.error('URL SheetDB tidak ditemukan di environment variables');
  }

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
      // Hash password dengan SHA-256 untuk pencocokan
      const encoder = new TextEncoder();
      const data = encoder.encode(formData.password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const inputPasswordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Ambil user berdasarkan email dari SheetDB
      const response = await fetch(`${SHEETDB_URL}/search?email=${encodeURIComponent(formData.email.toLowerCase())}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }

      const users = await response.json();
      
      // Cari user dengan password yang cocok
      const user = users.length > 0 && users[0].password === inputPasswordHash ? users[0] : null;

      if (user) {
        const userStatus = user.status?.toLowerCase();
        if (userStatus !== 'aktif' && userStatus !== 'active') {
          throw new Error('Akun Anda tidak aktif. Hubungi administrator.');
        }

        setMessage({
          type: 'success',
          text: 'Login berhasil! Mengarahkan ke dashboard...'
        });

        // Simpan session yang digunakan oleh Live chat (sheetdb_user)
        const sheetdbUser = {
          id: user.id || user.email,
          username: user.nama || user.username || formData.email.split('@')[0],
          email: user.email,
          tanggal_daftar: user.tanggal_daftar || new Date().toISOString(),
          loginTime: new Date().toISOString()
        };

        // Simpan ke localStorage dengan key yang dipakai oleh Live.jsx
        localStorage.setItem('sheetdb_user', JSON.stringify(sheetdbUser));

        // Jika remember me dicentang, simpan email
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect ke dashboard setelah 1.5 detik
        setTimeout(() => {
          navigate('/Live-Discussion');
        }, 1500);

      } else {
        throw new Error('Email atau password salah');
      }

    } catch (error) {
      console.error('Login error:', error);
      setMessage({
        type: 'error',
        text: error.message === 'Failed to fetch' 
          ? 'Koneksi gagal. Periksa koneksi internet Anda.' 
          : error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setMessage({
      type: 'info',
      text: 'Fitur reset password akan dikirim ke email Anda (jika terdaftar).'
    });
    // Implementasi reset password bisa ditambahkan di sini
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang</h1>
            <p className="text-blue-200">Silakan masuk ke akun Anda</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                : message.type === 'error'
                ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
            }`}>
              {message.type === 'success' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
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
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white placeholder-blue-300 transition-all backdrop-blur-sm ${
                    errors.email ? 'border-red-400' : 'border-white/30'
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
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-300 hover:text-white transition-colors"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-white placeholder-blue-300 transition-all backdrop-blur-sm ${
                    errors.password ? 'border-red-400' : 'border-white/30'
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
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
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
                  className="text-white hover:text-blue-300 font-semibold transition-colors"
                >
                  Daftar di sini
                </a>
              </p>
            </div>
          </form>

          <div className="mt-8 text-xs text-blue-300 text-center">
            <p>© {new Date().getFullYear()} Aplikasi Anda. Semua hak dilindungi.</p>
            <p className="mt-2">Login Anda aman dengan enkripsi SHA-256.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;