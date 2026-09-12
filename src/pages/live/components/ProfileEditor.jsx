import React, { useState } from 'react';
import { Edit, Save, X, AlertCircle, CheckCircle, Shield, User, Mail, Calendar, LogOut } from 'lucide-react';

export const ProfileEditor = ({ 
  profile, 
  currentUser, 
  isEditing, 
  setIsEditing, 
  editForm, 
  setEditForm, 
  onSave, 
  onLogout,
  loading = false 
}) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if current user can edit this profile
  const canEdit = () => {
    if (!currentUser || !profile) return false;
    return (
      currentUser.email === profile.email || 
      currentUser.role === 'SUPER_ADMIN' || 
      currentUser.role === 'ADMIN'
    );
  };

  const handleSave = async () => {
    if (!editForm.nama || editForm.nama.trim() === '') {
      setError('Nama tidak boleh kosong');
      return;
    }

    if (editForm.nama.length < 3) {
      setError('Nama minimal 3 karakter');
      return;
    }

    try {
      setError('');
      const result = await onSave(editForm);
      if (result) {
        setSuccess('Profil berhasil diperbarui!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Gagal memperbarui profil');
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message);
    }
  };

  if (!canEdit() && isEditing) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-red-200 text-xs font-semibold">
          Anda hanya bisa mengedit profil sendiri. Hubungi admin jika ingin mengubah profil orang lain.
        </p>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
              {profile?.nama?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--theme-text)] leading-tight">{profile?.nama}</h3>
              <p className="text-xs text-[var(--theme-text-muted)] font-mono">{profile?.email}</p>
            </div>
          </div>
          {canEdit() && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Edit className="w-4 h-4" />
              Edit Profil
            </button>
          )}
        </div>
        
        <div className="bg-white/[0.02] border border-[var(--theme-border)] rounded-2xl p-5 space-y-4 backdrop-blur-xl">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] block mb-1">
              Bio / Deskripsi
            </span>
            <p className="text-sm text-[var(--theme-text)] leading-relaxed italic bg-white/[0.02] p-3 rounded-xl border border-white/5">
              "{profile?.bio || 'Belum ada bio yang ditambahkan.'}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--theme-border)]">
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] block mb-0.5">Role</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {profile?.roleName || profile?.role || 'USER'}
              </span>
            </div>
            
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] block mb-0.5">Status Akun</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {profile?.status || 'Aktif'}
              </span>
            </div>
          </div>

          {currentUser && onLogout && (
            <div className="pt-3 border-t border-[var(--theme-border)] flex justify-end">
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akun
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
        <div>
          <h3 className="text-lg font-bold text-[var(--theme-text)]">Edit Profil Pengguna</h3>
          <p className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-text-muted)]">
            Perbarui data identitas Anda di sistem
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-xs font-medium">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-200 text-xs font-medium">{success}</p>
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] mb-2">
            Nama Lengkap / Panggilan <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={editForm.nama}
            onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
            placeholder="Masukkan nama Anda"
            className="w-full px-4 py-3 bg-white/[0.03] border border-[var(--theme-border)] rounded-xl text-sm text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
            maxLength={50}
          />
          <span className="text-[10px] text-[var(--theme-text-muted)] mt-1 block text-right">{editForm.nama.length}/50</span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] mb-2">
            Bio / Tentang Saya
          </label>
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            placeholder="Ceritakan tentang minat atau keahlian Anda..."
            className="w-full px-4 py-3 bg-white/[0.03] border border-[var(--theme-border)] rounded-xl text-sm text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium resize-none custom-scrollbar"
            rows="3"
            maxLength={500}
          />
          <span className="text-[10px] text-[var(--theme-text-muted)] mt-1 block text-right">{editForm.bio.length}/500</span>
        </div>

        {/* Read-only info */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--theme-border)]">
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] block mb-0.5">Email Terdaftar</span>
            <span className="text-xs font-semibold text-[var(--theme-text)] truncate block">{profile?.email}</span>
          </div>
          
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] block mb-0.5">Tingkat Role</span>
            <span className="text-xs font-semibold text-cyan-400">{profile?.roleName || profile?.role || 'USER'}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-3 border-t border-[var(--theme-border)]">
        <button
          onClick={() => setIsEditing(false)}
          className="px-5 py-2.5 border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)] rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          disabled={loading}
        >
          Batal
        </button>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
};
