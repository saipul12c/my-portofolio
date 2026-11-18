import React from 'react';
import { 
  Menu, 
  Search, 
  Sparkles, 
  ExternalLink, 
  Database, 
  CheckCircle2, 
  Wifi, 
  WifiOff,
  Bell
} from 'lucide-react';
import { isSupabaseConfigured } from '../../../../lib/supabaseClient';

export default function DashboardNavbar({ 
  activeTabTitle, 
  setIsOpenMobile, 
  openCreateModal,
  searchQuery,
  setSearchQuery,
  onRefresh
}) {
  const isOnline = isSupabaseConfigured;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Kiri: Mobile hamburger & Judul tab */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {activeTabTitle}
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Panel Pengelolaan dan Data Ekosistem Blog
          </p>
        </div>
      </div>

      {/* Kanan: Sinkronisasi Status, Tulis Baru, & Indikator */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Status Sinkronisasi Supabase vs Local */}
        <div 
          title={isOnline ? "Terhubung ke Supabase Cloud Database" : "Penyimpanan Lokal Aktif (Local Storage & JSON Fallback)"}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-xs"
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`}></span>
          <span className="text-gray-300 text-[11px] font-mono">
            {isOnline ? 'Supabase Sync' : 'LocalStorage Mode'}
          </span>
        </div>

        {/* Tombol Tulis Baru (Desktop) */}
        <button
          onClick={openCreateModal}
          className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Buat Post</span>
        </button>

        {/* Tautan ke Blog Publik */}
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors border border-white/5"
          title="Buka Halaman Blog Publik"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
