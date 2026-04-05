import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
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
      // Tambahkan .trim() untuk mencegah spasi tersembunyi yang menyebabkan "invalid email"
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanNama = formData.nama.trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            nama: cleanNama
          }
        }
      });

      if (error) {
        console.error('Supabase Auth Error:', error);
        
        // Deteksi error domain invalid (Status 400)
        if (error.status === 400 || error.message.toLowerCase().includes('invalid')) {
          throw new Error('Email tidak diterima. Gunakan email lain (seperti @gmail.com) atau matikan "Confirm Email" di dashboard Supabase jika Anda sedang testing.');
        }

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

        navigate('/Live-Discussion/login');
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
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 my-4"
      >
        <div className="group bg-white/[0.01] backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-8 border border-white/5 transition-all duration-500 hover:border-cyan-500/20">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight italic uppercase">BUAT IDENTITAS</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Mulai Sinkronisasi Sinyal</p>
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
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className="text-[11px] font-bold tracking-tight">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Full Name</label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-2.5 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.nama ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="Nama Lengkap"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Network Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-2.5 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.email ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Cipher Key</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordReqs(true)}
                  className={`w-full pl-12 pr-12 py-2.5 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.password ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
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
              <AnimatePresence>
                {showPasswordReqs && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 bg-white/[0.02] rounded-xl p-2.5 border border-white/5 grid grid-cols-2 gap-x-4 gap-y-1"
                  >
                    {[
                      { label: '8+ Char', met: formData.password.length >= 8 },
                      { label: 'Lowercase', met: /[a-z]/.test(formData.password) },
                      { label: 'Uppercase', met: /[A-Z]/.test(formData.password) },
                      { label: 'Numbers', met: /\d/.test(formData.password) }
                    ].map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 leading-none">
                        <div className={`w-1 h-1 rounded-full ${req.met ? 'bg-cyan-400' : 'bg-white/10'}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${req.met ? 'text-cyan-300' : 'text-white/20'}`}>{req.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1 pb-2">
              <label className="text-[9px] font-black tracking-widest text-white/30 uppercase ml-1">Confirm Cipher</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="konfirmasiPassword"
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-2.5 bg-white/[0.03] border rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 outline-none text-white text-sm placeholder-white/10 transition-all duration-300 backdrop-blur-md ${errors.konfirmasiPassword ? 'border-red-400/50 bg-red-400/5' : 'border-white/5 hover:border-white/10'}`}
                  placeholder="Repeat Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/20 hover:text-cyan-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                  Registering...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 relative z-10 italic">
                  Generate Signal
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </motion.button>

            <div className="text-center pt-6 border-t border-white/5 mt-2">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Encoded?{' '}
                <a
                  href="/Live-Discussion/login"
                  className="text-cyan-400 hover:text-white font-black transition-colors ml-1"
                >
                  Access Module
                </a>
              </p>
            </div>
          </form>

          <footer className="mt-8 text-[8px] font-black text-white/10 text-center uppercase tracking-[0.3em] space-y-1">
            <p>By generating identity, you accept protocol terms</p>
            <p>© {new Date().getFullYear()} Live Discussion • End-to-End Encrypted Tunnel</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Daftar;