import React, { useState } from 'react';
import { Edit, Save, X, AlertCircle } from 'lucide-react';

export const ProfileEditor = ({ 
  profile, 
  currentUser, 
  isEditing, 
  setIsEditing, 
  editForm, 
  setEditForm,
  onSave,
  loading = false
}) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if current user can edit this profile
  const canEdit = () => {
    if (!currentUser || !profile) return false;
    // Only user themselves can edit, or Super Admin/Admin
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
        setSuccess('Profile berhasil diperbarui!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Gagal memperbarui profile');
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message);
    }
  };

  if (!canEdit() && isEditing) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-800">
          Anda hanya bisa edit profile sendiri. Hubungi admin jika ingin merubah profile orang lain.
        </p>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tentang Saya</h3>
          {canEdit() && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-600">Nama</p>
            <p className="text-lg font-medium text-gray-900">{profile?.nama}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Bio</p>
            <p className="text-gray-800 whitespace-pre-wrap">{profile?.bio || 'Belum ada bio'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-800">{profile?.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
        {currentUser?.email === profile?.email && (
          <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Anda hanya bisa edit profile sendiri
          </p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editForm.nama}
            onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
            placeholder="Masukkan nama Anda"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">{editForm.nama.length}/50 karakter</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Bio / Tentang Saya
          </label>
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            placeholder="Ceritakan tentang Anda..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{editForm.bio.length}/500 karakter</p>
        </div>

        {/* Read-only fields */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">{profile?.email}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Role</p>
            <p className="text-sm font-medium text-gray-900">{profile?.roleName}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="text-sm font-medium text-green-600">Aktif</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Bergabung</p>
            <p className="text-sm font-medium text-gray-900">{profile?.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <X className="w-4 h-4" />
          Batalkan
        </button>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center pt-2">
        💡 Informasi Anda tidak akan dibagikan tanpa izin
      </p>
    </div>
  );
};
