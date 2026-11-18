import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ email, password, username });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.body?.message || err.message || 'Pendaftaran gagal');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Daftar</h2>
      {error && <div className="mb-4 text-xs p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-xs text-gray-300 font-medium">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
        </div>
        <div>
          <label className="block mb-1 text-xs text-gray-300 font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
        </div>
        <div>
          <label className="block mb-1 text-xs text-gray-300 font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all text-sm">Daftar</button>
          <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Sudah punya akun?</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
