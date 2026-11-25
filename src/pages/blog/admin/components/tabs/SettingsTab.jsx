import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  KeyRound, 
  User, 
  Mail, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { getAdminCredentials, updateAdminCredentials } from '../../services/blogAdminAuth';

export default function SettingsTab({ 
  onProfileUpdated, 
  setToast 
}) {
  const [credentials, setCredentials] = useState(getAdminCredentials());
  
  // Form profile
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');

  // Form password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Form PIN
  const [pin, setPin] = useState('');

  useEffect(() => {
    const creds = getAdminCredentials();
    setCredentials(creds);
    setDisplayName(creds.displayName || 'Blog Administrator');
    setUsername(creds.username || 'admin');
    setEmail(creds.email || 'admin@blog.id');
    setAvatar(creds.avatar || '');
    setRole(creds.role || 'Super Admin Blog');
    setPin(creds.pin || '2026');
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const res = updateAdminCredentials({
      displayName: displayName.trim(),
      username: username.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
      role: role.trim()
    });

    if (res.success) {
      if (setToast) setToast({ type: 'success', message: 'Profil Admin Blog berhasil diperbarui!' });
      if (onProfileUpdated) onProfileUpdated();
    } else {
      if (setToast) setToast({ type: 'error', message: res.message || 'Gagal menyimpan profil' });
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (currentPassword !== credentials.password) {
      if (setToast) setToast({ type: 'error', message: 'Password saat ini tidak sesuai!' });
      return;
    }
    if (!newPassword || newPassword.length < 5) {
      if (setToast) setToast({ type: 'error', message: 'Password baru minimal 5 karakter!' });
      return;
    }
    if (newPassword !== confirmPassword) {
      if (setToast) setToast({ type: 'error', message: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    const res = updateAdminCredentials({ password: newPassword });
    if (res.success) {
      if (setToast) setToast({ type: 'success', message: 'Password Blog Admin berhasil diubah!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      if (setToast) setToast({ type: 'error', message: 'PIN minimal 4 digit angka/karakter!' });
      return;
    }
    const res = updateAdminCredentials({ pin: pin.trim() });
    if (res.success) {
      if (setToast) setToast({ type: 'success', message: 'Secret Security PIN berhasil disimpan!' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Profil Admin Form */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Profil & Identitas Administrator Blog</h3>
            <p className="text-xs text-gray-400">Pengaturan informasi publik dan akun pengelola konten</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Nama Tampilan (Display Name)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Username Login</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Kontak Admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Role / Peran</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">URL Avatar Foto Profil</label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
                {avatar && (
                  <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-cyan-400/30 shrink-0" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>

      {/* Keamanan & Ganti Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Ubah Password */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ubah Password Akses Blog</h3>
              <p className="text-xs text-gray-400">Pastikan menggunakan kombinasi kata sandi yang kuat</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password Saat Ini</label>
              <input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password Baru</label>
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 5 karakter"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Konfirmasi Password Baru</label>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPass ? 'Sembunyikan' : 'Perlihatkan'}</span>
              </button>

              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Ubah Password
              </button>
            </div>
          </form>
        </div>

        {/* Form PIN Rahasia Cepat */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Secret Security PIN</h3>
              <p className="text-xs text-gray-400">PIN 4-digit untuk login kilat tanpa mengetik password panjang</p>
            </div>
          </div>

          <form onSubmit={handleSavePin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Kode PIN Rahasia</label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-cyan-300 font-mono text-base tracking-widest text-center focus:outline-none focus:border-cyan-400"
                required
              />
              <span className="text-[11px] text-gray-500 block mt-1">
                PIN ini bisa langsung Anda gunakan di tab "Secret PIN" pada halaman login blog.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Simpan PIN
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
