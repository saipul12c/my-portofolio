import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Star, 
  Eye, 
  Heart, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function PostsTab({ 
  posts = [], 
  categories = [], 
  onEditPost, 
  onDeletePost, 
  onDuplicatePost, 
  onToggleStatus, 
  onToggleFeatured, 
  openCreateModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'published' | 'draft' | 'featured'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter & Search
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || 
        post.title?.toLowerCase().includes(q) || 
        post.slug?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(q)));

      // Category
      const matchCategory = selectedCategory === 'all' || 
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      // Status
      let matchStatus = true;
      if (selectedStatus === 'published') matchStatus = post.status === 'published';
      else if (selectedStatus === 'draft') matchStatus = post.status === 'draft';
      else if (selectedStatus === 'scheduled') matchStatus = post.status === 'scheduled';
      else if (selectedStatus === 'featured') matchStatus = Boolean(post.featured);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [posts, searchTerm, selectedCategory, selectedStatus]);

  const handleDelete = (id) => {
    onDeletePost(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* 🔍 Top Bar Kontrol: Filter, Pencarian, & Tambah Artikel */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari artikel berdasarkan judul, slug, atau tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Semua Status</option>
            <option value="published">Terbit (Published)</option>
            <option value="scheduled">Terjadwal (Scheduled)</option>
            <option value="draft">Draf (Draft)</option>
            <option value="featured">Unggulan (Featured)</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Tombol Tambah */}
          <button
            onClick={openCreateModal}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel</span>
          </button>
        </div>
      </div>

      {/* 📋 Tabel Daftar Artikel */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Artikel</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Metrik</th>
                <th className="py-3.5 px-3">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-gray-600" />
                      <p className="font-medium text-sm text-gray-300">Tidak ada artikel yang cocok</p>
                      <p className="text-xs text-gray-500">Coba ubah kata kunci atau filter pencarian Anda.</p>
                      <button
                        onClick={openCreateModal}
                        className="mt-2 py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs hover:bg-cyan-500/20 transition-colors"
                      >
                        + Buat Artikel Baru
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const isPublished = post.status === 'published';
                  const isDeleting = deleteConfirmId === post.id;

                  return (
                    <tr 
                      key={post.id || post.slug} 
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Judul & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 max-w-md">
                          <img 
                            src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=150&auto=format&fit=crop&q=80"} 
                            alt={post.title} 
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {post.title}
                              </h3>
                              {post.featured && (
                                <span className="p-0.5 rounded text-amber-400" title="Artikel Unggulan">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 font-mono truncate">
                              /blog/{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300">
                          {post.category || 'Umum'}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-3">
                        {post.status === 'scheduled' ? (
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            title={`Dijadwalkan untuk ${post.scheduledAt}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span>Terjadwal</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onToggleStatus(post.id || post.slug)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                              isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                            }`}
                            title="Klik untuk mengubah status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span>{isPublished ? 'Terbit' : 'Draf'}</span>
                          </button>
                        )}
                      </td>

                      {/* Metrik: Views, Likes, Rating */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            {post.views || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Likes">
                            <Heart className="w-3.5 h-3.5 text-rose-500/70" />
                            {post.likes || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Rating">
                            <Star className="w-3.5 h-3.5 text-amber-500/70" />
                            {post.rating || '5.0'}
                          </span>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3.5 px-3 text-[11px] text-gray-400 font-mono">
                        {post.date || 'Hari ini'}
                      </td>

                      {/* Aksi Baris */}
                      <td className="py-3.5 px-4 text-right">
                        {isDeleting ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-red-400 font-semibold mr-1">Hapus?</span>
                            <button
                              onClick={() => handleDelete(post.id || post.slug)}
                              className="px-2 py-1 rounded bg-red-500 text-white text-[11px] font-bold hover:bg-red-600 cursor-pointer"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-white/10 text-gray-300 text-[11px] hover:bg-white/20 cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {/* Toggle Unggulan */}
                            <button
                              onClick={() => onToggleFeatured(post.id || post.slug)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                post.featured ? 'text-amber-400 hover:bg-amber-400/10' : 'text-gray-500 hover:text-amber-400 hover:bg-white/5'
                              }`}
                              title={post.featured ? 'Hapus dari Unggulan' : 'Jadikan Unggulan'}
                            >
                              <Star className={`w-3.5 h-3.5 ${post.featured ? 'fill-amber-400' : ''}`} />
                            </button>

                            {/* Buka Live Preview */}
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                              title="Buka Halaman Live"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Duplikasi */}
                            <button
                              onClick={() => onDuplicatePost(post.id || post.slug)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                              title="Duplikasi Artikel (Salin sebagai Draf)"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Artikel */}
                            <button
                              onClick={() => onEditPost(post)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                              title="Edit Artikel"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Hapus */}
                            <button
                              onClick={() => setDeleteConfirmId(post.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Tabel Footer: Ringkasan Jumlah */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40 flex items-center justify-between text-xs text-gray-400">
          <span>Menampilkan <strong>{filteredPosts.length}</strong> dari <strong>{posts.length}</strong> total artikel</span>
          <span className="font-mono text-[11px]">{posts.filter(p => p.status === 'published').length} Terbit • {posts.filter(p => p.status === 'draft').length} Draf</span>
        </div>
      </div>
    </div>
  );
}
