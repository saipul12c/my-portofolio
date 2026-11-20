import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  VolumeX,
  X,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const ChatHeader = ({
  connectionStatus,
  onlineUsers = {},
  user,
  getRoleBadge,
  theme,
  setTheme,
  setShowMembers,
  unreadMentions = 0,
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const onlineCount = Object.keys(onlineUsers).length;
  const isAdminOrMod = user && ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role);

  return (
    <>
      <div className="z-40 p-2 sm:p-4 w-full flex-shrink-0">
        <motion.header 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-6xl mx-auto w-full rounded-2xl sm:rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/95 backdrop-blur-2xl py-2 sm:py-3 px-3 sm:px-6 shadow-xl"
        >
          <div className="flex justify-between items-center gap-2">
            {/* Logo & Online Status */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-lg font-black text-[var(--theme-text)] tracking-tight leading-none truncate">
                    Sinyal Live
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    connectionStatus === 'online' 
                      ? 'bg-[var(--theme-accent)] animate-pulse shadow-[0_0_8px_var(--theme-accent)]' 
                      : 'bg-red-500'
                  }`} />
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold text-[var(--theme-text-muted)] truncate">
                    {onlineCount} <span className="hidden xs:inline">Aktif</span>
                  </span>
                </div>
              </div>

              {/* Online Users Avatar Stack (Desktop lg+) */}
              <div className="hidden lg:flex items-center -space-x-2.5 ml-2">
                {Object.values(onlineUsers).slice(0, 4).map((u, i) => (
                  <div 
                    key={u.id || u.username || i}
                    className="w-7 h-7 rounded-full border-2 border-[var(--theme-surface)] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-black text-white ring-1 ring-white/10 shrink-0 shadow-sm" 
                    title={u.username}
                  >
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                ))}
                {onlineCount > 4 && (
                  <div className="w-7 h-7 rounded-full border-2 border-[var(--theme-surface)] bg-[var(--theme-surface-hover)] flex items-center justify-center text-[8px] font-black text-[var(--theme-text-muted)] ring-1 ring-[var(--theme-border)]">
                    +{onlineCount - 4}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Center: Core Interactive Tools Bar */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-[var(--theme-surface-hover)]/70 rounded-2xl border border-[var(--theme-border)]">
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="px-2.5 py-1.5 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-cyan-400 flex items-center gap-1.5 text-xs font-bold"
                  title="Cari Pesan & Kode (Ctrl+F)"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cari</span>
                  <kbd className="hidden lg:inline-block px-1.5 py-0.2 bg-black/20 rounded text-[9px] font-mono text-[var(--theme-text-muted)] border border-white/5">
                    Ctrl+F
                  </kbd>
                </button>
              )}

              {onOpenSummarizer && (
                <button
                  type="button"
                  onClick={onOpenSummarizer}
                  className="px-2.5 py-1.5 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-purple-400 hover:text-pink-300 flex items-center gap-1.5 text-xs font-bold"
                  title="Rangkum Percakapan dengan AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Rangkum AI</span>
                </button>
              )}

              {onOpenPollModal && user && (
                <button
                  type="button"
                  onClick={onOpenPollModal}
                  className="px-2.5 py-1.5 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-emerald-400 hover:text-teal-300 flex items-center gap-1.5 text-xs font-bold"
                  title="Buat Jajak Pendapat / Polling"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Polling</span>
                </button>
              )}

              {onOpenLeaderboard && (
                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className="px-2.5 py-1.5 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-amber-400 hover:text-yellow-300 flex items-center gap-1.5 text-xs font-bold"
                  title="Papan Peringkat Sinyal"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Peringkat</span>
                </button>
              )}
            </div>

            {/* Desktop Right Cluster: Utilities + User Profile Card */}
            <div className="hidden md:flex items-center gap-2">
              {/* System Utilities (Theme, Sound, Members, Notifications) */}
              <div className="flex items-center gap-1 p-1 bg-[var(--theme-surface-hover)]/70 rounded-2xl border border-[var(--theme-border)]">
                {/* Theme Selector */}
                <button 
                  onClick={() => setTheme(prev => prev === 'default' ? 'light' : prev === 'light' ? 'dark' : 'default')}
                  className="p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                  title={`Tema: ${theme === 'default' ? 'Sistem' : theme === 'dark' ? 'Gelap' : 'Terang'}`}
                >
                  {theme === 'default' ? <Monitor className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>

                {/* Sound Toggle */}
                {onToggleSound && (
                  <button 
                    type="button"
                    onClick={onToggleSound}
                    className="p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                    title={soundEnabled ? 'Efek Suara: Aktif' : 'Efek Suara: Senyap'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                )}

                {/* Members List Toggle */}
                {user && (
                  <button 
                    onClick={() => setShowMembers(true)}
                    className="p-2 hover:bg-[var(--theme-surface)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                    title="Daftar Anggota"
                  >
                    <UsersIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Notification Bell */}
                {user && (
                  <NotificationCenter 
                    unreadCount={unreadMentions} 
                    onOpen={() => {
                      setShowNotifications(true);
                      setUnreadMentions(0);
                    }} 
                  />
                )}
              </div>

              {/* Logged In User Profile Badge & Actions */}
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Unified User Badge (Click to open profile) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openProfileEditor(user)}
                    className="flex items-center gap-2.5 py-1 px-2.5 bg-[var(--theme-surface-hover)] hover:bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] transition-all cursor-pointer group text-left"
                    title="Klik untuk Edit Profil & Status"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--theme-surface)]" />
                    </div>
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-xs font-black text-[var(--theme-text)] tracking-tight truncate max-w-[110px] group-hover:text-cyan-400 transition-colors">
                        {user.username}
                      </span>
                      <div className="flex items-center gap-1">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                  </motion.button>

                  {/* Admin Dashboard Button (if authorized) */}
                  {isAdminOrMod && (
                    <button 
                      onClick={goToDashboard} 
                      className="p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl border border-[var(--theme-border)] text-cyan-400 hover:text-cyan-300 transition-all hover:scale-105" 
                      title="Buka Dashboard Admin"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  )}

                  {/* Exit / Logout Button */}
                  <button 
                    onClick={handleAuthAction}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[var(--theme-surface-hover)] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl transition-all border border-[var(--theme-border)] text-xs font-bold text-[var(--theme-text-muted)]"
                    title="Keluar dari Akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                /* Guest Join / Login Button */
                <button 
                  onClick={handleAuthAction}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>Masuk</span>
                </button>
              )}
            </div>

            {/* Mobile Header Right Bar (< 768px): Clean, Spacious & Touch-Optimized */}
            <div className="flex md:hidden items-center gap-1.5">
              {/* Search Button */}
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] active:text-cyan-400 active:scale-95 transition-all"
                  title="Cari Pesan"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* AI Summarize Button */}
              {onOpenSummarizer && (
                <button
                  type="button"
                  onClick={onOpenSummarizer}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 active:text-pink-300 active:scale-95 transition-all"
                  title="Rangkum AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}

              {/* Notification Center */}
              {user && (
                <div className="relative">
                  <NotificationCenter 
                    unreadCount={unreadMentions} 
                    onOpen={() => {
                      setShowNotifications(true);
                      setUnreadMentions(0);
                    }} 
                  />
                </div>
              )}

              {/* User Avatar Menu Trigger (Mobile) */}
              {user ? (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowMobileMenu(true)}
                  className="flex items-center gap-1 p-1 bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] rounded-xl active:border-cyan-500/50"
                  title="Menu Akun & Pengaturan"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                </motion.button>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20"
                >
                  Masuk
                </button>
              )}
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile Quick Menu / Bottom Sheet (< 768px) */}
      <AnimatePresence>
        {showMobileMenu && user && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-[var(--theme-surface)] border-t border-[var(--theme-border)] rounded-t-[2.5rem] shadow-2xl p-5 pb-8 flex flex-col gap-4"
            >
              {/* Sheet Drag Handle */}
              <div className="w-12 h-1.5 bg-[var(--theme-border)] rounded-full mx-auto -mt-1 opacity-60" />

              {/* User Profile Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-cyan-500/20">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-[var(--theme-text)] tracking-tight">
                      {user.username}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getRoleBadge(user.role)}
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-xl bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions List (Min 44px touch targets) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--theme-text-muted)] px-1">
                  Aksi Cepat
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    openProfileEditor(user);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[var(--theme-surface-hover)]/70 border border-[var(--theme-border)] active:scale-[0.98] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--theme-text)]">Edit Profil & Biodata</div>
                      <div className="text-[10px] text-[var(--theme-text-muted)]">Perbarui nama, avatar, atau bio</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--theme-text-muted)]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowMembers(true);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[var(--theme-surface-hover)]/70 border border-[var(--theme-border)] active:scale-[0.98] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <UsersIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--theme-text)]">Daftar Anggota Online</div>
                      <div className="text-[10px] text-[var(--theme-text-muted)]">{onlineCount} anggota aktif saat ini</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--theme-text-muted)]" />
                </button>

                {onOpenLeaderboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenLeaderboard();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[var(--theme-surface-hover)]/70 border border-[var(--theme-border)] active:scale-[0.98] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--theme-text)]">Papan Peringkat Sinyal</div>
                        <div className="text-[10px] text-[var(--theme-text-muted)]">Poin keaktifan & lencana komunitas</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-muted)]" />
                  </button>
                )}

                {onOpenPollModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenPollModal();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[var(--theme-surface-hover)]/70 border border-[var(--theme-border)] active:scale-[0.98] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--theme-text)]">Buat Jajak Pendapat / Polling</div>
                        <div className="text-[10px] text-[var(--theme-text-muted)]">Minta pendapat anggota komunitas</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-muted)]" />
                  </button>
                )}

                {isAdminOrMod && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      goToDashboard();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 active:scale-[0.98] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-cyan-300">Dashboard Manajemen</div>
                        <div className="text-[10px] text-cyan-400/70">Panel kontrol moderator & admin</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </button>
                )}
              </div>

              {/* System Preferences (Theme & Sound) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--theme-border)]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--theme-text-muted)] px-1">
                  Preferensi Tampilan & Audio
                </span>

                {/* Theme 3-way toggle */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--theme-surface-hover)] rounded-2xl border border-[var(--theme-border)]">
                  <button
                    type="button"
                    onClick={() => setTheme('default')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'default' 
                        ? 'bg-[var(--theme-surface)] text-cyan-400 shadow-sm border border-[var(--theme-border)]' 
                        : 'text-[var(--theme-text-muted)]'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Sistem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'dark' 
                        ? 'bg-[var(--theme-surface)] text-cyan-400 shadow-sm border border-[var(--theme-border)]' 
                        : 'text-[var(--theme-text-muted)]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Gelap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'light' 
                        ? 'bg-[var(--theme-surface)] text-cyan-400 shadow-sm border border-[var(--theme-border)]' 
                        : 'text-[var(--theme-text-muted)]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Terang</span>
                  </button>
                </div>

                {/* Sound toggle button */}
                {onToggleSound && (
                  <button
                    type="button"
                    onClick={onToggleSound}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[var(--theme-surface-hover)]/70 border border-[var(--theme-border)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${soundEnabled ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-[var(--theme-text-muted)]'}`}>
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-[var(--theme-text)]">Efek Suara Notifikasi</div>
                        <div className="text-[10px] text-[var(--theme-text-muted)]">
                          {soundEnabled ? 'Suara aktif untuk kirim/terima pesan' : 'Semua suara dimatikan'}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      soundEnabled ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-[var(--theme-text-muted)]'
                    }`}>
                      {soundEnabled ? 'Aktif' : 'Senyap'}
                    </span>
                  </button>
                )}
              </div>

              {/* Logout Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleAuthAction();
                  }}
                  className="w-full py-3.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-2xl flex items-center justify-center gap-2 text-red-400 font-bold text-sm active:scale-[0.98] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Sinyal Live</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};