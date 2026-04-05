import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Circle, ShieldCheck, X } from 'lucide-react';

export const MemberSidebar = ({ isOpen, onClose, onlineUsers = [], allProfiles = [], currentUser }) => {
  const [search, setSearch] = useState('');

  const filteredMembers = allProfiles.filter(profile => 
    profile.username?.toLowerCase().includes(search.toLowerCase()) ||
    profile.nama?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (username) => {
    return onlineUsers.some(u => u.username === username) ? 'text-green-400' : 'text-white/20';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[320px] bg-[#0f172a] border-l border-white/10 z-[90] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-xs text-white">Anggota</h3>
                  <p className="text-[10px] text-white/40 font-bold">{allProfiles.length} terdaftar • {onlineUsers.length} online</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white/30" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari anggota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Member List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              <div className="px-3 py-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Semua Anggota</span>
              </div>
              
              {filteredMembers.map((member) => {
                const isOnline = onlineUsers.some(u => u.email === member.email);
                const isMe = currentUser?.id === member.id;

                return (
                  <motion.div
                    key={member.id}
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-black text-white/60 group-hover:text-white transition-colors">
                        {member.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isMe ? 'text-cyan-400' : 'text-white/70'}`}>
                          {member.username} {isMe && '(You)'}
                        </span>
                        {['SUPER_ADMIN', 'ADMIN'].includes(member.role) && (
                          <ShieldCheck className="w-3 h-3 text-purple-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-white/30 truncate flex items-center gap-1">
                         <span className="capitalize">{member.role.toLowerCase().replace('_', ' ')}</span>
                         {member.custom_status && (
                           <>
                             <Circle className="w-1 h-1 fill-white/10 border-none" />
                             <span className="italic">"{member.custom_status}"</span>
                           </>
                         )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-4 border border-cyan-500/10">
                <p className="text-[10px] font-bold text-cyan-200/60 leading-relaxed italic text-center">
                  Live Discussion v2.1 • Professional Edition
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
