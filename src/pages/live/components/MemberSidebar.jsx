import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Circle, ShieldCheck, X, MessageSquare, History } from 'lucide-react';

export const MemberSidebar = ({ 
  isOpen, 
  onClose, 
  onlineUsers = [], 
  allProfiles = [], 
  messages = [], 
  currentUser,
  onSelectMember,
  onSelectMessage
}) => {
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState('members'); // 'members' or 'messages'

  const filteredMembers = React.useMemo(() => {
    if (!isOpen) return [];
    const q = search.toLowerCase();
    return allProfiles.filter(profile => 
      profile.username?.toLowerCase().includes(q) ||
      profile.nama?.toLowerCase().includes(q)
    );
  }, [isOpen, allProfiles, search]);

  const filteredMessages = React.useMemo(() => {
    if (!isOpen) return [];
    const q = search.toLowerCase();
    return messages.filter(msg => 
      msg.content?.toLowerCase().includes(q) ||
      msg.username?.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [isOpen, messages, search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[380px] max-w-full bg-[var(--theme-surface)]/98 backdrop-blur-3xl border-l border-[var(--theme-border)] z-[90] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 sm:p-7 border-b border-[var(--theme-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 sm:p-3 rounded-2xl transition-all ${searchMode === 'members' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                  {searchMode === 'members' ? <Users className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-base sm:text-lg text-[var(--theme-text)]">Eksplorasi Sinyal</h3>
                  <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] font-bold uppercase tracking-wider">Daftar Anggota & Arsip Pesan</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 sm:p-3 hover:bg-[var(--theme-surface-hover)] rounded-2xl transition-colors text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                title="Tutup"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="px-5 sm:px-7 pt-4 sm:pt-6 flex gap-2">
               <button 
                onClick={() => setSearchMode('members')}
                className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${searchMode === 'members' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] border border-transparent hover:text-[var(--theme-text)]'}`}
               >
                 Anggota ({filteredMembers.length})
               </button>
               <button 
                onClick={() => setSearchMode('messages')}
                className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${searchMode === 'messages' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] border border-transparent hover:text-[var(--theme-text)]'}`}
               >
                 Pesan ({filteredMessages.length})
               </button>
            </div>

            {/* Search Input */}
            <div className="p-5 sm:p-7">
              <div className="relative group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)] group-focus-within/search:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder={searchMode === 'members' ? "Cari nama anggota..." : "Cari teks sinyal..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 sm:py-3.5 bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] rounded-2xl text-xs sm:text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all font-bold"
                />
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-2">
              {searchMode === 'members' ? (
                filteredMembers.length === 0 ? (
                  <div className="text-center py-12 text-[var(--theme-text-muted)] text-xs">
                    Tidak ada anggota yang cocok dengan pencarian
                  </div>
                ) : (
                  filteredMembers.map((member) => {
                    const isOnline = onlineUsers.some(u => u.id === member.id);
                    const isMe = currentUser?.id === member.id;
                    return (
                      <motion.div
                        key={member.id}
                        onClick={() => onSelectMember?.(member)}
                        whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.03)' }}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--theme-surface-hover)]/40 hover:bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] transition-all cursor-pointer group"
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
                            {member.nama?.[0]?.toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--theme-surface)] ${isOnline ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-gray-500/40'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs sm:text-sm font-black truncate ${isMe ? 'text-cyan-400' : 'text-[var(--theme-text)]'}`}>
                              {member.nama} {isMe && '(Anda)'}
                            </span>
                            {['SUPER_ADMIN', 'ADMIN'].includes(member.role) && <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                          </div>
                          <p className="text-[9px] font-bold text-[var(--theme-text-muted)] uppercase tracking-wider mt-0.5">{member.role}</p>
                        </div>
                      </motion.div>
                    );
                  })
                )
              ) : (
                filteredMessages.length === 0 ? (
                  <div className="text-center py-12 text-[var(--theme-text-muted)] text-xs">
                    Tidak ada pesan yang cocok dengan pencarian
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      onClick={() => onSelectMessage?.(msg)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-[var(--theme-surface-hover)]/50 border border-[var(--theme-border)] rounded-2xl hover:border-cyan-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-tight italic">@{msg.username}</span>
                        <span className="text-[8px] font-bold text-[var(--theme-text-muted)] uppercase">{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-[var(--theme-text)] line-clamp-2 leading-relaxed">"{msg.content}"</p>
                    </motion.div>
                  ))
                )
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 sm:p-5 bg-[var(--theme-surface-hover)]/30 border-t border-[var(--theme-border)]">
                <div className="flex items-center gap-2 justify-center opacity-40 text-[var(--theme-text-muted)]">
                  <History className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Sinyal Live Community</span>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};