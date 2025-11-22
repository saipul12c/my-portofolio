import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES, USER_TIERS } from '../../utils/constants';
import { getTierColor, getRoleBadge } from '../../utils/helpers';
import Modal from '../ui/Modal';

const UserProfile = ({ onClose }) => {
  const { user, updateProfile, signOut } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    const result = await updateProfile({ username });
    setLoading(false);
    
    if (!result.error) {
      onClose();
    }
  };

  const roleBadge = getRoleBadge(user?.role);
  const tierColor = getTierColor(user?.tier);

  return (
    <Modal onClose={onClose} size="lg">
      <div className="flex items-center space-x-4 mb-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: tierColor }}
        >
          {user?.username?.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.username}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full text-white ${roleBadge.color}`}>
              {roleBadge.text}
            </span>
            <span 
              className="px-2 py-1 text-xs rounded-full text-white"
              style={{ backgroundColor: tierColor }}
            >
              {user?.tier?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email}
            disabled
            className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-gray-400 cursor-not-allowed"
          />
        </div>

        <div className="bg-[#40444b] rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Tingkatan Akun</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(USER_TIERS).map((tier) => (
              <div
                key={tier}
                className={`text-center p-2 rounded text-xs font-medium ${
                  user?.tier === tier 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                style={{ 
                  backgroundColor: user?.tier === tier ? getTierColor(tier) : '#36393f'
                }}
              >
                {tier.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={signOut}
          className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>

        <div className="space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !username.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfile;