import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../ui/Modal';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, username);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-2">
        {isLogin ? 'Masuk ke Komuniti' : 'Daftar Komuniti'}
      </h2>
      <p className="text-gray-400 mb-6">
        {isLogin ? 'Masuk untuk melanjutkan' : 'Buat akun untuk bergabung dengan komunitas'}
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pilih username..."
              className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password..."
            className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded transition-colors font-medium"
        >
          {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-cyan-400 hover:text-cyan-300 text-sm"
          type="button"
        >
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
    </Modal>
  );
};

export default AuthModal;