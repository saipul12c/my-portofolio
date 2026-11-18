import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/backend';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    display_name: user?.display_name || '',
    description: user?.description || '',
    avatar_url: user?.avatar_url || ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setStatus('saving');
    try {
      const res = await api.apiFetch(`/api/profiles/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      setStatus('saved');
      setEditing(false);
      // optionally refresh user by reloading token profile in AuthContext
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (!user) return <div className="p-6">No user</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl my-8 text-white">
      <div className="flex items-center gap-4">
        <img src={user.avatar_url || '/avatar/default.png'} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400/40" />
        <div>
          <h2 className="text-2xl font-bold text-white">{user.display_name || user.username || user.email}</h2>
          <p className="text-sm text-cyan-300">{user.email}</p>
        </div>
      </div>

      {!editing ? (
        <div className="mt-6">
          <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{user.description}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setEditing(true)} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all text-sm">Edit</button>
            <button onClick={() => logout()} className="px-5 py-2.5 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 rounded-xl font-semibold transition-all text-sm">Logout</button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1">Display name</label>
            <input name="display_name" value={form.display_name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1">Avatar URL</label>
            <input name="avatar_url" value={form.avatar_url} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all text-sm">Save</button>
            <button onClick={() => setEditing(false)} className="px-5 py-2.5 bg-white/10 text-gray-300 hover:bg-white/15 rounded-xl font-medium transition-all text-sm">Cancel</button>
          </div>
          {status === 'saving' && <div className="text-xs text-cyan-400">Menyimpan...</div>}
          {status === 'saved' && <div className="text-xs text-emerald-400">Perubahan berhasil disimpan!</div>}
          {status === 'error' && <div className="text-xs text-red-400">Gagal menyimpan perubahan.</div>}
        </div>
      )}
    </div>
  );
};

export default Profile;
