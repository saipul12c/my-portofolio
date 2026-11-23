import React, { useState, useMemo } from 'react';
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
  AlertCircle,
  Lightbulb,
  Plus,
  Trash2,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
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
import { getQuickIdeas, saveQuickIdea, deleteQuickIdea, getContentAudit } from '../../services/blogAdminService';

export default function OverviewTab({ 
  stats, 
  openCreateModal, 
  onEditPost, 
  setActiveTab,
  onNavigateToPosts,
  posts = []
}) {
  // Chart period state
  const [chartPeriod, setChartPeriod] = useState('6m'); // '7d' | '30d' | '6m'

  // Quick ideas state
  const [quickIdeas, setQuickIdeas] = useState(() => getQuickIdeas());
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaCat, setNewIdeaCat] = useState('Teknologi');
  const [isAddingIdea, setIsAddingIdea] = useState(false);

  // Content audit
  const audit = useMemo(() => getContentAudit(posts), [posts]);

  // Navigate helper with filter preset
  const handleDrilldown = (status = null, category = null) => {
    if (typeof onNavigateToPosts === 'function') {
      onNavigateToPosts({ status: status || 'all', category: category || 'all' });
    } else {
      setActiveTab('posts');
    }
  };

  const handleAddIdea = (e) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;
    const added = saveQuickIdea({
      title: newIdeaTitle,
      category: newIdeaCat,
      notes: ''
    });
    if (added) {
      setQuickIdeas(getQuickIdeas());
      setNewIdeaTitle('');
      setIsAddingIdea(false);
    }
  };

  const handleDeleteIdea = (id) => {
    deleteQuickIdea(id);
    setQuickIdeas(getQuickIdeas());
  };

  const handleDevelopIdea = (idea) => {
    openCreateModal({
      title: idea.title,
      category: idea.category,
      excerpt: `Ide artikel: ${idea.title}`,
      content: `## ${idea.title}\n\nPengantar ide tulisan...\n\n### Poin Utama\n1. \n2. \n`
    });
  };

  // Metrik chart disesuaikan dengan periode
  const chartData = useMemo(() => {
    const baseViews = stats?.totalViews || 2000;
    if (chartPeriod === '7d') {
      return [
        { month: 'Sen', views: Math.round(baseViews * 0.12), shares: 14 },
        { month: 'Sel', views: Math.round(baseViews * 0.15), shares: 19 },
        { month: 'Rab', views: Math.round(baseViews * 0.14), shares: 17 },
        { month: 'Kam', views: Math.round(baseViews * 0.22), shares: 25 },
        { month: 'Jum', views: Math.round(baseViews * 0.18), shares: 21 },
        { month: 'Sab', views: Math.round(baseViews * 0.28), shares: 36 },
        { month: 'Min', views: Math.round(baseViews * 0.32), shares: 42 }
      ];
    } else if (chartPeriod === '30d') {
      return [
        { month: 'Mgg 1', views: Math.round(baseViews * 0.20), shares: 30 },
        { month: 'Mgg 2', views: Math.round(baseViews * 0.35), shares: 52 },
        { month: 'Mgg 3', views: Math.round(baseViews * 0.60), shares: 84 },
        { month: 'Mgg 4', views: Math.round(baseViews * 0.95), shares: 130 }
      ];
    }
    return stats?.monthlyData || [
      { month: 'Okt', views: 320 },
      { month: 'Nov', views: 580 },
      { month: 'Des', views: 820 },
      { month: 'Jan', views: 1240 },
      { month: 'Feb', views: 1890 },
      { month: 'Mar', views: 2450 }
    ];
  }, [chartPeriod, stats]);

  const statCards = [
    {
      label: 'Total Artikel',
      value: stats?.totalPosts || 0,
      sub: `${stats?.publishedPosts || 0} Terbit • ${stats?.draftPosts || 0} Draf`,
      icon: FileText,
      gradient: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      onClick: () => handleDrilldown('all')
    },
    {
      label: 'Total Tayangan (Views)',
      value: (stats?.totalViews || 0).toLocaleString('id-ID'),
      sub: 'Akumulasi seluruh artikel',
      icon: Eye,
      gradient: 'from-purple-500/20 to-pink-500/10',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      onClick: () => {}
    },
    {
      label: 'Suka (Likes)',
      value: (stats?.totalLikes || 0).toLocaleString('id-ID'),
      sub: 'Interaksi pembaca aktif',
      icon: Heart,
      gradient: 'from-rose-500/20 to-red-500/10',
      border: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      onClick: () => {}
    },
    {
      label: 'Rata-rata Rating',
      value: `${stats?.avgRating || '5.0'} / 5.0`,
      sub: 'Kepuasan ulasan pembaca',
      icon: Star,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      onClick: () => {}
    },
    {
      label: 'Total Komentar',
      value: stats?.totalComments || 0,
      sub: 'Diskusi & masukan audiens',
      icon: MessageSquare,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      onClick: () => setActiveTab('comments')
    },
    {
      label: 'Total Dibagikan',
      value: (stats?.totalShares || 0).toLocaleString('id-ID'),
      sub: 'Jangkauan viral sosial',
      icon: Share2,
      gradient: 'from-indigo-500/20 to-blue-500/10',
      border: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      onClick: () => {}
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* 🚀 Banner Selamat Datang & Quick Action Hub */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/50 border border-cyan-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Blog Central Intelligence & Management
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pusat Pengelolaan Konten & Analitik Blog
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Pantau performa pembaca, jadwalkan penerbitan otomatis, moderasi diskusi, serta jaga mutu SEO artikel secara terpadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openCreateModal()}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
            <button
              onClick={() => handleDrilldown('all')}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Kelola Artikel</span>
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
              onClick={card.onClick}
              className={`p-4 rounded-2xl bg-gradient-to-b ${card.gradient} bg-slate-900/80 border ${card.border} backdrop-blur-sm flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-400 truncate">{card.label}</span>
                <div className={`p-1.5 rounded-lg bg-white/5 ${card.iconColor} group-hover:scale-110 transition-transform`}>
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

      {/* 📈 Grafik Analitik Tren Tayangan & Distribusi Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Utama */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Tren Pertumbuhan Tayangan & Kunjungan
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Metrik aktivitas dan jangkauan audiens blog</p>
            </div>

            {/* Filter Periode Grafik */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/10 text-xs self-start sm:self-auto">
              {[
                { id: '7d', label: '7 Hari' },
                { id: '30d', label: '30 Hari' },
                { id: '6m', label: '6 Bulan' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setChartPeriod(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    chartPeriod === p.id ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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

        {/* Distribusi Kategori (Klik langsung filter) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white">Distribusi per Kategori</h3>
              <span className="text-[10px] text-cyan-400 font-mono">Klik untuk filter</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Proporsi konten aktif berdasarkan topik</p>

            <div className="space-y-3">
              {(stats?.categoryStats || []).map((cat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleDrilldown('all', cat.name)}
                  className="space-y-1 p-1.5 -mx-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#06b6d4' }} />
                      {cat.name}
                    </span>
                    <span className="text-gray-400 font-mono">{cat.count} artikel</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
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
            <span className="text-xs text-gray-400">Atur kategori & tagar</span>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              Kelola Kategori →
            </button>
          </div>
        </div>
      </div>

      {/* 🛡️ Bar Audit Kualitas Konten & SEO Health */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Audit Kualitas Konten & Kesiapan SEO
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-normal bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Skor: {audit.healthScore}%
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Pemeriksaan otomatis kelengkapan metadata, cover thumbnail, tagar, dan panjang artikel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">Rata-rata: <strong>{audit.avgWords}</strong> kata/artikel</span>
          </div>
        </div>

        {/* 4 Indikator Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Meta Deskripsi SEO</span>
              <span className="font-mono text-cyan-400">{audit.hasMetaDescPct}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${audit.hasMetaDescPct}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Kelengkapan Cover Gambar</span>
              <span className="font-mono text-purple-400">{audit.hasThumbPct}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${audit.hasThumbPct}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Penggunaan Tagar Minimal (≥2)</span>
              <span className="font-mono text-emerald-400">{audit.hasTagsPct}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${audit.hasTagsPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 💡 Memo Ide Artikel Cepat & Artikel Terpopuler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Memo Ide Artikel Cepat (Quick Ideator) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Memo Ide Tulisan Cepat ({quickIdeas.length})
            </h3>
            <button
              onClick={() => setIsAddingIdea(!isAddingIdea)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingIdea ? 'Tutup' : 'Catat Ide Baru'}</span>
            </button>
          </div>

          {/* Form Tambah Ide Cepat */}
          {isAddingIdea && (
            <form onSubmit={handleAddIdea} className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2.5">
              <input
                type="text"
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                placeholder="Tulis judul atau topik ide artikel..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                autoFocus
                required
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={newIdeaCat}
                  onChange={(e) => setNewIdeaCat(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-gray-300 text-[11px] focus:outline-none"
                >
                  <option value="Teknologi">Teknologi</option>
                  <option value="Fotografi">Fotografi</option>
                  <option value="Desain & Kreatif">Desain & Kreatif</option>
                  <option value="Seni & Budaya">Seni & Budaya</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Opini & Cerita">Opini & Cerita</option>
                </select>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingIdea(false)}
                    className="px-2.5 py-1 text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Simpan Memo
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* List Memo Ide */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {quickIdeas.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs italic">
                Belum ada catatan ide artikel. Klik "+ Catat Ide Baru" untuk mulai.
              </div>
            ) : (
              quickIdeas.map((idea) => (
                <div 
                  key={idea.id}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-2.5 group"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                      {idea.category}
                    </span>
                    <h4 className="text-xs font-semibold text-white mt-1 group-hover:text-cyan-300 transition-colors truncate">
                      {idea.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDevelopIdea(idea)}
                      className="py-1 px-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Buka di editor artikel sekarang"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Buat Post</span>
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Hapus ide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Artikel Terpopuler */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Artikel Terpopuler
            </h3>
            <button
              onClick={() => handleDrilldown('all')}
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
                    <h4 
                      onClick={() => onEditPost(post)}
                      className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate cursor-pointer"
                    >
                      {post.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{(Number(post.views) || 0).toLocaleString('id-ID')} Views</span>
                      <span>•</span>
                      <span>★ {post.rating || '5.0'}</span>
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

      </div>

    </div>
  );
}