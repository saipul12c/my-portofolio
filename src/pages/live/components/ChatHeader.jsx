import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users as UsersIcon, 
  LayoutDashboard, 
  UserCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor,
  Search,
  Trophy,
  Sparkles,
  BarChart3,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const ChatHeader = ({
  connectionStatus,
  onlineUsers,
  user,
  getRoleBadge,
  theme,
  setTheme,
  setShowMembers,
  unreadMentions,
  setShowNotifications,
  setUnreadMentions,
  goToDashboard,
  openProfileEditor,
  handleAuthAction,
  onOpenSearch,
  onOpenLeaderboard,
  onOpenSummarizer,
  onOpenPollModal,
  soundEnabled = true,
  onToggleSound
}) => {
  return (
    <div className="z-50 p-2 sm:p-4 w-full flex-shrink-0">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto w-full transition-all duration-500 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] backdrop-blur-2xl py-2.5 sm:py-3.5 px-3 sm:px-8 shadow-xl"
      >
        <div className="flex justify-between items-center gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-xl font-bold text-[var(--theme-text)] tracking-tight leading-tight truncate">Sinyal Live</h1>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'online' ? 'bg-[var(--theme-accent)] animate-pulse shadow-[0_0_10px_var(--theme-accent)]' : 'bg-red-500'}`} />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-[var(--theme-text-muted)] truncate">
                  {Object.keys(onlineUsers).length} <span className="hidden xs:inline">Signals</span> Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-6 shrink-0">
            {/* Quick Action Tools: Search, AI Summarize, Poll, Leaderboard */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 p-1 bg-[var(--theme-surface-hover)]/70 rounded-2xl border border-[var(--theme-border)]">
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-cyan-400"
                  title="Cari Pesan & Kode (Ctrl+F)"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {onOpenSummarizer && (
                <button
                  type="button"
                  onClick={onOpenSummarizer}
                  className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-purple-400 hover:text-pink-400"
                  title="Rangkum Diskusi dengan AI"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {onOpenPollModal && user && (
                <button
                  type="button"
                  onClick={onOpenPollModal}
                  className="hidden sm:flex p-1.5 sm:p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-emerald-400 hover:text-teal-300"
                  title="Buat Jajak Pendapat / Polling"
                >
                  <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {onOpenLeaderboard && (
                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-amber-400 hover:text-orange-300"
                  title="Papan Peringkat Sinyal"
                >
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Online Users Avatar Stack */}
            <div className="hidden lg:flex items-center -space-x-3">
              {Object.values(onlineUsers).slice(0, 4).map((u, i) => (
                <motion.div 
                  key={u.id || u.username || i}
                  initial={{ scale: 0, x: 10 }}
                  animate={{ scale: 1, x: 0 }}
                  className="w-8 h-8 rounded-full border-2 border-[#020617] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-white/5" 
                  title={u.username}
                >
                  {u.username?.[0]?.toUpperCase()}
                </motion.div>
              ))}
              {Object.keys(onlineUsers).length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-[var(--theme-bg)] bg-[var(--theme-surface)] backdrop-blur-md flex items-center justify-center text-[9px] font-black text-[var(--theme-text-muted)] ring-1 ring-[var(--theme-border)] uppercase">
                  +{Object.keys(onlineUsers).length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-4">
              {user && (
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-xs font-black text-[var(--theme-text)] italic uppercase tracking-tighter">{user.username}</span>
                  <div className="flex items-center gap-1 opacity-70">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-0.5 sm:gap-1.5 p-1 sm:p-1.5 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] backdrop-blur-xl">
                {/* Theme Switcher */}
                <button 
                  onClick={() => setTheme(prev => prev === 'default' ? 'light' : prev === 'light' ? 'dark' : 'default')}
                  className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                  title={`Tema: ${theme}`}
                >
                   {theme === 'default' ? <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : theme === 'dark' ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>

                {/* Sound Effects Toggle */}
                {onToggleSound && (
                  <button 
                    type="button"
                    onClick={onToggleSound}
                    className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                    title={soundEnabled ? 'Efek Suara: Aktif' : 'Efek Suara: Senyap'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-40" />
                    )}
                  </button>
                )}

                {user && (
                  <div className="flex items-center gap-0.5 sm:gap-2 pr-0.5 sm:pr-2 border-r border-[var(--theme-border)] mr-0.5 sm:mr-2">
                     <button 
                        onClick={() => setShowMembers(true)}
                        className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                        title="Lihat Anggota"
                     >
                        <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                     </button>
                     <NotificationCenter 
                        unreadCount={unreadMentions} 
                        onOpen={() => {
                          setShowNotifications(true);
                          setUnreadMentions(0);
                        }} 
                     />
                  </div>
                )}

                {user && ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role) && (
                  <button onClick={goToDashboard} className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-accent)] hover:scale-110" title="Dashboard">
                    <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
                
                {user && (
                  <button onClick={() => openProfileEditor(user)} className="p-1.5 sm:p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-accent)] hover:scale-110" title="Edit Profile">
                    <UserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}

                <button 
                  onClick={handleAuthAction}
                  className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] rounded-xl sm:rounded-2xl transition-all border border-[var(--theme-border)] text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                  title={user ? 'Keluar' : 'Masuk'}
                >
                  <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{user ? 'Exit' : 'Join'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
};
