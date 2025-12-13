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
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow my-8">
      <div className="flex items-center gap-4">
        <img src={user.avatar_url || '/avatar/default.png'} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold">{user.display_name || user.username || user.email}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {!editing ? (
        <div className="mt-6">
          <p className="whitespace-pre-wrap">{user.description}</p>
          <div className="mt-4 flex gap-3">
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
            <button onClick={() => logout()} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm">Display name</label>
            <input name="display_name" value={form.display_name} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm">Avatar URL</label>
            <input name="avatar_url" value={form.avatar_url} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          </div>
          {status === 'saving' && <div>Saving...</div>}
          {status === 'saved' && <div className="text-green-500">Saved</div>}
          {status === 'error' && <div className="text-red-500">Error saving</div>}
        </div>
      )}
    </div>
  );
};

export default Profile;
