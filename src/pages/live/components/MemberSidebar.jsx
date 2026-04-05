import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Circle, ShieldCheck, X, MessageSquare, History } from 'lucide-react';

export const MemberSidebar = ({ isOpen, onClose, onlineUsers = [], allProfiles = [], messages = [], currentUser }) => {
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState('members'); // 'members' or 'messages'

  const filteredMembers = allProfiles.filter(profile => 
    profile.username?.toLowerCase().includes(search.toLowerCase()) ||
    profile.nama?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMessages = messages.filter(msg => 
    msg.content?.toLowerCase().includes(search.toLowerCase()) ||
    msg.username?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50);

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
            className="fixed top-0 right-0 h-full w-[380px] bg-[#0f172a]/95 backdrop-blur-3xl border-l border-white/10 z-[90] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all ${searchMode === 'members' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                  {searchMode === 'members' ? <Users className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-lg text-white">Discovery</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Signal Intelligence Unit</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-white/20" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="px-8 pt-6 flex gap-2">
               <button 
                onClick={() => setSearchMode('members')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'members' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/[0.02] text-white/30 border border-transparent hover:bg-white/5'}`}
               >
                 Anggota
               </button>
               <button 
                onClick={() => setSearchMode('messages')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'messages' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/[0.02] text-white/30 border border-transparent hover:bg-white/5'}`}
               >
                 Pesan
               </button>
            </div>

            {/* Search */}
            <div className="p-8">
              <div className="relative group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/search:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder={searchMode === 'members' ? "Cari nama operative..." : "Cari konten sinyal..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all font-bold"
                />
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8 space-y-2">
              {searchMode === 'members' ? (
                filteredMembers.map((member) => {
                  const isOnline = onlineUsers.some(u => u.id === member.id);
                  const isMe = currentUser?.id === member.id;
                  return (
                    <motion.div
                      key={member.id}
                      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                      className="flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-black text-white/40 group-hover:text-white transition-colors border border-white/5">
                          {member.nama?.[0]?.toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0f172a] ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black truncate italic ${isMe ? 'text-cyan-400' : 'text-white'}`}>
                            {member.nama}
                          </span>
                          {['SUPER_ADMIN', 'ADMIN'].includes(member.role) && <ShieldCheck className="w-4 h-4 text-purple-400" />}
                        </div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{member.role}</p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                filteredMessages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter italic">@{msg.username}</span>
                      <span className="text-[8px] font-bold text-white/10 uppercase">{new Date(msg.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-white/60 italic line-clamp-2 leading-relaxed">"{msg.content}"</p>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5">
                <div className="flex items-center gap-3 justify-center opacity-30">
                  <History className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Signal Intelligence Unit</span>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
