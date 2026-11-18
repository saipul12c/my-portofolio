import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Image, UserCheck, Tag, ChevronLeft, ChevronRight, AlertCircle, Layers, MoreHorizontal } from "lucide-react";
import { filterMediaItems } from "../utils/filterHelpers";
import { GALLERY_CONFIG } from "../utils/constants";
import { sanitizeUrl } from "../utils/sanitizers";

function GalleryAlbumsComponent({ items, onSelect, filterSettings = {} }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localData, setLocalData] = useState([]);
  const albumsPerPage = GALLERY_CONFIG.ITEMS_PER_PAGE.ALBUMS;
  
  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // Fallback to local import only if items prop is not provided
  useEffect(() => {
    if (items) return;
    let mounted = true;
    import("../../../data/gallery/albums.json")
      .then((m) => {
        if (!mounted) return;
        setLocalData((m.default || []).map(item => ({ ...item, type: "album" })));
      })
      .catch((err) => console.error("Failed to load albums.json", err));
    return () => { mounted = false; };
  }, [items]);

  const rawData = items || localData;

  // 🔍 Filter albums based on search and tags
  const filteredAlbums = useMemo(() => {
    return filterMediaItems(rawData, searchTerm, selectedTags);
  }, [rawData, searchTerm, selectedTags]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);
  const startIndex = (currentPage - 1) * albumsPerPage;
  const currentAlbums = filteredAlbums.slice(startIndex, startIndex + albumsPerPage);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

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

  const hasNoData = filteredAlbums.length === 0;

  return (
    <section className="w-full max-w-7xl mb-24">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-pink-300">
        <Image className="w-6 h-6" /> Koleksi Album 📸
      </h2>
      
      {hasNoData ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-500/10 border border-pink-400/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
        >
          <AlertCircle className="w-12 h-12 text-pink-400 mb-3" />
          <h3 className="text-lg font-semibold text-pink-300 mb-2">Tidak Ada Album</h3>
          <p className="text-gray-400">
            Tidak ada album yang ditemukan sesuai dengan pencarian Anda. Coba ubah filter atau cari istilah lain.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Album Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentAlbums.map((alb) => {
              const coverSrc = Array.isArray(alb.src) ? alb.src[0] : alb.src;
              const photoCount = Array.isArray(alb.src) ? alb.src.length : 1;

              return (
                <motion.div
                  key={alb.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelect && onSelect(alb)}
                  className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400 transition-all cursor-pointer group shadow-lg"
                >
                  {/* Cover album */}
                  <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-black">
                    <img
                      src={sanitizeUrl(coverSrc, "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=900&q=80")}
                      alt={alb.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Multiple photos indicator badge */}
                    {photoCount > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-pink-300 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-pink-400/30">
                        <Layers size={13} />
                        <span>{photoCount} foto</span>
                      </div>
                    )}
                  </div>

                  {/* Overlay saat hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-all p-5 flex flex-col justify-end pointer-events-none">
                    <h3 className="text-lg font-semibold text-white">{alb.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{alb.category}</p>

                    {/* Creator */}
                    {alb.creator && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={sanitizeUrl(alb.creator.avatar, 'https://randomuser.me/api/portraits/lego/3.jpg')}
                          alt={`${alb.creator.display_name} avatar`}
                          className="w-6 h-6 rounded-full border border-white/20"
                          loading="lazy"
                        />
                        <p className="text-xs text-pink-300 flex items-center gap-1">
                          {alb.creator.display_name}
                          {alb.creator.verified && <UserCheck size={12} />}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {alb.tags && (
                      <div className="flex flex-wrap gap-1">
                        {alb.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-pink-500/20 border border-pink-400/30 text-pink-300 px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                        {alb.tags.length > 3 && (
                          <span className="text-xs bg-pink-500/20 border border-pink-400/30 text-pink-300 px-2 py-1 rounded-full">
                            +{alb.tags.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Pagination Controls - Hanya muncul jika lebih dari 9 album */}
          {filteredAlbums.length > albumsPerPage && (
            <motion.div 
              className="flex justify-center items-center gap-4 mt-12 p-4 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Previous Button */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Go to previous page"
                aria-disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers with Ellipsis */}
              <div className="flex gap-1 flex-wrap justify-center items-center">
                {visiblePages.map((page, idx) => {
                  if (page === "ellipsis") {
                    return (
                      <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
                        <MoreHorizontal size={14} />
                      </span>
                    );
                  }

                  const isCurrent = currentPage === page;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? "bg-pink-500 text-white border border-pink-400 font-bold"
                          : "bg-white/5 border border-white/10 text-gray-300 hover:bg-pink-500/20 hover:border-pink-400/30"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Go to next page"
                aria-disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}

export default React.memo(GalleryAlbumsComponent);