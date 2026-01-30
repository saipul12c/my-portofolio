import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle caps lock detection
  const handlePasswordKey = (e) => {
    setCapsLock(e.getModifierState?.('CapsLock') || false);
  };

  // Check if account is locked
  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setLoginAttempts(0);
      setError('');
    }
  }, [isLocked, lockTimer]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Akun terkunci. Tunggu ${lockTimer} detik lagi.`);
      return;
    }

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTimer(60); // 60 seconds lock
          setError('Terlalu banyak percobaan gagal. Tunggu 60 detik.');
        } else {
          throw loginError;
        }
        return;
      }

      // Reset attempts on successful login
      setLoginAttempts(0);
      
      // Store remember me in localStorage if checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Verify user profile exists
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || 'User',
            created_at: new Date().toISOString(),
          });
        }
      }

      // Redirect to chat page after successful login
      navigate('/Live-Discussion');
      
    } catch (err) {
      console.error('Error saat login:', err);
      
      // Error messages based on error type
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Silakan cek inbox Anda.');
      } else if (err.status === 429) {
        setError('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.');
      } else if (err.message?.includes('Invalid email')) {
        setError('Format email tidak valid.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail || !/^\S+@\S+\.\S+$/.test(forgotEmail)) {
      setForgotMessage('Masukkan email yang valid');
      return;
    }

    setForgotMessage('');
    setForgotLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/Live-Discussion/reset-password`,
      });

      if (error) throw error;

      setForgotMessage('Tautan reset password telah dikirim ke email Anda. Silakan cek inbox dan folder spam.');
      setTimeout(() => {
        setForgotOpen(false);
        setForgotEmail('');
        setForgotMessage('');
      }, 4000);
      
    } catch (err) {
      console.error('Error saat reset password:', err);
      setForgotMessage('Terjadi kesalahan. Pastikan email yang dimasukkan sudah terdaftar.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/Live-Discussion');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-8 text-center border-b border-white/10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
              Selamat Datang
            </h2>
            <p className="mt-2 text-cyan-300/70 text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-100 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || isLocked}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyUp={handlePasswordKey}
                    onKeyDown={handlePasswordKey}
                    disabled={loading || isLocked}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-300 hover:text-white transition"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.949 9.949 0 01-1.563 3.029m-5.858-.908L15.41 17.41"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {capsLock && (
                  <p className="mt-2 text-xs text-yellow-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Caps Lock aktif
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-400 focus:ring-2"
                    disabled={loading || isLocked}
                  />
                  <span className="ml-2 text-sm text-cyan-300/80 group-hover:text-cyan-300 transition">
                    Ingat saya
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-sm text-cyan-300 hover:text-white transition underline"
                  disabled={loading || isLocked}
                >
                  Lupa password?
                </button>
              </div>

              {/* Login Attempts Warning */}
              {loginAttempts > 0 && !isLocked && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-300 text-sm">
                      Percobaan login gagal: {loginAttempts}/3
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loading || isLocked
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5'
                } text-white flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                    </svg>
                    <span>Masuk...</span>
                  </>
                ) : isLocked ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Terkunci ({lockTimer}s)</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Masuk ke Akun</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-cyan-300/70">Atau lanjutkan dengan</span>
                </div>
              </div>

              {/* Social Login Placeholder */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition transform hover:-translate-y-0.5"
                  onClick={() => alert('Implementasi sedang dikembangkan')}
                  disabled={loading || isLocked}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm text-cyan-100">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition transform hover:-translate-y-0.5"
                  onClick={() => alert('Implementasi sedang dikembangkan')}
                  disabled={loading || isLocked}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm text-cyan-100">GitHub</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-8 py-6 bg-black/20 border-t border-white/10">
            <div className="text-center">
              <p className="text-cyan-300/80 text-sm">
                Belum punya akun?{' '}
                <Link 
                  to="/Live-Discussion/daftar" 
                  className="text-white font-semibold hover:text-cyan-300 transition inline-flex items-center gap-1"
                >
                  Daftar di sini
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => {
                setForgotOpen(false);
                setForgotMessage('');
              }}
            ></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                  Reset Password
                </h3>
                <button
                  onClick={() => {
                    setForgotOpen(false);
                    setForgotMessage('');
                  }}
                  className="text-cyan-300 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-cyan-300/80 text-sm">
                  Masukkan email yang terdaftar. Kami akan mengirim tautan untuk mereset password Anda.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-100 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="email@contoh.com"
                      required
                    />
                  </div>
                </div>
                
                {forgotMessage && (
                  <div className={`p-3 rounded-lg ${
                    forgotMessage.includes('kesalahan') || forgotMessage.includes('Pastikan')
                      ? 'bg-red-500/10 border border-red-500/30' 
                      : 'bg-green-500/10 border border-green-500/30'
                  }`}>
                    <div className="flex items-start">
                      <svg className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${
                        forgotMessage.includes('kesalahan') || forgotMessage.includes('Pastikan')
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        {forgotMessage.includes('kesalahan') || forgotMessage.includes('Pastikan') ? (
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span className={`text-sm ${
                        forgotMessage.includes('kesalahan') || forgotMessage.includes('Pastikan')
                          ? 'text-red-300' 
                          : 'text-green-300'
                      }`}>
                        {forgotMessage}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOpen(false);
                      setForgotMessage('');
                    }}
                    className="flex-1 py-2.5 px-4 border border-white/20 rounded-lg text-white hover:bg-white/5 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                        </svg>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span>Kirim Tautan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;