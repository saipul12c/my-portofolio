import { motion } from "framer-motion";
import { Hash, Volume2, Plus, Users, Settings, X } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

const ChannelSidebar = ({ mobileClose }) => {
  const { selectedServer, selectedChannel, setSelectedChannel, members } = useChat();
  const { user } = useAuth();
  const { channels: serverChannels } = useChat();
  const [activeChannels, setActiveChannels] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchActive = async () => {
      try {
        const data = await api.channels.active(10).catch(e => { console.error('Failed to fetch active channels', e); return []; });
        if (!mounted) return;
        setActiveChannels(data || []);
      } catch (err) {
        console.error('Failed to fetch active channels', err);
      }
    };
    // only fetch global active channels when no server is selected
    if (!selectedServer) fetchActive();
    return () => { mounted = false; };
  }, [selectedServer]);

  if (!selectedServer) {
    return (
      <div className="w-60 bg-[var(--dc-bg-2)] flex flex-col">
        <div className="md:hidden bg-[var(--dc-bg-2)] p-2 flex items-center justify-between">
          <div className="text-white text-sm font-semibold">Channels</div>
          <button onClick={() => mobileClose?.()} className="text-gray-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <h2 className="text-white font-semibold">Top Channel Aktif</h2>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          {activeChannels.length === 0 && (
            <p className="text-gray-400 text-sm p-4">Tidak ada channel aktif atau backend belum tersedia.</p>
          )}
          {activeChannels.map(ch => (
            <div key={ch.id} className="px-3 py-2 m-2 rounded bg-[var(--dc-surface)] hover:bg-[var(--dc-surface-2)] cursor-pointer" onClick={() => setSelectedChannel(ch)}>
              <div className="flex items-center justify-between">
                <div className="text-white font-medium">{ch.server_name} / {ch.name}</div>
                <div className="text-gray-400 text-sm">{ch.member_count}👥</div>
              </div>
              <div className="text-gray-400 text-xs mt-1">{ch.message_count} pesan</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-60 bg-[var(--dc-bg-2)] flex flex-col">
      <div className="md:hidden bg-[var(--dc-bg-2)] p-2 flex items-center justify-between">
        <div className="text-white text-sm font-semibold">Channels</div>
        <button onClick={() => mobileClose?.()} className="text-gray-300 p-1">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Server Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)] shadow-sm">
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
            {(serverChannels || []).filter(c => (c.type || 'text') === 'text').map(channel => (
              <motion.div
                key={channel.id}
                whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                className={`px-4 py-1 mx-2 rounded flex items-center space-x-2 cursor-pointer transition-colors ${
                  selectedChannel?.id === channel.id
                    ? 'bg-[var(--dc-surface-2)] text-white shadow-inner'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-[var(--dc-surface)]'
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                <Hash className="w-4 h-4" />
                <span className="flex-1">{channel.name}</span>
                <button onClick={(e) => { e.stopPropagation(); setSelectedChannel(channel); window.dispatchEvent(new CustomEvent('discond:open-channel-settings', { detail: { tab: 'settings' } })); }} className="p-1 text-gray-400 hover:text-gray-200">
                  <Settings className="w-4 h-4" />
                </button>
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
            {(serverChannels || []).filter(c => c.type === 'voice').map(channel => (
              <motion.div
                key={channel.id}
                whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                className={`px-4 py-1 mx-2 rounded flex items-center space-x-2 cursor-pointer ${
                  selectedChannel?.id === channel.id
                    ? 'bg-[var(--dc-surface-2)] text-white'
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
            ANGGOTA ONLINE — {(members && members.filter(m => (m.presence || '').toLowerCase() === 'online').length) || 0}
          </div>
          <div className="space-y-2">
            {(members || []).filter(m => (m.presence || '').toLowerCase() === 'online').slice(0,5).map((m) => (
              <div key={m.id} className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 cursor-pointer">
                <div className="w-2 h-2 bg-[var(--dc-accent)] rounded-full"></div>
                <span className="text-sm">{m.username || m.name || (`user-${m.id}`)}</span>
              </div>
            ))}
            {(!(members || []).length) && [1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 cursor-pointer">
                <div className="w-2 h-2 bg-[var(--dc-accent)] rounded-full"></div>
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