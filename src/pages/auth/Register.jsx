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
    <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Daftar</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Daftar</button>
          <Link to="/login" className="text-sm text-blue-500">Sudah punya akun?</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
