import { motion } from "framer-motion";
import { Hash, Volume2, Plus, Users, Settings } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const ChannelSidebar = () => {
  const { selectedServer, selectedChannel, setSelectedChannel } = useChat();
  const { user } = useAuth();

  // Mock data untuk channels - dalam aplikasi nyata ini akan diambil dari database
  const channels = [
    { id: 1, name: 'general', type: 'text', unread: false },
    { id: 2, name: 'pengumuman', type: 'text', unread: true },
    { id: 3, name: 'programming', type: 'text', unread: false },
    { id: 4, name: 'design', type: 'text', unread: false },
    { id: 5, name: 'voice-chat', type: 'voice', unread: false },
    { id: 6, name: 'gaming', type: 'voice', unread: false },
  ];

  if (!selectedServer) {
    return (
      <div className="w-60 bg-[#2f3136] flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Pesan Langsung</h2>
        </div>
        <div className="flex-1 p-4">
          <p className="text-gray-400 text-sm">Pilih server untuk melihat channels</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      {/* Server Header */}
      <div className="p-4 border-b border-gray-700 shadow-sm">
        <h2 className="text-white font-semibold flex items-center justify-between">
          {selectedServer.name}
          <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
        </h2>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        {/* Text Channels */}
        <div className="mt-4">
          <div className="px-4 flex items-center justify-between text-gray-400 text-sm font-semibold hover:text-gray-300 group">
            <span>CHANNEL TEKS</span>
            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer" />
          </div>
          
          <div className="mt-2">
            {channels.filter(c => c.type === 'text').map(channel => (
              <motion.div
                key={channel.id}
                whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                className={`px-4 py-1 mx-2 rounded flex items-center space-x-2 cursor-pointer ${
                  selectedChannel?.id === channel.id
                    ? 'bg-[#42464d] text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                <Hash className="w-4 h-4" />
                <span className="flex-1">{channel.name}</span>
                {channel.unread && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between text-gray-400 text-sm font-semibold hover:text-gray-300 group">
            <span>CHANNEL SUARA</span>
            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer" />
          </div>
          
          <div className="mt-2">
            {channels.filter(c => c.type === 'voice').map(channel => (
              <motion.div
                key={channel.id}
                whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                className={`px-4 py-1 mx-2 rounded flex items-center space-x-2 cursor-pointer ${
                  selectedChannel?.id === channel.id
                    ? 'bg-[#42464d] text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                <Volume2 className="w-4 h-4" />
                <span>{channel.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Online Members Preview */}
        <div className="mt-6 px-4">
          <div className="text-gray-400 text-sm font-semibold mb-2">
            ANGGOTA ONLINE — 12
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">User{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-2 bg-[#292b2f]">
        <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#34373c] cursor-pointer">
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.username?.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">{user?.username}</div>
            <div className="text-gray-400 text-xs">#{user?.id?.substring(0, 4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;