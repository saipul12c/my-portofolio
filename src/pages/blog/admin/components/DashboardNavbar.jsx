import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Sparkles,
  ExternalLink,
  RefreshCw,
  X,
  FileText,
  Edit3,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { isSupabaseConfigured } from '../../../../lib/supabaseClient';
import { getAdminSession } from '../services/blogAdminAuth';

export default function DashboardNavbar({
  activeTabTitle,
  setIsOpenMobile,
  openCreateModal,
  onRefresh,
  posts = [],
  onEditPost,
  lastUpdatedTime
}) {
  const adminSession = getAdminSession();
  const isCloudAuth = Boolean(isSupabaseConfigured && adminSession?.authMode === 'supabase');
  const syncMode = !isSupabaseConfigured ? 'local' : (isCloudAuth ? 'cloud' : 'readonly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    if (typeof onRefresh === 'function') {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter posts based on query
  const searchResults = query.trim() ? posts.filter(p => {
    const q = query.toLowerCase().trim();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }).slice(0, 6) : [];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      {/* Kiri: Mobile Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 md:hidden shrink-0"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight truncate">
            {activeTabTitle}
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block truncate">
            {lastUpdatedTime ? `Sinkronisasi data: ${lastUpdatedTime}` : 'Pusat Kendali Ekosistem Konten Blog'}
          </p>
        </div>
      </div>

      {/* Tengah / Kanan: Quick Search Command Bar */}
      <div className="relative flex-1 max-w-xs md:max-w-md hidden sm:block" ref={searchBoxRef}>
        <div
          onClick={() => {
            setSearchOpen(true);
            searchInputRef.current?.focus();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 hover:border-cyan-500/40 transition-all cursor-text text-gray-400 focus-within:border-cyan-400"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Cari cepat judul, kategori, atau tagar..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-xs focus:outline-none"
          />
          {query ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuery('');
              }}
              className="p-0.5 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 select-none">
              Ctrl+K
            </span>
          )}
        </div>

        {/* Dropdown Hasil Pencarian Cepat */}
        {searchOpen && query.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
            <div className="p-2.5 bg-slate-950/70 text-[11px] font-medium text-gray-400 flex items-center justify-between">
              <span>Hasil Pencarian ({searchResults.length})</span>
              <span className="text-[10px] text-cyan-400">Klik untuk langsung edit</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                Tidak ada artikel yang cocok dengan "{query}"
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {searchResults.map((post) => (
                  <div
                    key={post.id || post.slug}
                    onClick={() => {
                      if (onEditPost) onEditPost(post);
                      setSearchOpen(false);
                      setQuery('');
                    }}
                    className="p-2.5 px-3 hover:bg-cyan-500/10 cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <img
                        src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&auto=format&fit=crop&q=80"}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {post.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-cyan-400/90">{post.category}</span>
                          <span>•</span>
                          <span className="font-mono">{post.status}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-cyan-300">
                        <Edit3 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kanan: Refresh, Status Database, Buat Post, Link Publik */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Tombol Refresh Data */}
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-xl text-gray-400 hover:text-cyan-300 hover:bg-white/5 border border-white/5 transition-all cursor-pointer ${isRefreshing ? 'opacity-70' : ''
            }`}
          title="Segarkan / Muat Ulang Data Blog"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Status Sinkronisasi Supabase vs Local */}
        <div
          title={
            syncMode === 'cloud'
              ? 'Terhubung ke Supabase Cloud (Terautentikasi Admin — Sinkronisasi Cloud Aktif)'
              : syncMode === 'readonly'
                ? 'Supabase terhubung (Mode Login Lokal — perubahan hanya tersimpan di browser ini)'
                : 'Penyimpanan Browser Lokal (Offline-first / Instant Storage)'
          }
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-xs"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              syncMode === 'cloud'
                ? 'bg-emerald-400 animate-pulse'
                : syncMode === 'readonly'
                  ? 'bg-amber-400'
                  : 'bg-cyan-400'
            }`}
          />
          <span className="text-gray-300 text-[10px] font-mono">
            {syncMode === 'cloud' ? 'Supabase' : syncMode === 'readonly' ? 'Mode Lokal' : 'Local'}
          </span>
        </div>

        {/* Tombol Buat Post */}
        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Tulis Artikel</span>
          <span className="xs:hidden sm:hidden">Tulis</span>
        </button>

        {/* Tautan ke Blog Publik */}
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors border border-white/5"
          title="Buka Halaman Blog Publik (Tab Baru)"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}