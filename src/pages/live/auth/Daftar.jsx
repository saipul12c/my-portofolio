import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

function Daftar() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Mark field as touched
    if (!touchedFields[id]) {
      setTouchedFields(prev => ({ ...prev, [id]: true }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    if (!touchedFields[id]) {
      setTouchedFields(prev => ({ ...prev, [id]: true }));
    }
  };

  // Real-time validation
  useEffect(() => {
    const { email, password, confirmPassword, username } = formData;
    
    const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
    const isValidUsername = username.length >= 3;
    const isValidPassword = password.length >= 6;
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    
    setFormValid(isValidEmail && isValidUsername && isValidPassword && passwordsMatch);
  }, [formData]);

  const handleDaftar = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    const { password, confirmPassword, username, email } = formData;
    
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (username.length < 3) {
      setError('Username minimal 3 karakter');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);

    try {
      // Register user in Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
          emailRedirectTo: `${window.location.origin}/Live-Discussion/login`
        }
      });

      if (authError) {
        if (authError.status === 429) {
          setError('Terlalu banyak percobaan. Silakan tunggu beberapa menit.');
          return;
        }
        
        if (authError.message.includes('already registered') || 
            authError.code === 'user_already_exists' ||
            authError.message.toLowerCase().includes('already been registered')) {
          setError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
          setTimeout(() => navigate('/Live-Discussion/login'), 2000);
          return;
        }
        
        throw authError;
      }

      if (data.user) {
        // Create user profile in users table
        try {
          const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            username: formData.username,
            created_at: new Date().toISOString(),
          });

          if (profileError) {
            // If duplicate (user already exists), ignore the error
            if (profileError.code === '23505' || 
                String(profileError.message).toLowerCase().includes('duplicate')) {
              console.log('Profil user sudah ada, melewati insert.');
            } else {
              console.error('Gagal menyimpan profil:', profileError);
            }
          }
        } catch (err) {
          console.error('Error saat insert profil:', err);
        }

        // Show success toast and redirect
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/Live-Discussion/login');
        }, 2500);
      }
      
    } catch (error) {
      console.error('Error:', error);
      
      // More specific error messages
      if (error.message?.includes('rate limit') || error.status === 429) {
        setError('Terlalu banyak permintaan. Silakan coba lagi nanti.');
      } else if (error.message?.includes('Invalid login credentials')) {
        setError('Email atau password tidak valid.');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Silakan cek inbox Anda.');
      } else if (error.message?.includes('weak password')) {
        setError('Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.');
      } else {
        setError('Gagal mendaftar: ' + (error.message || 'Terjadi kesalahan. Coba lagi.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Compute password strength score and label
  const computePasswordStrength = (pw) => {
    let score = 0;
    if (!pw) return { score: 0, label: 'Kosong', color: 'bg-gray-200' };
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 2) return { score, label: 'Lemah', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Sedang', color: 'bg-yellow-500' };
    return { score, label: 'Kuat', color: 'bg-green-500' };
  };

  const passwordStrength = computePasswordStrength(formData.password);

  // Field validation helpers
  const getFieldValidation = (field) => {
    if (!touchedFields[field]) return { isValid: null, message: '' };
    
    switch (field) {
      case 'email': {
        const isValidEmail = /^\S+@\S+\.\S+$/.test(formData.email);
        return {
          isValid: isValidEmail,
          message: isValidEmail ? 'Email valid' : 'Format email tidak valid'
        };
      }
      case 'username': {
        const isValidUsername = formData.username.length >= 3;
        return {
          isValid: isValidUsername,
          message: isValidUsername ? 'Username tersedia' : 'Username minimal 3 karakter'
        };
      }
      case 'password': {
        const isValidPassword = formData.password.length >= 6;
        return {
          isValid: isValidPassword,
          message: isValidPassword ? 'Password cukup kuat' : 'Password minimal 6 karakter'
        };
      }
      case 'confirmPassword': {
        const passwordsMatch = formData.confirmPassword === formData.password && formData.confirmPassword.length > 0;
        return {
          isValid: passwordsMatch,
          message: passwordsMatch ? 'Password cocok' : 'Password tidak cocok'
        };
      }
      default:
        return { isValid: null, message: '' };
    }
  };

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
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-8 text-center border-b border-white/10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
              Buat Akun Baru
            </h2>
            <p className="mt-2 text-cyan-300/70 text-sm">
              Bergabunglah dengan komunitas diskusi live
            </p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6">
            <form onSubmit={handleDaftar} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-cyan-100 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                      touchedFields.username 
                        ? getFieldValidation('username').isValid 
                          ? 'border-green-500/50' 
                          : 'border-red-500/50'
                        : 'border-white/10'
                    } rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition`}
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    autoComplete="username"
                  />
                  {touchedFields.username && getFieldValidation('username').isValid !== null && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {getFieldValidation('username').isValid ? (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                <p className={`mt-2 text-xs ${
                  touchedFields.username 
                    ? getFieldValidation('username').isValid 
                      ? 'text-green-400' 
                      : 'text-red-400'
                    : 'text-cyan-300/70'
                }`}>
                  {touchedFields.username ? getFieldValidation('username').message : 'Minimal 3 karakter'}
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-100 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                      touchedFields.email 
                        ? getFieldValidation('email').isValid 
                          ? 'border-green-500/50' 
                          : 'border-red-500/50'
                        : 'border-white/10'
                    } rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition`}
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    autoComplete="email"
                  />
                  {touchedFields.email && getFieldValidation('email').isValid !== null && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {getFieldValidation('email').isValid ? (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                <p className={`mt-2 text-xs ${
                  touchedFields.email 
                    ? getFieldValidation('email').isValid 
                      ? 'text-green-400' 
                      : 'text-red-400'
                    : 'text-cyan-300/70'
                }`}>
                  {touchedFields.email ? getFieldValidation('email').message : 'Gunakan email yang valid'}
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${
                      touchedFields.password 
                        ? getFieldValidation('password').isValid 
                          ? 'border-green-500/50' 
                          : 'border-red-500/50'
                        : 'border-white/10'
                    } rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition`}
                    placeholder="Buat password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    autoComplete="new-password"
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
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-cyan-300/70">Kekuatan Password:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.label === 'Kuat' ? 'text-green-400' :
                        passwordStrength.label === 'Sedang' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <p className={`mt-2 text-xs ${
                  touchedFields.password 
                    ? getFieldValidation('password').isValid 
                      ? 'text-green-400' 
                      : 'text-red-400'
                    : 'text-cyan-300/70'
                }`}>
                  {touchedFields.password ? getFieldValidation('password').message : 'Minimal 6 karakter, gunakan huruf, angka, dan simbol'}
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyan-100 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${
                      touchedFields.confirmPassword 
                        ? getFieldValidation('confirmPassword').isValid 
                          ? 'border-green-500/50' 
                          : 'border-red-500/50'
                        : 'border-white/10'
                    } rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition`}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-300 hover:text-white transition"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                  >
                    {showConfirm ? (
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
                <p className={`mt-2 text-xs ${
                  touchedFields.confirmPassword 
                    ? getFieldValidation('confirmPassword').isValid 
                      ? 'text-green-400' 
                      : 'text-red-400'
                    : 'text-cyan-300/70'
                }`}>
                  {touchedFields.confirmPassword ? getFieldValidation('confirmPassword').message : 'Pastikan password sama dengan di atas'}
                </p>
              </div>

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
                disabled={loading || !formValid}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !formValid || loading 
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
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </button>

              {/* Terms & Conditions */}
              <p className="text-xs text-center text-cyan-300/60 px-4">
                Dengan mendaftar, Anda menyetujui{' '}
                <a href="#" className="text-cyan-300 hover:text-white underline transition">
                  Syarat & Ketentuan
                </a>{' '}
                dan{' '}
                <a href="#" className="text-cyan-300 hover:text-white underline transition">
                  Kebijakan Privasi
                </a>
              </p>

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
                Sudah punya akun?{' '}
                <Link 
                  to="/Live-Discussion/login" 
                  className="text-white font-semibold hover:text-cyan-300 transition inline-flex items-center gap-1"
                >
                  Masuk di sini
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Toast Success */}
        {showToast && (
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-50">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 animate-bounce-in pointer-events-auto">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Pendaftaran Berhasil!</h3>
                  <p className="text-white/90 text-sm mt-1">
                    Akun Anda telah dibuat. Silakan login untuk mulai berdiskusi.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/70">
                Anda akan diarahkan ke halaman login...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Daftar;