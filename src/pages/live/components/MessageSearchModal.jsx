import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageSquare, Image, Calendar, User, ArrowUpRight } from 'lucide-react';

export const MessageSearchModal = ({ isOpen, onClose, messages = [], onJumpToMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaOnly, setMediaOnly] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!isOpen || (!searchTerm.trim() && !mediaOnly)) return [];

    const query = searchTerm.toLowerCase().trim();

    return messages.filter(msg => {
      const matchText = msg.content && msg.content.toLowerCase().includes(query);
      const matchUser = msg.username && msg.username.toLowerCase().includes(query);
      const hasMedia = Boolean(msg.media_url);

      if (mediaOnly && !hasMedia) return false;
      if (query && !matchText && !matchUser) return false;

      return true;
    }).slice(0, 30); // Limit to top 30 matches
  }, [isOpen, messages, searchTerm, mediaOnly]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kata kunci, kode, atau @pengguna..."
              className="flex-1 bg-transparent text-sm sm:text-base text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-white/10 rounded-full text-[var(--theme-text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-[var(--theme-text)] transition-colors"
            >
              Tutup
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--theme-border)] text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-text-muted)]">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setMediaOnly(!mediaOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                mediaOnly
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] border border-transparent'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              Hanya Bergambar
            </button>
            <span className="ml-auto text-[10px] text-[var(--theme-text-muted)]">
              {filteredMessages.length} hasil ditemukan
            </span>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-[var(--theme-text-muted)]">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">
                {searchTerm || mediaOnly ? 'Tidak ada pesan yang cocok' : 'Ketik sesuatu untuk mulai mencari riwayat sinyal'}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <motion.div
                key={msg.id || msg.timestamp}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  onJumpToMessage(msg.id);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-[var(--theme-surface-hover)]/70 hover:bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-cyan-400">
                      {msg.username}
                    </span>
                    <span className="text-[10px] text-[var(--theme-text-muted)]">
                      {new Date(msg.timestamp || msg.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {msg.channel && (
                      <span className="px-1.5 py-0.2 rounded-md bg-white/5 text-[9px] font-mono text-[var(--theme-text-muted)]">
                        #{msg.channel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--theme-text)] line-clamp-2 leading-relaxed">
                    {msg.content}
                  </p>
                  {msg.media_url && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-cyan-300 font-bold">
                      <Image className="w-3 h-3" /> Lampiran Gambar
                    </span>
                  )}
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--theme-text-muted)] group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
