import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Edit2, 
  Reply, 
  Plus, 
  Paperclip, 
  Lock, 
  Smile, 
  Send, 
  ShieldAlert, 
  X,
  Code,
  Bold,
  Sparkles,
  BarChart3,
  Clock
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { MentionInput } from './MentionInput';

export const ChatInputArea = ({
  user,
  systemConfig,
  replyTo,
  editingMessage,
  cancelEdit,
  cancelReply,
  handleSaveEdit,
  handleSendMessage,
  newMessage,
  setNewMessage,
  handleTyping,
  fileInputRef,
  uploadingMedia,
  handleFileSelect,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  handleEmojiClick,
  theme,
  sending,
  error,
  setError,
  cooldownSeconds = 0,
  onOpenPollModal
}) => {
  if (!user) return null;

  const isMuted = user.muteUntil && new Date(user.muteUntil) > new Date();
  const limit = systemConfig.message_limits[user.role] || 5;
  const isLimitReached = !editingMessage && user.messageCount >= limit;
  const isMaintenanceLocked = systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role);
  const isCooldownActive = cooldownSeconds > 0 && !['SUPER_ADMIN', 'ADMIN'].includes(user.role);

  // Quick insertion helpers
  const insertText = (prefix, suffix = '') => {
    setNewMessage(prev => `${prev}${prefix}${suffix}`);
  };

  // Smart Code Snippet Detection
  const appearsToBeCode = React.useMemo(() => {
    if (!newMessage || newMessage.includes('```')) return false;
    const codeKeywords = /\b(const|let|var|function|return|import|export|class|def|for|while|console\.log|<div|<\/)\b/;
    return newMessage.split('\n').length > 1 && codeKeywords.test(newMessage);
  }, [newMessage]);

  const wrapWithCodeBlock = () => {
    setNewMessage(`\`\`\`javascript\n${newMessage.trim()}\n\`\`\``);
  };

  return (
    <div className="w-full">
      {isMuted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-orange-500/10 border border-orange-500/20 rounded-[2rem] text-center"
        >
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Sesi Terbatas</h3>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
            Sinyal Anda dihentikan sementara hingga {new Date(user.muteUntil).toLocaleString()}
          </p>
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 inline-block text-left max-w-md mx-auto">
             <span className="text-[9px] font-black uppercase text-white/20 italic block mb-1">Alasan Moderator:</span>
             <p className="text-xs text-orange-200/70 italic">"{user.muteReason || 'Peringatan standar komunitas.'}"</p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Reply / Edit Context Bar */}
          <AnimatePresence>
            {(replyTo || editingMessage) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4"
              >
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${editingMessage ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      {editingMessage ? <Edit2 className="w-4 h-4" /> : <Reply className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {editingMessage ? 'Mengubah Pesan' : `Membalas ${replyTo.username}`}
                      </p>
                      <p className="text-sm text-white/70 line-clamp-1 italic">
                        {editingMessage ? editingMessage.content : replyTo.content}
                      </p>
                    </div>
                  </div>
                  <button onClick={editingMessage ? cancelEdit : cancelReply} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Code Detection Helper Banner */}
          <AnimatePresence>
            {appearsToBeCode && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mb-2 max-w-4xl mx-auto w-full px-3.5 py-1.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-between gap-2 shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                  <Code className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Terdeteksi potongan kode. Format otomatis dalam blok Markdown?</span>
                </div>
                <button
                  type="button"
                  onClick={wrapWithCodeBlock}
                  className="px-3 py-1 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  Format Kode
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Markdown & AI Quick Format Bar */}
          <div className="flex items-center gap-1.5 mb-2 px-2 max-w-4xl mx-auto w-full overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => insertText('```javascript\n// Tulis kode disini\n```')}
              className="px-2.5 py-1 rounded-xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[10px] font-bold text-[var(--theme-text-muted)] hover:text-cyan-400 flex items-center gap-1 transition-colors shrink-0"
              title="Sisipkan Blok Kode"
            >
              <Code className="w-3 h-3 text-cyan-400" />
              Kode
            </button>
            <button
              type="button"
              onClick={() => insertText('**', '**')}
              className="px-2.5 py-1 rounded-xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[10px] font-bold text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] flex items-center gap-1 transition-colors shrink-0"
              title="Tebal (Bold)"
            >
              <Bold className="w-3 h-3" />
              Tebal
            </button>
            <button
              type="button"
              onClick={() => insertText('@Saipul ')}
              className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[10px] font-bold text-purple-300 hover:text-pink-300 flex items-center gap-1 transition-colors shrink-0"
              title="Tanya AI Saipul langsung di room"
            >
              <Sparkles className="w-3 h-3 text-pink-400" />
              @Saipul AI
            </button>
            {onOpenPollModal && (
              <button
                type="button"
                onClick={onOpenPollModal}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 hover:text-teal-300 flex items-center gap-1 transition-colors shrink-0"
                title="Buat Jajak Pendapat"
              >
                <BarChart3 className="w-3 h-3 text-emerald-400" />
                Polling
              </button>
            )}
            {isCooldownActive && (
              <span className="ml-auto text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 animate-spin" /> Slowmode: {cooldownSeconds}s
              </span>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={editingMessage ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto w-full">
            <div className="flex flex-col gap-2 relative">
               <button 
                 type="button" 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={uploadingMedia}
                 className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-white/30 hover:text-white flex items-center justify-center"
               >
                 {uploadingMedia ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Paperclip className="w-5 h-5" />}
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileSelect}
               />
            </div>

            <div className="relative group/input flex-1">
              {isMaintenanceLocked ? (
                <div className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-8 py-5 flex items-center justify-center gap-3 backdrop-blur-xl">
                  <Lock className="w-4 h-4 text-white/30" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Papan Sinyal Dikunci Sementara</span>
                </div>
              ) : (
                <>
                  <div className="absolute left-4 bottom-3 z-10" ref={emojiPickerRef}>
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/30 hover:text-white"
                    >
                      <Smile className="w-6 h-6" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-16 left-0 z-50">
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme={theme === 'light' ? 'light' : 'dark'} width={300} height={400} />
                      </div>
                    )}
                  </div>

                  <MentionInput
                    value={newMessage}
                    onChange={(v) => {
                      setNewMessage(v);
                      handleTyping();
                    }}
                    onMention={(u) => {
                      console.log('Mentioned user:', u);
                    }}
                  />
                </>
              )}

              <div className={`absolute right-6 bottom-4 text-[10px] font-black tracking-tighter ${newMessage.length > 1000 ? 'text-red-500' : 'text-white/20'}`}>
                {newMessage.length}/1000
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || (!newMessage.trim() && !systemConfig.maintenance_mode) || 
                        isLimitReached || isMaintenanceLocked || isCooldownActive}
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                sending || !newMessage.trim() || isMaintenanceLocked || isCooldownActive
                  ? 'bg-white/[0.05] text-white/20' 
                  : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-cyan-500/30'
              }`}
            >
              {sending ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isCooldownActive ? (
                <span className="font-mono text-xs font-bold text-amber-300">{cooldownSeconds}s</span>
              ) : isMaintenanceLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 mb-2 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
              >
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span className="text-[10px] font-black uppercase text-red-200/70 tracking-widest">{error}</span>
                <button onClick={() => setError('')} className="ml-auto text-white/20 hover:text-white"><X className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex justify-between items-center px-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Limit Pesan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(user?.messageCount / limit) * 100}%` }}
                      className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                    />
                  </div>
                  <span className="text-[10px] font-black text-cyan-400">{user?.messageCount}/{limit}</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-black uppercase tracking-tighter text-white/20">
              Shift + Enter: ganti baris • @Saipul: panggil bot AI
            </div>
          </div>
        </>
      )}
    </div>
  );
};
