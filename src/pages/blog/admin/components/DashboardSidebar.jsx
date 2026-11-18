import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  FolderTree, 
  Database, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Sparkles,
  BookOpen,
  ChevronRight,
  Shield,
  X,
  CalendarDays,
  Image as ImageIcon,
  Users
} from 'lucide-react';

export default function DashboardSidebar({ 
  activeTab, 
  setActiveTab, 
  adminSession, 
  stats, 
  onLogout,
  isOpenMobile,
  setIsOpenMobile,
  openCreateModal
}) {
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Ringkasan & Metrik', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'posts', 
      label: 'Manajemen Artikel', 
      icon: FileText,
      badge: stats?.totalPosts || 0
    },
    { 
      id: 'calendar', 
      label: 'Kalender & Jadwal Rilis', 
      icon: CalendarDays,
      badge: stats?.scheduledPosts || null
    },
    { 
      id: 'media', 
      label: 'Galeri Media & Unsplash', 
      icon: ImageIcon,
      badge: null
    },
    { 
      id: 'comments', 
      label: 'Moderasi Komentar', 
      icon: MessageSquare,
      badge: stats?.totalComments || 0
    },
    { 
      id: 'categories', 
      label: 'Kategori & Tagar', 
      icon: FolderTree,
      badge: stats?.categoryStats?.length || 0
    },
    { 
      id: 'authors', 
      label: 'Profil Penulis', 
      icon: Users,
      badge: null
    },
    { 
      id: 'data', 
      label: 'Manajemen Data & Backup', 
      icon: Database,
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Pengaturan & Akses', 
      icon: Settings,
      badge: null
    }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header Logo & Sistem Brand */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Blog Control Hub
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                </h2>
                <p className="text-[11px] text-gray-400 font-mono">Dedicated CMS</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white md:hidden hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profil Admin Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <img 
              src={adminSession?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover border border-cyan-400/40 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-white truncate">
                {adminSession?.displayName || 'Administrator Blog'}
              </h3>
              <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{adminSession?.role || 'Super Admin'}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Button: Buat Artikel Baru */}
          <div className="px-4 mb-3">
            <button
              onClick={() => {
                openCreateModal();
                if (setIsOpenMobile) setIsOpenMobile(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          {/* Navigasi Utama */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 font-semibold' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-white/5 text-gray-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Tautan ke Public Blog & Tombol Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-cyan-300 hover:bg-white/5 transition-colors border border-white/5"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Blog Publik</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </a>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
