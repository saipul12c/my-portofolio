import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
const Daftar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    konfirmasiPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    } else if (formData.nama.length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar, kecil, dan angka';
    }

    if (formData.password !== formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword = 'Password tidak cocok';
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.toLowerCase(),
        password: formData.password,
        options: {
          data: {
            nama: formData.nama
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Email sudah terdaftar');
        }
        throw new Error(error.message);
      }

      if (data.user) {
        setMessage({
          type: 'success',
          text: 'Pendaftaran berhasil! Cek email untuk verifikasi atau silakan login.'
        });
        setFormData({
          nama: '',
          email: '',
          password: '',
          konfirmasiPassword: ''
        });

        localStorage.setItem('rememberedEmail', formData.email);

        setTimeout(() => {
          navigate('/Live-Discussion/login');
        }, 2000);
      } else {
        throw new Error('Gagal membuat akun');
      }
    } catch (error) {
      console.error('Error:', error);
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
      <div className="absolute bottom-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 my-8 py-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-8 border border-white/10 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-white/20">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Daftar Akun</h1>
            <p className="text-sm sm:text-base text-blue-200">Bergabung dengan komunitas kami</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm ${message.type === 'success'
              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
              : 'bg-red-500/20 text-red-200 border border-red-500/30'
              }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none text-white placeholder-blue-300/50 transition-all backdrop-blur-sm ${errors.nama ? 'border-red-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              {errors.nama && (
                <p className="mt-2 text-sm text-red-300">{errors.nama}</p>
              )}
            </div>

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
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none text-white placeholder-blue-300/50 transition-all backdrop-blur-sm ${errors.password ? 'border-red-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  placeholder="Minimal 8 karakter"
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
              <div className="mt-2 text-xs text-blue-200/80 space-y-1">
                <p>Password harus mengandung:</p>
                <ul className="list-disc list-inside ml-2">
                  <li className={formData.password.length >= 8 ? 'text-green-400' : ''}>
                    Minimal 8 karakter
                  </li>
                  <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : ''}>
                    Huruf kecil
                  </li>
                  <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : ''}>
                    Huruf besar
                  </li>
                  <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-400' : ''}>
                    Angka
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="konfirmasiPassword"
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3.5 bg-white/5 border rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none text-white placeholder-blue-300/50 transition-all backdrop-blur-sm ${errors.konfirmasiPassword ? 'border-red-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.konfirmasiPassword && (
                <p className="mt-2 text-sm text-red-300">{errors.konfirmasiPassword}</p>
              )}
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
                  Mendaftarkan...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>

            <div className="text-center pt-8 border-t border-white/20">
              <p className="text-blue-200">
                Sudah punya akun?{' '}
                <a
                  href="/Live-Discussion/login"
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-all hover:underline"
                >
                  Masuk di sini
                </a>
              </p>
            </div>
          </form>

          <div className="mt-8 text-xs text-blue-300 text-center">
            <p>Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.</p>
            <p className="mt-2">Password Anda di-hash dengan SHA-256 sebelum disimpan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daftar;