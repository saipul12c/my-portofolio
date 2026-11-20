import React, { lazy, Suspense } from 'react';
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
import { MentionInput } from './MentionInput';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

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
  // Smart Code Snippet Detection
  const appearsToBeCode = React.useMemo(() => {
    if (!newMessage || newMessage.includes('```')) return false;
    const codeKeywords = /\b(const|let|var|function|return|import|export|class|def|for|while|console\.log|<div|<\/)\b/;
    return newMessage.split('\n').length > 1 && codeKeywords.test(newMessage);
  }, [newMessage]);

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

  const wrapWithCodeBlock = () => {
    setNewMessage(`\`\`\`javascript\n${newMessage.trim()}\n\`\`\``);
  };

  return (
    <div className="w-full">
      {isMuted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 bg-orange-500/10 border border-orange-500/20 rounded-[2rem] text-center"
        >
          <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-black text-[var(--theme-text)] italic uppercase tracking-tighter mb-2">Sesi Terbatas</h3>
          <p className="text-[10px] font-bold text-[var(--theme-text-muted)] uppercase tracking-widest mb-4">
            Sinyal Anda dihentikan sementara hingga {new Date(user.muteUntil).toLocaleString()}
          </p>
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 inline-block text-left max-w-md mx-auto">
             <span className="text-[9px] font-black uppercase text-orange-400 italic block mb-1">Alasan Moderator:</span>
             <p className="text-xs text-orange-200/80 italic">"{user.muteReason || 'Peringatan standar komunitas.'}"</p>
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
                className="mb-3"
              >
                <div className="flex items-center justify-between p-3 sm:p-4 bg-[var(--theme-surface-hover)] rounded-2xl sm:rounded-3xl border border-[var(--theme-border)] shadow-md">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${editingMessage ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      {editingMessage ? <Edit2 className="w-4 h-4" /> : <Reply className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--theme-text-muted)]">
                        {editingMessage ? 'Mengubah Pesan' : `Membalas @${replyTo.username}`}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--theme-text)] line-clamp-1 italic">
                        {editingMessage ? editingMessage.content : replyTo.content}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={editingMessage ? cancelEdit : cancelReply} 
                    className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-colors text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] shrink-0"
                    title="Batalkan"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 rotate-45" />
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
                className="mb-2 max-w-4xl mx-auto w-full px-3.5 py-2 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-between gap-2 shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-[11px] sm:text-xs min-w-0">
                  <Code className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Terdeteksi potongan kode. Format otomatis dalam blok Markdown?</span>
                </div>
                <button
                  type="button"
                  onClick={wrapWithCodeBlock}
                  className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  Format Kode
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Markdown & AI Quick Format Bar (Mobile-friendly horizontal scroll) */}
          <div className="flex items-center gap-1.5 mb-2 px-1 max-w-4xl mx-auto w-full overflow-x-auto scrollbar-none py-0.5">
            <button
              type="button"
              onClick={() => insertText('```javascript\n// Tulis kode disini\n```')}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[10px] sm:text-xs font-bold text-[var(--theme-text-muted)] hover:text-cyan-400 active:scale-95 flex items-center gap-1.5 transition-all shrink-0 min-h-[32px]"
              title="Sisipkan Blok Kode"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kode</span>
            </button>
            <button
              type="button"
              onClick={() => insertText('**', '**')}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[10px] sm:text-xs font-bold text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] active:scale-95 flex items-center gap-1.5 transition-all shrink-0 min-h-[32px]"
              title="Tebal (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
              <span>Tebal</span>
            </button>
            <button
              type="button"
              onClick={() => insertText('@Saipul ')}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[10px] sm:text-xs font-bold text-purple-300 hover:text-pink-300 active:scale-95 flex items-center gap-1.5 transition-all shrink-0 min-h-[32px]"
              title="Tanya AI Saipul langsung di room"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>@Saipul AI</span>
            </button>
            {onOpenPollModal && (
              <button
                type="button"
                onClick={onOpenPollModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-xs font-bold text-emerald-300 hover:text-teal-300 active:scale-95 flex items-center gap-1.5 transition-all shrink-0 min-h-[32px]"
                title="Buat Jajak Pendapat / Polling"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Polling</span>
              </button>
            )}
            {isCooldownActive && (
              <span className="ml-auto text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Slowmode: {cooldownSeconds}s
              </span>
            )}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={editingMessage ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSendMessage} 
            className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto w-full"
          >
            {/* Attachment Button */}
            <div className="flex flex-col gap-2 relative shrink-0">
               <button 
                 type="button" 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={uploadingMedia}
                 className="w-11 h-11 sm:w-12 sm:h-12 bg-[var(--theme-surface-hover)] hover:bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] transition-all text-[var(--theme-text-muted)] hover:text-cyan-400 active:scale-95 flex items-center justify-center shadow-sm disabled:opacity-50"
                 title="Kirim Gambar / Lampiran"
               >
                 {uploadingMedia ? (
                   <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
                 ) : (
                   <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                 )}
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileSelect}
               />
            </div>

            {/* Message Textarea Container */}
            <div className="relative group/input flex-1 min-w-0">
              {isMaintenanceLocked ? (
                <div className="w-full bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl sm:rounded-3xl px-6 py-4 flex items-center justify-center gap-3 backdrop-blur-xl">
                  <Lock className="w-4 h-4 text-[var(--theme-text-muted)]" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[var(--theme-text-muted)] italic">
                    Papan Sinyal Dikunci Sementara
                  </span>
                </div>
              ) : (
                <>
                  <div className="absolute left-3 sm:left-4 bottom-2.5 sm:bottom-3 z-10" ref={emojiPickerRef}>
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-colors text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] active:scale-95"
                      title="Pilih Emoji"
                    >
                      <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-14 left-0 z-50">
                        <Suspense fallback={
                          <div className="w-[280px] sm:w-[320px] h-[300px] bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl flex items-center justify-center text-xs text-[var(--theme-text-muted)] shadow-2xl">
                            Memuat Emoji...
                          </div>
                        }>
                          <EmojiPicker 
                            onEmojiClick={handleEmojiClick} 
                            theme={theme === 'light' ? 'light' : 'dark'} 
                            width={window.innerWidth < 640 ? 280 : 320} 
                            height={380} 
                          />
                        </Suspense>
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

              {/* Character Limit Indicator */}
              <div className={`absolute right-4 bottom-3 sm:bottom-4 text-[9px] sm:text-[10px] font-black tracking-tight ${
                newMessage.length > 1000 ? 'text-red-400 font-bold' : 'text-[var(--theme-text-muted)] opacity-60'
              }`}>
                {newMessage.length}/1000
              </div>
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || (!newMessage.trim() && !systemConfig.maintenance_mode) || 
                        isLimitReached || isMaintenanceLocked || isCooldownActive}
              className={`flex-shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl sm:rounded-full flex items-center justify-center shadow-xl transition-all ${
                sending || !newMessage.trim() || isMaintenanceLocked || isCooldownActive
                  ? 'bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] border border-[var(--theme-border)] opacity-60 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-cyan-500/25 cursor-pointer'
              }`}
              title={editingMessage ? 'Simpan Perubahan' : 'Kirim Sinyal'}
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isCooldownActive ? (
                <span className="font-mono text-[10px] sm:text-xs font-black text-amber-300">{cooldownSeconds}s</span>
              ) : isMaintenanceLocked ? (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </motion.button>
          </form>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 mb-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-3 sm:p-4 flex items-center gap-3"
              >
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase text-red-200/80 tracking-wide flex-1">
                  {error}
                </span>
                <button 
                  onClick={() => setError('')} 
                  className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] p-1 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Info Bar: Message Limit & Shortcuts */}
          <div className="mt-2.5 flex justify-between items-center px-2 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black tracking-wider text-[var(--theme-text-muted)]">
                  Limit Sinyal
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-20 h-1.5 bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((user?.messageCount || 0) / limit) * 100)}%` }}
                      className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black text-cyan-400">
                    {user?.messageCount || 0}/{limit}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-[9px] font-bold uppercase tracking-wider text-[var(--theme-text-muted)] opacity-60">
              Shift + Enter: ganti baris • @Saipul: panggil bot AI
            </div>
          </div>
        </>
      )}
    </div>
  );
};