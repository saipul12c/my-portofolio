import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

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

  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL_AKUN;

  if (!SHEETDB_URL) {
    console.error('URL SheetDB tidak ditemukan di environment variables');
  }

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
    // Clear error when user starts typing
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
      // Hash password menggunakan SHA-256 sebelum dikirim
      const encoder = new TextEncoder();
      const data = encoder.encode(formData.password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Siapkan data untuk dikirim ke SheetDB
      const dataToSend = {
        data: [{
          nama: formData.nama,
          email: formData.email.toLowerCase(),
          password: passwordHash,
          tanggal_daftar: new Date().toISOString().split('T')[0],
          status: 'aktif'
        }]
      };

      const response = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server');
      }

      const result = await response.json();
      
      // SheetDB returns either created count or success response
      if (result.created === 1 || result.success) {
        setMessage({
          type: 'success',
          text: 'Pendaftaran berhasil! Mengarahkan ke login.'
        });
        setFormData({
          nama: '',
          email: '',
          password: '',
          konfirmasiPassword: ''
        });
        // Simpan email yang baru terdaftar agar mudah login (opsional)
        localStorage.setItem('rememberedEmail', formData.email);

        // Redirect ke login setelah 2 detik menggunakan navigate
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
        text: error.message === 'Failed to fetch' 
          ? 'Koneksi gagal. Periksa koneksi internet Anda.' 
          : 'Email sudah terdaftar atau terjadi kesalahan.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar Akun</h1>
            <p className="text-gray-600">Bergabung dengan komunitas kami</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.nama ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              {errors.nama && (
                <p className="mt-2 text-sm text-red-600">{errors.nama}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contoh@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>Password harus mengandung:</p>
                <ul className="list-disc list-inside ml-2">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                    Minimal 8 karakter
                  </li>
                  <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}>
                    Huruf kecil
                  </li>
                  <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}>
                    Huruf besar
                  </li>
                  <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}>
                    Angka
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="konfirmasiPassword"
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.konfirmasiPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.konfirmasiPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.konfirmasiPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
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

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <a
                  href="/Live-Discussion/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Masuk di sini
                </a>
              </p>
            </div>
          </form>

          <div className="mt-8 text-xs text-gray-500 text-center">
            <p>Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.</p>
            <p className="mt-2">Password Anda di-hash dengan SHA-256 sebelum disimpan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daftar;