import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.body?.message || err.message || 'Login gagal');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Masuk</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Masuk</button>
          <Link to="/register" className="text-sm text-blue-500">Daftar baru</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
