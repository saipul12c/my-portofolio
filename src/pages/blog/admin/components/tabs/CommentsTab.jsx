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
  AlertCircle
} from 'lucide-react';

export default function CommentsTab({ 
  comments = [], 
  onDeleteComment, 
  onUpdateStatus 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredComments = useMemo(() => {
    return comments.filter(c => {
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
  }, [comments, searchTerm, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari komentar berdasarkan nama, email, pesan, atau judul artikel..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Semua Status Komentar</option>
            <option value="approved">Disetujui (Approved)</option>
            <option value="pending">Menunggu Moderasi</option>
          </select>
        </div>
      </div>

      {/* Daftar Komentar */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
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

              return (
                <div key={c.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
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

                      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-cyan-400">
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
                          className="px-2 py-1 rounded bg-red-500 text-white text-[10px] font-bold"
                        >
                          Ya
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded bg-white/10 text-gray-300 text-[10px]"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onUpdateStatus(c.id, c.postSlug, isApproved ? 'pending' : 'approved')}
                          className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                            isApproved 
                              ? 'text-emerald-400 hover:bg-emerald-500/10' 
                              : 'text-amber-400 hover:bg-amber-500/10'
                          }`}
                          title={isApproved ? "Disetujui (Klik untuk tahan)" : "Tahan (Klik untuk setujui)"}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-[11px] font-mono">{isApproved ? 'Disetujui' : 'Moderasi'}</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(c.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
    </div>
  );
}
