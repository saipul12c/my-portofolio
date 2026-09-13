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
  X 
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
  setError
}) => {
  if (!user) return null;

  const isMuted = user.muteUntil && new Date(user.muteUntil) > new Date();
  const limit = systemConfig.message_limits[user.role] || 5;
  const isLimitReached = !editingMessage && user.messageCount >= limit;
  const isMaintenanceLocked = systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role);

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

              <div className={`absolute right-6 bottom-4 text-[10px] font-black tracking-tighter ${newMessage.length > 500 ? 'text-red-500' : 'text-white/20'}`}>
                {newMessage.length}/500
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || (!newMessage.trim() && !systemConfig.maintenance_mode) || 
                        isLimitReached || isMaintenanceLocked}
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                sending || !newMessage.trim() || isMaintenanceLocked
                  ? 'bg-white/[0.05] text-white/20' 
                  : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-cyan-500/30'
              }`}
            >
              {sending ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
              Pencet Shift + Enter untuk ganti baris
            </div>
          </div>
        </>
      )}
    </div>
  );
};
