import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  User, 
  Mail,
  AlertCircle,
  ArrowUpDown,
  CheckCheck,
  Send,
  X
} from 'lucide-react';

export default function CommentsTab({ 
  comments = [], 
  onDeleteComment, 
  onUpdateStatus 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Counts
  const counts = useMemo(() => ({
    all: comments.length,
    approved: comments.filter(c => (c.status || 'approved') === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length
  }), [comments]);

  const filteredComments = useMemo(() => {
    let result = comments.filter(c => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q ||
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q) ||
        c.postTitle?.toLowerCase().includes(q) ||
        c.postSlug?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || (c.status || 'approved') === statusFilter;
      return matchSearch && matchStatus;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [comments, searchTerm, statusFilter, sortBy]);

  // Bulk handlers
  const handleToggleSelectAll = () => {
    if (filteredComments.every(c => selectedIds.includes(c.id))) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredComments.map(c => c.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatus = async (status) => {
    for (const id of selectedIds) {
      const comment = comments.find(c => c.id === id);
      if (comment && typeof onUpdateStatus === 'function') {
        await onUpdateStatus(id, comment.postSlug, status);
      }
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      const comment = comments.find(c => c.id === id);
      if (comment && typeof onDeleteComment === 'function') {
        await onDeleteComment(id, comment.postSlug);
      }
    }
    setShowBulkDeleteConfirm(false);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-5">
      
      {/* 📊 Quick Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Komentar', count: counts.all, color: 'text-gray-300' },
          { id: 'approved', label: 'Disetujui (Approved)', count: counts.approved, color: 'text-emerald-400' },
          { id: 'pending', label: 'Menunggu Moderasi', count: counts.pending, color: 'text-amber-400' }
        ].map(pill => {
          const isActive = statusFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari komentar berdasarkan nama, email, pesan, atau artikel..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sorting */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🚀 Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-16 z-20 p-3 sm:p-4 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center justify-center font-mono">
              {selectedIds.length}
            </span>
            <span className="text-white font-semibold">Komentar dipilih</span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-cyan-300 hover:text-white underline ml-1 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkStatus('approved')}
              className="py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Setujui Semua</span>
            </button>

            <button
              onClick={() => handleBulkStatus('pending')}
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tahan Moderasi</span>
            </button>

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="py-1.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Daftar Komentar */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
        {filteredComments.length > 0 && (
          <div className="p-3 bg-slate-950/60 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filteredComments.length > 0 && filteredComments.every(c => selectedIds.includes(c.id))}
                onChange={handleToggleSelectAll}
                className="rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <span>Pilih Semua ({filteredComments.length})</span>
            </label>
            <span className="font-mono text-[11px]">
              Menampilkan {filteredComments.length} dari {comments.length} komentar
            </span>
          </div>
        )}

        <div className="divide-y divide-white/5">
          {filteredComments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="font-semibold text-sm text-gray-300">Tidak ada komentar ditemukan</p>
              <p className="text-xs text-gray-500 mt-1">Belum ada diskusi pembaca atau filter tidak sesuai.</p>
            </div>
          ) : (
            filteredComments.map((c) => {
              const isDeleting = deleteConfirmId === c.id;
              const isApproved = (c.status || 'approved') === 'approved';
              const isSelected = selectedIds.includes(c.id);

              return (
                <div 
                  key={c.id} 
                  className={`p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    isSelected ? 'bg-cyan-500/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectOne(c.id)}
                      className="mt-2.5 rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer shrink-0"
                    />

                    <img 
                      src={c.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.name || 'user'}`}
                      alt={c.name}
                      className="w-10 h-10 rounded-full border border-white/10 shrink-0 object-cover bg-slate-950"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-white text-xs sm:text-sm">{c.name}</h4>
                        {c.email && (
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono ml-auto sm:ml-0">
                          {new Date(c.date || Date.now()).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-200 mt-2 p-3 rounded-xl bg-slate-950/60 border border-white/5 leading-relaxed font-sans">
                        {c.message}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px]">
                        <div className="flex items-center gap-1 text-cyan-400">
                          <span>Pada artikel:</span>
                          <a
                            href={`/blog/${c.postSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 font-medium truncate max-w-xs"
                          >
                            {c.postTitle || c.postSlug}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>

                        {c.email && (
                          <a
                            href={`mailto:${c.email}?subject=Balasan Ulasan Blog: ${c.postTitle || ''}`}
                            className="text-gray-400 hover:text-cyan-300 flex items-center gap-1 ml-auto"
                            title="Kirim email balasan langsung"
                          >
                            <Send className="w-3 h-3" />
                            <span>Balas via Email</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Moderasi */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1">
                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-xl border border-red-500/20">
                        <span className="text-[10px] text-red-400 px-1 font-semibold">Hapus?</span>
                        <button
                          onClick={() => {
                            onDeleteComment(c.id, c.postSlug);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 rounded bg-red-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Ya
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded bg-white/10 text-gray-300 text-[10px] cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onUpdateStatus(c.id, c.postSlug, isApproved ? 'pending' : 'approved')}
                          className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                            isApproved 
                              ? 'text-emerald-400 hover:bg-emerald-500/10' 
                              : 'text-amber-400 hover:bg-amber-500/10'
                          }`}
                          title={isApproved ? "Disetujui (Klik untuk tahan moderasi)" : "Menunggu (Klik untuk setujui)"}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-[11px] font-mono">{isApproved ? 'Disetujui' : 'Moderasi'}</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(c.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Hapus Komentar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-white">Hapus {selectedIds.length} Komentar?</h3>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Komentar yang dipilih akan dihapus secara permanen dari sistem dan halaman publik.
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
                onClick={handleBulkDelete}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}