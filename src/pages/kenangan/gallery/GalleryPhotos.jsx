import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Layers, Camera, AlertCircle, ChevronLeft, ChevronRight, Eye, Heart, Sparkles, MoreHorizontal } from "lucide-react";
import { filterMediaItems } from "../utils/filterHelpers";
import { sanitizeUrl } from "../utils/sanitizers";

export default function GalleryPhotos({ photos = [], albums = [], onSelect, filterSettings = {} }) {
  const [subTab, setSubTab] = useState("all"); // 'all' | 'photos' | 'albums'
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);
  const ITEMS_PER_PAGE = 9;

  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // 🔍 Filter photos & albums berdasarkan pencarian dan tag aktif
  const filteredPhotos = useMemo(() => {
    return filterMediaItems(photos, searchTerm, selectedTags);
  }, [photos, searchTerm, selectedTags]);

  const filteredAlbums = useMemo(() => {
    return filterMediaItems(albums, searchTerm, selectedTags);
  }, [albums, searchTerm, selectedTags]);

  // 🔄 Satukan item berdasarkan sub-tab aktif
  const displayItems = useMemo(() => {
    if (subTab === "photos") return filteredPhotos;
    if (subTab === "albums") return filteredAlbums;

    // 'all': Gabungkan foto dan album secara bergantian/seimbang agar dinamis
    const combined = [];
    const maxLen = Math.max(filteredPhotos.length, filteredAlbums.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < filteredPhotos.length) combined.push(filteredPhotos[i]);
      if (i < filteredAlbums.length) combined.push(filteredAlbums[i]);
    }
    return combined;
  }, [subTab, filteredPhotos, filteredAlbums]);

  // Reset ke halaman 1 jika filter atau subTab berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags, subTab]);

  // Hitung pagination
  const totalPages = Math.max(1, Math.ceil(displayItems.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = displayItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalAllCount = filteredPhotos.length + filteredAlbums.length;

  // 📄 Helper untuk menghasilkan nomor halaman yang ringkas dengan ellipsis (...)
  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  }, [currentPage, totalPages]);

  const handlePageChange = (newPage) => {
    const pageNum = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(pageNum);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mb-24">
      {/* 📸 Header & Sub-Tab Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5 text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-pink-300 bg-clip-text">
            <Sparkles className="w-7 h-7 text-cyan-300" />
            Foto & Koleksi Album
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Koleksi foto tunggal & album kenangan tersinkronisasi dalam satu galeri terpadu
          </p>
        </div>

        {/* 🎛️ Sub-Tab Filter Pills */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md self-start md:self-auto">
          <button
            onClick={() => setSubTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              subTab === "all"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Semua ({totalAllCount})
          </button>

          <button
            onClick={() => setSubTab("photos")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              subTab === "photos"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Camera size={14} />
            Foto ({filteredPhotos.length})
          </button>

          <button
            onClick={() => setSubTab("albums")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              subTab === "albums"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={14} />
            Album ({filteredAlbums.length})
          </button>
        </div>
      </div>

      {/* ⚠️ Empty State */}
      {displayItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center backdrop-blur-xl"
        >
          <AlertCircle className="w-14 h-14 text-cyan-400 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-2">Tidak Ada Foto atau Album Ditemukan</h3>
          <p className="text-gray-400 text-sm max-w-md">
            Tidak ada foto atau album yang sesuai dengan kata kunci pencarian atau tag yang dipilih. Coba reset filter atau gunakan kata kunci lain.
          </p>
        </motion.div>
      ) : (
        <>
          {/* 🖼️ Unified Photo & Album Grid */}
          <motion.div
            key={`${subTab}-${currentPage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {currentItems.map((item) => {
              const isAlbum = item.type === "album" || Array.isArray(item.src);
              const coverSrc = isAlbum ? (Array.isArray(item.src) ? item.src[0] : item.src) : item.src;
              const photoCount = isAlbum ? (Array.isArray(item.src) ? item.src.length : 1) : 1;
              const isProPhoto = Boolean(item.isFromPhotography);

              return (
                <motion.div
                  key={`${item.type || "media"}-${item.id}`}
                  whileHover={{ scale: 1.025, y: -4 }}
                  onClick={() => onSelect && onSelect(item)}
                  className="group relative cursor-pointer"
                >
                  {/* Efek Layer Stack jika berupa Album */}
                  {isAlbum && (
                    <div className="absolute -top-1.5 -right-1.5 w-full h-full rounded-2xl bg-pink-500/10 border border-pink-500/20 -z-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  )}

                  <div className={`overflow-hidden rounded-2xl bg-[#0d1527]/90 backdrop-blur-xl border transition-all duration-300 shadow-xl ${
                    isAlbum
                      ? "border-pink-500/30 hover:border-pink-400 hover:shadow-pink-500/20"
                      : isProPhoto
                      ? "border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20"
                      : "border-white/10 hover:border-blue-400/60 hover:shadow-cyan-500/10"
                  }`}>
                    {/* Media Thumbnail Container */}
                    <div className="relative w-full h-64 overflow-hidden bg-black/60">
                      <img
                        src={sanitizeUrl(coverSrc)}
                        alt={item.title || "Karya Galeri"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        {/* Category Badge */}
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
                          {item.category || "Foto"}
                        </span>

                        {/* Album or Pro Shot Indicator */}
                        {isAlbum ? (
                          <span className="px-2.5 py-1 rounded-full bg-pink-500/90 backdrop-blur-md border border-pink-400 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-pink-500/30">
                            <Layers size={13} />
                            {photoCount} Foto
                          </span>
                        ) : isProPhoto ? (
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/90 backdrop-blur-md border border-cyan-400 text-slate-900 text-[11px] font-bold flex items-center gap-1 shadow-lg shadow-cyan-500/30">
                            <Camera size={12} />
                            Fotografi
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/30 backdrop-blur-md border border-blue-400/40 text-blue-200 text-[10px] font-medium flex items-center gap-1">
                            <Image size={11} />
                            Foto
                          </span>
                        )}
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-300">
                        {item.details?.camera && (
                          <span className="truncate max-w-[65%] text-gray-300 font-medium text-[11px] flex items-center gap-1">
                            📷 {item.details.camera}
                          </span>
                        )}
                        {item.details?.location?.name && (
                          <span className="truncate max-w-[35%] text-gray-400 text-[10px]">
                            📍 {item.details.location.city || item.details.location.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        {item.desc && (
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        )}
                      </div>

                      {/* Creator Info & Engagement */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={sanitizeUrl(item.creator?.avatar || "https://randomuser.me/api/portraits/men/32.jpg")}
                            alt={item.creator?.display_name || "Creator"}
                            className="w-6 h-6 rounded-full object-cover border border-cyan-400/40"
                          />
                          <span className="text-xs text-gray-300 font-medium truncate max-w-[120px]">
                            {item.creator?.display_name || "Syaiful Mukmin"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye size={13} className="text-cyan-400" />
                            {item.engagement?.views?.toLocaleString() || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={13} className="text-pink-400" />
                            {item.engagement?.likes?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 📄 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-white/10">
              {/* Info posisi halaman */}
              <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1 text-center sm:text-left">
                Menampilkan halaman <span className="text-cyan-300 font-semibold">{currentPage}</span> dari{" "}
                <span className="text-white font-semibold">{totalPages}</span>
                <span className="text-gray-500 ml-2 hidden sm:inline">({displayItems.length} karya)</span>
              </div>

              {/* Tombol Navigasi Angka & Ellipsis */}
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1">
                  {visiblePages.map((page, idx) => {
                    if (page === "ellipsis") {
                      return (
                        <div
                          key={`ellipsis-${idx}`}
                          className="w-8 h-8 flex items-center justify-center text-gray-500"
                        >
                          <MoreHorizontal size={14} />
                        </div>
                      );
                    }

                    const isCurrent = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          isCurrent
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-105"
                            : "bg-white/5 text-gray-400 border border-white/5 hover:border-cyan-400/30 hover:text-white hover:bg-white/10"
                        }`}
                        aria-label={`Ke halaman ${page}`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1"
                  aria-label="Halaman berikutnya"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
