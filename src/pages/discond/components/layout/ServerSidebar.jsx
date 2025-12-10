import { motion } from "framer-motion";
import { Plus, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { getTierColor } from '../../utils/helpers';

const ServerSidebar = ({ onProfileClick, mobileClose }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const { servers, selectedServer, setSelectedServer, createServer } = useChat();
  const { user } = useAuth();

  const handleCreateServer = async () => {
    if (!newServerName.trim()) return;
    
    const result = await createServer(newServerName.trim());
    if (!result.error) {
      setNewServerName('');
      setShowCreateModal(false);
    }
  };

  return (
    <>
      {/* Mobile top bar with close button */}
      <div className="md:hidden bg-[#202225] p-2 flex items-center justify-between">
        <div className="text-white text-sm font-semibold">Servers</div>
        <button onClick={() => mobileClose?.()} className="text-gray-300 p-1">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="w-16 bg-[#202225] flex flex-col items-center py-3 space-y-4 overflow-y-auto">
        {/* Direct Messages */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-12 h-12 rounded-3xl transition-all duration-200 flex items-center justify-center ${
            !selectedServer 
              ? 'bg-cyan-600 text-white rounded-2xl' 
              : 'bg-[#36393f] text-gray-300 hover:bg-cyan-600 hover:text-white hover:rounded-2xl'
          }`}
          onClick={() => setSelectedServer(null)}
          type="button"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>

        <div className="w-8 h-0.5 bg-gray-600 rounded-full mx-auto"></div>

        {/* Server List */}
        {servers.map(server => (
          <motion.button
            key={server.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-3xl transition-all duration-200 flex items-center justify-center relative ${
              selectedServer?.id === server.id
                ? 'bg-cyan-600 text-white rounded-2xl'
                : 'bg-[#36393f] text-gray-300 hover:bg-cyan-600 hover:text-white hover:rounded-2xl'
            }`}
            onClick={() => setSelectedServer(server)}
            type="button"
          >
            <span className="text-lg font-semibold">{server.icon || '🖥️'}</span>
            
            {selectedServer?.id === server.id && (
              <div className="absolute -left-1 w-1 h-8 bg-white rounded-r-full"></div>
            )}
          </motion.button>
        ))}

        {/* Add Server Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-3xl bg-[#36393f] text-green-500 hover:bg-green-600 hover:text-white hover:rounded-2xl transition-all duration-200 flex items-center justify-center"
          onClick={() => setShowCreateModal(true)}
          type="button"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* User Profile */}
        <div className="mt-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
            style={{ backgroundColor: getTierColor(user?.tier) }}
            onClick={onProfileClick}
            title={user?.username}
          >
            {user?.username?.substring(0, 2).toUpperCase()}
          </motion.div>
        </div>
      </div>

      {/* Create Server Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#36393f] rounded-lg p-6 w-96"
          >
            <h3 className="text-xl font-bold text-white mb-2">Buat Server Baru</h3>
            <p className="text-gray-400 mb-4">
              Beri nama server Anda dan mulailah membangun komunitas
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Nama Server
              </label>
              <input
                type="text"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder="Masukkan nama server..."
                className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                maxLength={100}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                type="button"
              >
                Batal
              </button>
              <button
                onClick={handleCreateServer}
                disabled={!newServerName.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
                type="button"
              >
                Buat Server
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ServerSidebar;