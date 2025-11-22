import { motion } from "framer-motion";
import { Search, Plus } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

const MemberSidebar = () => {
  const { members, selectedServer } = useChat();

  // Mock data untuk members - dalam aplikasi nyata ini akan diambil dari database
  const mockMembers = [
    { id: 1, name: 'JohnDoe', status: 'online', color: '#ff6b6b', isBot: false },
    { id: 2, name: 'JaneSmith', status: 'idle', color: '#4ecdc4', isBot: false },
    { id: 3, name: 'BotHelper', status: 'online', color: '#45b7d1', isBot: true },
    { id: 4, name: 'MikeJohnson', status: 'dnd', color: '#96ceb4', isBot: false },
    { id: 5, name: 'SarahWilson', status: 'offline', color: '#feca57', isBot: false },
  ];

  const statusGroups = {
    online: mockMembers.filter(m => m.status === 'online'),
    idle: mockMembers.filter(m => m.status === 'idle'),
    dnd: mockMembers.filter(m => m.status === 'dnd'),
    offline: mockMembers.filter(m => m.status === 'offline')
  };

  const StatusIcon = ({ status }) => {
    const icons = {
      online: <div className="w-2 h-2 bg-green-500 rounded-full" />,
      idle: <div className="w-2 h-2 bg-yellow-500 rounded-full" />,
      dnd: <div className="w-2 h-2 bg-red-500 rounded-full" />,
      offline: <div className="w-2 h-2 bg-gray-500 rounded-full" />
    };
    return icons[status] || icons.offline;
  };

  if (!selectedServer) {
    return (
      <div className="w-60 bg-[#2f3136] border-l border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Teman</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-400 text-sm">Pilih server untuk melihat anggota</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-60 bg-[#2f3136] border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari anggota"
            className="w-full bg-[#202225] text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-2 top-1.5" />
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Online Members */}
        {statusGroups.online.length > 0 && (
          <div>
            <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center justify-between">
              <span>ONLINE — {statusGroups.online.length}</span>
              <Plus className="w-3 h-3 cursor-pointer hover:text-white" />
            </div>
            <div className="space-y-1">
              {statusGroups.online.map(member => (
                <motion.div
                  key={member.id}
                  whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                  className="flex items-center space-x-2 p-1 rounded cursor-pointer group"
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2f3136] rounded-full flex items-center justify-center">
                      <StatusIcon status={member.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="text-white text-sm truncate">{member.name}</span>
                      {member.isBot && (
                        <span className="bg-cyan-600 text-white text-xs px-1 rounded">BOT</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Idle Members */}
        {statusGroups.idle.length > 0 && (
          <div>
            <div className="text-gray-400 text-xs font-semibold mb-2">
              IDLE — {statusGroups.idle.length}
            </div>
            <div className="space-y-1">
              {statusGroups.idle.map(member => (
                <motion.div
                  key={member.id}
                  whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                  className="flex items-center space-x-2 p-1 rounded cursor-pointer group"
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2f3136] rounded-full flex items-center justify-center">
                      <StatusIcon status={member.status} />
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm truncate">{member.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Do Not Disturb Members */}
        {statusGroups.dnd.length > 0 && (
          <div>
            <div className="text-gray-400 text-xs font-semibold mb-2">
              DO NOT DISTURB — {statusGroups.dnd.length}
            </div>
            <div className="space-y-1">
              {statusGroups.dnd.map(member => (
                <motion.div
                  key={member.id}
                  whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                  className="flex items-center space-x-2 p-1 rounded cursor-pointer group"
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2f3136] rounded-full flex items-center justify-center">
                      <StatusIcon status={member.status} />
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm truncate">{member.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Members */}
        {statusGroups.offline.length > 0 && (
          <div>
            <div className="text-gray-400 text-xs font-semibold mb-2">
              OFFLINE — {statusGroups.offline.length}
            </div>
            <div className="space-y-1">
              {statusGroups.offline.map(member => (
                <motion.div
                  key={member.id}
                  whileHover={{ backgroundColor: 'rgba(79, 84, 92, 0.16)' }}
                  className="flex items-center space-x-2 p-1 rounded cursor-pointer group"
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2f3136] rounded-full flex items-center justify-center">
                      <StatusIcon status={member.status} />
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm truncate">{member.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSidebar;