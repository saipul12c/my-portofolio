import React from 'react';
import { 
  FileText, 
  Eye, 
  Heart, 
  Share2, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  ExternalLink, 
  Edit3, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

export default function OverviewTab({ 
  stats, 
  openCreateModal, 
  onEditPost, 
  setActiveTab 
}) {
  const statCards = [
    {
      label: 'Total Artikel',
      value: stats?.totalPosts || 0,
      sub: `${stats?.publishedPosts || 0} Terbit • ${stats?.scheduledPosts || 0} Terjadwal • ${stats?.draftPosts || 0} Draf`,
      icon: FileText,
      gradient: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400'
    },
    {
      label: 'Total Tayangan (Views)',
      value: (stats?.totalViews || 0).toLocaleString('id-ID'),
      sub: 'Akumulasi seluruh artikel',
      icon: Eye,
      gradient: 'from-purple-500/20 to-pink-500/10',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    },
    {
      label: 'Suka (Likes)',
      value: (stats?.totalLikes || 0).toLocaleString('id-ID'),
      sub: 'Interaksi pembaca aktif',
      icon: Heart,
      gradient: 'from-rose-500/20 to-red-500/10',
      border: 'border-rose-500/30',
      iconColor: 'text-rose-400'
    },
    {
      label: 'Rata-rata Rating',
      value: `${stats?.avgRating || '5.0'} / 5.0`,
      sub: 'Kepuasan ulasan pembaca',
      icon: Star,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400'
    },
    {
      label: 'Total Komentar',
      value: stats?.totalComments || 0,
      sub: 'Diskusi & masukan audiens',
      icon: MessageSquare,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      label: 'Total Dibagikan (Shares)',
      value: (stats?.totalShares || 0).toLocaleString('id-ID'),
      sub: 'Jangkauan viral sosial',
      icon: Share2,
      gradient: 'from-indigo-500/20 to-blue-500/10',
      border: 'border-indigo-500/30',
      iconColor: 'text-indigo-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 🚀 Banner Selamat Datang & Quick Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/50 border border-cyan-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Blog Central Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Selamat Datang di Dashboard Khusus Blog
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Kelola seluruh konten, pantau analitik tayangan, moderasi ulasan komentar, serta kelola data artikel Anda secara independen dalam satu pusat kendali.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={openCreateModal}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Moderasi Komentar</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 📊 Grid Kartu Metrik Utama */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`p-4 rounded-2xl bg-gradient-to-b ${card.gradient} bg-slate-900/80 border ${card.border} backdrop-blur-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 truncate">{card.label}</span>
                <div className={`p-1.5 rounded-lg bg-white/5 ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 truncate">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📈 Grafik Analitik Tren Tayangan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Tren Pertumbuhan Tayangan (Views)
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Metrik akumulasi aktivitas pembaca blog</p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              6 Bulan Terakhir
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyData || []}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#ffffff15' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#ffffff15' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#38bdf8', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#viewsGradient)" 
                  name="Tayangan"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribusi Kategori */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Distribusi per Kategori</h3>
            <p className="text-[11px] text-gray-400 mb-4">Proporsi konten aktif berdasarkan topik</p>

            <div className="space-y-3">
              {(stats?.categoryStats || []).map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium">{cat.name}</span>
                    <span className="text-gray-400 font-mono">{cat.count} artikel</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats?.totalPosts ? (cat.count / stats.totalPosts) * 100 : 0}%`,
                        backgroundColor: cat.color || '#06b6d4'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-400">Kelola kategori topik</span>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              Lihat Kategori →
            </button>
          </div>
        </div>
      </div>

      {/* 🏆 Artikel Terpopuler & Komentar Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Artikel Terpopuler */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Artikel Terpopuler
            </h3>
            <button
              onClick={() => setActiveTab('posts')}
              className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              Semua Artikel →
            </button>
          </div>

          <div className="space-y-3">
            {(stats?.topPosts || []).map((post, idx) => (
              <div 
                key={post.id || idx}
                className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0 border border-cyan-500/20">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {post.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.views} Views</span>
                      <span>•</span>
                      <span>★ {post.rating}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditPost(post)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                    title="Edit Artikel"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                    title="Buka di Tab Baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Komentar & Ulasan Terbaru */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Komentar Terbaru
            </h3>
            <button
              onClick={() => setActiveTab('comments')}
              className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              Semua Komentar →
            </button>
          </div>

          <div className="space-y-3">
            {(!stats?.recentComments || stats.recentComments.length === 0) ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Belum ada komentar terbaru yang masuk.
              </div>
            ) : (
              stats.recentComments.map((c, idx) => (
                <div 
                  key={c.id || idx}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(c.date || Date.now()).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 italic">
                    "{c.message}"
                  </p>
                  <p className="text-[10px] text-cyan-400/80 truncate">
                    Pada: {c.postTitle || c.postSlug}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
