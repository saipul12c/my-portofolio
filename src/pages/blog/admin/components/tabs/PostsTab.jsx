import React, { useState, useMemo, useEffect } from 'react';
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
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  ArrowUpDown,
  Download,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckSquare,
  Square,
  Link,
  Check,
  X
} from 'lucide-react';

export default function PostsTab({ 
  posts = [], 
  categories = [], 
  onEditPost, 
  onDeletePost, 
  onDuplicatePost, 
  onToggleStatus, 
  onToggleFeatured, 
  openCreateModal,
  onBulkDelete,
  onBulkStatusChange,
  onBulkCategoryChange,
  filterPreset
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'published' | 'scheduled' | 'draft' | 'featured'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'views-desc' | 'likes-desc' | 'rating-desc'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Batch selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');
  const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  // Apply filterPreset if passed from OverviewTab
  useEffect(() => {
    if (filterPreset) {
      if (filterPreset.status) setSelectedStatus(filterPreset.status);
      if (filterPreset.category) setSelectedCategory(filterPreset.category);
      if (filterPreset.search) setSearchTerm(filterPreset.search);
      setCurrentPage(1);
    }
  }, [filterPreset]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Status counts for quick filter pills
  const counts = useMemo(() => {
    return {
      all: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      scheduled: posts.filter(p => p.status === 'scheduled').length,
      draft: posts.filter(p => p.status === 'draft').length,
      featured: posts.filter(p => Boolean(p.featured)).length
    };
  }, [posts]);

  // Filter & Search
  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => {
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

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'date-asc':
          return new Date(a.date || 0) - new Date(b.date || 0);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'views-desc':
          return (Number(b.views) || 0) - (Number(a.views) || 0);
        case 'likes-desc':
          return (Number(b.likes) || 0) - (Number(a.likes) || 0);
        case 'rating-desc':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [posts, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Paginated Posts
  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;
  const paginatedPosts = useMemo(() => {
    if (pageSize === 9999) return filteredPosts;
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  // Bulk Selection Handlers
  const handleSelectAllCurrentPage = () => {
    const pageIds = paginatedPosts.map(p => p.id || p.slug);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...pageIds]));
      setSelectedIds(merged);
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleApplyBulkStatus = async (status) => {
    if (onBulkStatusChange) {
      await onBulkStatusChange(selectedIds, status);
      setSelectedIds([]);
    }
  };

  const handleApplyBulkCategory = async () => {
    if (onBulkCategoryChange && bulkCategoryTarget) {
      await onBulkCategoryChange(selectedIds, bulkCategoryTarget);
      setShowBulkCategoryModal(false);
      setSelectedIds([]);
    }
  };

  const handleApplyBulkDelete = async () => {
    if (onBulkDelete) {
      await onBulkDelete(selectedIds);
      setShowBulkDeleteConfirm(false);
      setSelectedIds([]);
    }
  };

  const handleExportSelected = () => {
    const selectedPosts = posts.filter(p => selectedIds.includes(p.id) || selectedIds.includes(p.slug));
    const blob = new Blob([JSON.stringify(selectedPosts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekspor-artikel-terpilih-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = (slug) => {
    const fullUrl = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDelete = (id) => {
    onDeletePost(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5 relative">
      
      {/* 🏷️ Pills Filter Cepat Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Artikel', count: counts.all, color: 'text-gray-300' },
          { id: 'published', label: 'Terbit (Published)', count: counts.published, color: 'text-emerald-400' },
          { id: 'scheduled', label: 'Terjadwal', count: counts.scheduled, color: 'text-blue-400' },
          { id: 'draft', label: 'Draf (Draft)', count: counts.draft, color: 'text-amber-400' },
          { id: 'featured', label: 'Unggulan (Featured)', count: counts.featured, color: 'text-yellow-400' }
        ].map(pill => {
          const isActive = selectedStatus === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedStatus(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/40 font-semibold shadow-sm'
                  : 'bg-slate-900/60 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{pill.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] ${isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/5 text-gray-400'}`}>
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🔍 Top Bar Kontrol: Filter, Pencarian, & Tambah Artikel */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul, URL slug, atau tagar..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Sorting */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="date-desc">Terbaru</option>
              <option value="date-asc">Terlama</option>
              <option value="views-desc">Tayangan Tertinggi</option>
              <option value="likes-desc">Suka Terbanyak</option>
              <option value="rating-desc">Rating Tertinggi</option>
              <option value="title-asc">Judul (A - Z)</option>
              <option value="title-desc">Judul (Z - A)</option>
            </select>
          </div>

          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
            title="Jumlah per halaman"
          >
            <option value={10}>10 / hal</option>
            <option value={20}>20 / hal</option>
            <option value={50}>50 / hal</option>
            <option value={9999}>Semua</option>
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

      {/* 🚀 Floating Batch Action Bar (Muncul saat ada checkbox terpilih) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-16 z-20 p-3 sm:p-4 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center justify-center font-mono">
              {selectedIds.length}
            </span>
            <span className="text-white font-semibold">Artikel dipilih</span>
            <button
              onClick={handleClearSelection}
              className="text-xs text-cyan-300 hover:text-white underline ml-1 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApplyBulkStatus('published')}
              className="py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terbitkan</span>
            </button>

            <button
              onClick={() => handleApplyBulkStatus('draft')}
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Jadikan Draf</span>
            </button>

            <button
              onClick={() => setShowBulkCategoryModal(true)}
              className="py-1.5 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Ubah Kategori</span>
            </button>

            <button
              onClick={handleExportSelected}
              className="py-1.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor JSON</span>
            </button>

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="py-1.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Massal</span>
            </button>
          </div>
        </div>
      )}

      {/* 📋 Tabel Daftar Artikel */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedPosts.length > 0 && paginatedPosts.every(p => selectedIds.includes(p.id || p.slug))}
                    onChange={handleSelectAllCurrentPage}
                    className="rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                    title="Pilih semua di halaman ini"
                  />
                </th>
                <th className="py-3.5 px-3">Artikel</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Metrik</th>
                <th className="py-3.5 px-3">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-gray-600" />
                      <p className="font-medium text-sm text-gray-300">Tidak ada artikel yang cocok</p>
                      <p className="text-xs text-gray-500">Coba ubah kata kunci atau filter pencarian Anda.</p>
                      <button
                        onClick={openCreateModal}
                        className="mt-2 py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs hover:bg-cyan-500/20 transition-colors cursor-pointer"
                      >
                        + Buat Artikel Baru
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => {
                  const postId = post.id || post.slug;
                  const isPublished = post.status === 'published';
                  const isDeleting = deleteConfirmId === post.id;
                  const isSelected = selectedIds.includes(postId);

                  return (
                    <tr 
                      key={postId} 
                      className={`hover:bg-white/[0.02] transition-colors group ${
                        isSelected ? 'bg-cyan-500/[0.04]' : ''
                      }`}
                    >
                      {/* Checkbox Baris */}
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(postId)}
                          className="rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Judul & Thumbnail */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3 max-w-md">
                          <img 
                            src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=150&auto=format&fit=crop&q=80"} 
                            alt={post.title} 
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 
                                onClick={() => onEditPost(post)}
                                className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate cursor-pointer"
                                title={post.title}
                              >
                                {post.title}
                              </h3>
                              {post.featured && (
                                <span className="p-0.5 rounded text-amber-400 shrink-0" title="Artikel Unggulan">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                              <span className="font-mono truncate max-w-[150px]">/blog/{post.slug}</span>
                              <span>•</span>
                              <span>{post.readTime || '5 min'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap">
                          {post.category || 'Umum'}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-3">
                        {post.status === 'scheduled' ? (
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 whitespace-nowrap"
                            title={`Dijadwalkan untuk ${post.scheduledAt || 'Nanti'}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span>Terjadwal</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onToggleStatus(post.id || post.slug)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer whitespace-nowrap ${
                              isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                            }`}
                            title="Klik untuk mengubah status (Terbit <-> Draf)"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span>{isPublished ? 'Terbit' : 'Draf'}</span>
                          </button>
                        )}
                      </td>

                      {/* Metrik: Views, Likes, Rating */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5 text-[11px] text-gray-400 font-mono whitespace-nowrap">
                          <span className="flex items-center gap-1" title="Tayangan (Views)">
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            {(Number(post.views) || 0).toLocaleString('id-ID')}
                          </span>
                          <span className="flex items-center gap-1" title="Suka (Likes)">
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
                      <td className="py-3.5 px-3 text-[11px] text-gray-400 font-mono whitespace-nowrap">
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

                            {/* Salin Tautan */}
                            <button
                              onClick={() => handleCopyLink(post.slug)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                              title={copiedSlug === post.slug ? 'Tautan Disalin!' : 'Salin URL Artikel'}
                            >
                              {copiedSlug === post.slug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5" />}
                            </button>

                            {/* Buka Live Preview */}
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                              title="Buka Halaman Live (Tab Baru)"
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
                              title="Edit Artikel Lengkap"
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

        {/* Tabel Footer: Pagination & Ringkasan Jumlah */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            Menampilkan <strong>{paginatedPosts.length}</strong> dari <strong>{filteredPosts.length}</strong> artikel cocok 
            (Total: {posts.length})
          </div>

          {/* Kontrol Navigasi Halaman */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-mono text-xs text-gray-300 bg-slate-950 rounded-lg border border-white/10">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Ubah Kategori Massal */}
      {showBulkCategoryModal && (
        <div 
          onClick={() => setShowBulkCategoryModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                Ubah Kategori Massal
              </h3>
              <button onClick={() => setShowBulkCategoryModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Pilih kategori baru untuk <strong>{selectedIds.length}</strong> artikel terpilih:
            </p>

            <select
              value={bulkCategoryTarget}
              onChange={(e) => setBulkCategoryTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c, i) => (
                <option key={i} value={c.name}>{c.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkCategoryModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 text-xs hover:bg-white/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyBulkCategory}
                disabled={!bulkCategoryTarget}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold disabled:opacity-50"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Massal */}
      {showBulkDeleteConfirm && (
        <div 
          onClick={() => setShowBulkDeleteConfirm(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-white">Hapus {selectedIds.length} Artikel Sekaligus?</h3>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Tindakan ini akan menghapus artikel terpilih secara permanen. Pastikan Anda telah mencadangkan data jika diperlukan.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 text-xs hover:bg-white/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyBulkDelete}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}