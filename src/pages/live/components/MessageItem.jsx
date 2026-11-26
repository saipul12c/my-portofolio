import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Reply, 
  Copy, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Check, 
  Clock, 
  Smile, 
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { PollCard } from './PollCard';
import { ReactionPicker, MessageReactions } from './ReactionPicker';

export const MessageItem = memo(({
  message,
  showDateDivider,
  currentDate,
  isOwnMessage,
  alignRight,
  replyData,
  user,
  userRoles,
  reactions,
  activeReactionPicker,
  isHighlighted,
  onReply,
  onStartEdit,
  onDelete,
  onCopy,
  onReport,
  onToggleBestAnswer,
  onToggleReaction,
  onSetActiveReactionPicker,
  onVotePoll,
  onOpenLightbox,
  formatTime
}) => {
  const [showMobileActions, setShowMobileActions] = useState(false);

  const handleDragEnd = (event, info) => {
    // Swipe-to-reply: If dragged to the right by > 45px
    if (info.offset.x > 45 && onReply) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      onReply(message);
    }
  };

  const roleConfig = userRoles[message.role || 'USER'] || userRoles.USER;

  return (
    <React.Fragment>
      {showDateDivider && (
        <div className="flex items-center justify-center my-3">
          <span className="px-3.5 py-1 rounded-full bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] shadow-sm backdrop-blur-md">
            {currentDate}
          </span>
        </div>
      )}

      <motion.div
        id={`msg-${message.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={`flex w-full ${alignRight ? 'justify-end' : 'justify-start'} [transform:translateZ(0)] ${
          isHighlighted ? 'ring-4 ring-cyan-400/80 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all' : ''
        }`}
      >
        <div className={`group flex flex-col max-w-[85%] sm:max-w-xl lg:max-w-2xl ${alignRight ? 'items-end' : 'items-start'}`}>
          {/* Sender Info (Only for others) */}
          {!alignRight && (
            <div className="flex items-center gap-2 mb-1.5 ml-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0">
                {message.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-[11px] font-bold text-[var(--theme-text-muted)] tracking-wider uppercase">
                {message.username}
              </span>
            </div>
          )}

          {/* Bubble Container with Swipe-to-Reply & Actions */}
          <div className="relative group/bubble flex items-center gap-1.5 sm:gap-2 w-full">
            {/* Actions Overlay for Own Message (Desktop hover + Mobile toggle) */}
            {isOwnMessage && user && (
              <div className={`${
                showMobileActions ? 'flex opacity-100' : 'hidden'
              } sm:flex sm:opacity-0 sm:group-hover/bubble:opacity-100 sm:focus-within:opacity-100 transition-opacity items-center gap-1 mr-1 bg-[var(--theme-surface)] backdrop-blur-md rounded-xl p-1 border border-[var(--theme-border)] order-first shrink-0 shadow-lg`}>
                <button 
                  onClick={() => {
                    onCopy(message.content);
                    setShowMobileActions(false);
                  }} 
                  className="p-1.5 hover:bg-[var(--theme-surface-hover)] rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors" 
                  title="Salin Pesan"
                >
                  <Copy className="w-3.5 h-3.5"/>
                </button>
                <button 
                  onClick={() => {
                    onStartEdit(message);
                    setShowMobileActions(false);
                  }} 
                  className="p-1.5 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors" 
                  title="Edit Pesan"
                >
                  <Edit2 className="w-3.5 h-3.5"/>
                </button>
                <button 
                  onClick={() => {
                    onDelete(message);
                    setShowMobileActions(false);
                  }} 
                  className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" 
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            )}

            {/* Swipe gesture container */}
            <motion.div
              drag={!alignRight ? "x" : false}
              dragConstraints={{ left: 0, right: 60 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="relative group/bubble-content cursor-grab active:cursor-grabbing max-w-full"
            >
              {/* Swipe to reply reveal icon */}
              {!alignRight && (
                <div className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-active:opacity-80 transition-opacity text-cyan-400">
                  <Reply className="w-4 h-4 animate-pulse" />
                </div>
              )}

              {/* Actual Message Bubble */}
              <div className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-2xl sm:rounded-[1.5rem] lg:rounded-[2rem] shadow-xl transition-colors duration-150 ${
                alignRight 
                  ? 'bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white rounded-tr-none border border-cyan-400/20 shadow-[0_4px_20px_rgba(6,182,212,0.2)]' 
                  : 'bg-[var(--theme-surface)]/95 backdrop-blur-md border border-[var(--theme-border)] text-[var(--theme-text)] shadow-md rounded-tl-none hover:border-cyan-500/30'
              }`}>
                {/* Best Answer Solved Badge */}
                {message.is_best_answer && (
                  <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Solusi Terverifikasi
                  </div>
                )}

                {/* Role Badge for Others */}
                {!isOwnMessage && (
                  <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-[var(--theme-border)]">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${roleConfig?.color || 'from-gray-500 to-gray-700'} text-white shadow-sm`}>
                      {roleConfig?.badge} {roleConfig?.name}
                    </span>
                  </div>
                )}

                {/* Media Display with Lightbox Trigger */}
                {message.media_url && /^https?:\/\//i.test(message.media_url) && !/javascript:/i.test(message.media_url) && (
                  <div 
                    onClick={() => onOpenLightbox(message.media_url)}
                    className="mb-2.5 rounded-2xl overflow-hidden border border-[var(--theme-border)] bg-black/20 cursor-pointer group/media relative"
                  >
                    <img 
                      src={message.media_url} 
                      alt="Shared media" 
                      loading="lazy"
                      className="w-full h-auto max-h-[300px] object-contain transition-transform duration-300 group-hover/media:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Perbesar
                      </span>
                    </div>
                  </div>
                )}

                {/* Reply Context Bar */}
                {replyData && (
                  <div className={`mb-2.5 p-2 sm:p-2.5 rounded-xl border-l-4 text-xs ${
                    alignRight ? 'bg-black/20 border-white/40 text-white/80' : 'bg-[var(--theme-surface-hover)] border-cyan-500/60 text-[var(--theme-text-muted)]'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Reply className="w-3 h-3 text-cyan-400" />
                      <span className="font-black uppercase tracking-tighter text-[10px]">{replyData.username}</span>
                    </div>
                    <p className="italic line-clamp-1 text-[11px]">{replyData.content}</p>
                  </div>
                )}
                
                {/* Markdown & Code Block Formatted Content */}
                <div className="text-xs sm:text-sm lg:text-base leading-relaxed break-words">
                  <MarkdownRenderer
                    content={message.content}
                    alignRight={alignRight}
                    currentUsername={user?.username}
                  />
                  {message.is_edited && <span className="text-[9px] italic opacity-50 ml-1.5">(diedit)</span>}
                </div>

                {/* Poll Card Display */}
                {message.poll_data && (
                  <PollCard
                    poll={message.poll_data}
                    onVote={onVotePoll}
                    currentUser={user}
                    alignRight={alignRight}
                  />
                )}
                
                {/* Delivery Time, Status Checkmarks & Mobile Menu Trigger */}
                <div className={`mt-1.5 sm:mt-2 flex items-center justify-end gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-tight uppercase ${alignRight ? 'text-white/60' : 'text-[var(--theme-text-muted)]'}`}>
                  <span>{formatTime(message.timestamp || message.created_at)}</span>
                  
                  {alignRight && (
                    <span className="inline-flex items-center ml-0.5">
                      {message.status === 'sending' ? (
                        <div className="w-2.5 h-2.5 border border-white/40 border-t-white rounded-full animate-spin" />
                      ) : message.status === 'sent' ? (
                        <Check className="w-3 h-3 text-white/80" />
                      ) : (
                        <span className="flex items-center text-cyan-300 font-bold" title="Delivered">
                          <Check className="w-3 h-3" />
                          <Check className="w-3 h-3 -ml-2" />
                        </span>
                      )}
                    </span>
                  )}

                  {/* Mobile-only 3-dots Action Toggle Button */}
                  {user && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMobileActions(prev => !prev);
                      }}
                      className="sm:hidden p-0.5 rounded text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] opacity-70 active:opacity-100 transition-opacity ml-1"
                      title="Menu Aksi Pesan"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Reactions Display */}
                <MessageReactions 
                  reactions={reactions} 
                  onReact={(emoji) => onToggleReaction(message.id, emoji)}
                  currentUser={user}
                />
              </div>

              {/* Reaction Trigger Button (Accessible on Mobile & Floating on Desktop Hover) */}
              {user && (
                <div className={`absolute -bottom-2.5 ${alignRight ? '-left-2' : '-right-2'} opacity-80 sm:opacity-0 sm:group-hover/bubble-content:opacity-100 transition-opacity z-10`}>
                  <button 
                    onClick={() => onSetActiveReactionPicker(message.id)}
                    className="p-1 sm:p-1.5 bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] rounded-full text-[var(--theme-text-muted)] hover:text-yellow-400 hover:scale-110 shadow-lg active:scale-95 transition-all"
                    title="Beri Reaksi"
                  >
                    <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <ReactionPicker 
                    isOpen={activeReactionPicker === message.id}
                    onClose={() => onSetActiveReactionPicker(null)}
                    onSelect={(emoji) => onToggleReaction(message.id, emoji)}
                    position={alignRight ? 'left' : 'right'}
                  />
                </div>
              )}
            </motion.div>

            {/* Actions Overlay for Others (Desktop hover + Mobile toggle) */}
            {!isOwnMessage && user && (
              <div className={`${
                showMobileActions ? 'flex opacity-100' : 'hidden'
              } sm:flex sm:opacity-0 sm:group-hover/bubble:opacity-100 sm:focus-within:opacity-100 transition-opacity items-center gap-1 ml-1 bg-[var(--theme-surface)] backdrop-blur-md rounded-xl p-1 border border-[var(--theme-border)] shrink-0 shadow-lg`}>
                <button 
                  onClick={() => {
                    onReply(message);
                    setShowMobileActions(false);
                  }} 
                  className="p-1.5 hover:bg-[var(--theme-surface-hover)] rounded-lg text-cyan-400 hover:text-[var(--theme-text)] transition-colors" 
                  title="Balas Pesan"
                >
                  <Reply className="w-3.5 h-3.5"/>
                </button>
                <button 
                  onClick={() => {
                    onCopy(message.content);
                    setShowMobileActions(false);
                  }} 
                  className="p-1.5 hover:bg-[var(--theme-surface-hover)] rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors" 
                  title="Salin Pesan"
                >
                  <Copy className="w-3.5 h-3.5"/>
                </button>
                <button 
                  onClick={() => {
                    onToggleBestAnswer(message);
                    setShowMobileActions(false);
                  }} 
                  className={`p-1.5 rounded-lg transition-colors ${
                    message.is_best_answer 
                      ? 'bg-emerald-500/30 text-emerald-300' 
                      : 'hover:bg-emerald-500/10 text-[var(--theme-text-muted)] hover:text-emerald-400'
                  }`} 
                  title={message.is_best_answer ? 'Batalkan Solusi Terbaik' : 'Tandai Solusi Terbaik'}
                >
                  <CheckCircle className="w-3.5 h-3.5"/>
                </button>
                <button 
                  onClick={() => {
                    onReport(message);
                    setShowMobileActions(false);
                  }} 
                  className="p-1.5 hover:bg-orange-500/20 rounded-lg text-orange-400 transition-colors" 
                  title="Laporkan Pesan"
                >
                  <AlertTriangle className="w-3.5 h-3.5"/>
                </button>
                {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                  <button 
                    onClick={() => {
                      onDelete(message);
                      setShowMobileActions(false);
                    }} 
                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" 
                    title="Hapus (Admin)"
                  >
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  );
}, (prevProps, nextProps) => {
  // Ultra-efficient memo comparator: Only re-render if visual state actually changed
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.is_edited === nextProps.message.is_edited &&
    prevProps.message.is_best_answer === nextProps.message.is_best_answer &&
    prevProps.message.poll_data === nextProps.message.poll_data &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.activeReactionPicker === nextProps.activeReactionPicker &&
    prevProps.reactions === nextProps.reactions &&
    prevProps.showDateDivider === nextProps.showDateDivider &&
    prevProps.alignRight === nextProps.alignRight &&
    prevProps.isOwnMessage === nextProps.isOwnMessage &&
    prevProps.replyData === nextProps.replyData &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.user?.role === nextProps.user?.role
  );
});