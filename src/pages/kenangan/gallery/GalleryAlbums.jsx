import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Image, UserCheck, Tag, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import albums from "../../../data/gallery/albums.json";

// 🔍 Filter helper function
function filterAlbums(albumList, searchTerm = "", selectedTags = []) {
  let filtered = albumList;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (alb) =>
        alb.title?.toLowerCase().includes(term) ||
        alb.desc?.toLowerCase().includes(term) ||
        alb.category?.toLowerCase().includes(term) ||
        alb.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  if (selectedTags.length > 0) {
    filtered = filtered.filter((alb) =>
      selectedTags.some((tag) => alb.tags?.includes(tag))
    );
  }

  return filtered;
}

export default function GalleryAlbums({ onSelect, filterSettings = {}, onFilteredDataChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const albumsPerPage = 9;
  
  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // 🔍 Filter albums based on search and tags
  const filteredAlbums = useMemo(() => {
    return filterAlbums(albums, searchTerm, selectedTags);
  }, [searchTerm, selectedTags]);

  // 📢 Notify parent of filtered data
  useMemo(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredAlbums);
    }
  }, [filteredAlbums, onFilteredDataChange]);

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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {currentAlbums.map((alb) => (
          <motion.div
            key={alb.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(alb)}
            className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400 transition-all cursor-pointer group"
          >
            {/* Cover album */}
            <img
              src={alb.src[0]}
              alt={alb.title}
              loading="lazy"
              className="w-full h-64 object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition"
            />

            {/* Overlay saat hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all p-5 flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white">{alb.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{alb.category}</p>

              {/* Creator */}
              {alb.creator && (
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={alb.creator.avatar}
                    alt={alb.creator.display_name}
                    className="w-6 h-6 rounded-full border border-white/20"
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
                      className="text-xs bg-pink-500/10 border border-pink-400/30 text-pink-300 px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                  {alb.tags.length > 3 && (
                    <span className="text-xs bg-pink-500/10 border border-pink-400/30 text-pink-300 px-2 py-1 rounded-full">
                      +{alb.tags.length - 3} lainnya
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
          </motion.div>

          {/* Pagination Controls - Hanya muncul jika lebih dari 9 album */}
          {filteredAlbums.length > albumsPerPage && (
            <motion.div 
              className="flex justify-center items-center gap-4 mt-12 p-4 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Previous Button */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-pink-500 text-white border border-pink-400"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-pink-500/20 hover:border-pink-400/30"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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