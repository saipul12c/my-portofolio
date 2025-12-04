import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Calendar, MapPin, Tag, Play, AlertCircle } from "lucide-react";
import shortsData from "../../../data/gallery/shorts.json";

// 🔀 Acak urutan data
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ⚙️ Cek apakah file lokal
function isLocalVideo(src) {
  return src && (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg"));
}

// 🔍 Filter helper function
function filterShorts(shorts, searchTerm = "", selectedTags = []) {
  let filtered = shorts;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (short) =>
        short.title?.toLowerCase().includes(term) ||
        short.desc?.toLowerCase().includes(term) ||
        short.category?.toLowerCase().includes(term) ||
        short.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  if (selectedTags.length > 0) {
    filtered = filtered.filter((short) =>
      selectedTags.some((tag) => short.tags?.includes(tag))
    );
  }

  return filtered;
}

export default function GalleryShorts({ onSelect, filterSettings = {}, onFilteredDataChange }) {
  const ITEMS_PER_PAGE = 3;
  const MAX_PAGES_DISPLAY = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // 🔄 Filter hanya video lokal & bagi data per halaman
  const { pages, allFilteredData } = useMemo(() => {
    const localVideos = shortsData.filter((short) => isLocalVideo(short.src));
    const filtered = filterShorts(localVideos, searchTerm, selectedTags);
    const shuffled = shuffleArray(filtered);
    const totalPages = Math.ceil(shuffled.length / ITEMS_PER_PAGE);
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      chunks.push(shuffled.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return { pages: chunks, allFilteredData: filtered };
  }, [searchTerm, selectedTags]);

  // 📢 Notify parent of filtered data (use effect to avoid updates during render)
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(allFilteredData);
    }
  }, [allFilteredData, onFilteredDataChange]);

  const currentData = pages[currentPage - 1] || [];
  const hasNoData = allFilteredData.length === 0;

  return (
    <section className="w-full max-w-7xl mx-auto mb-24">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-cyan-300">
        <Film className="w-6 h-6" /> Shorts Video 🎬
      </h2>

      {hasNoData ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-500/10 border border-cyan-400/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
        >
          <AlertCircle className="w-12 h-12 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">Tidak Ada Short Video</h3>
          <p className="text-gray-400">
            Tidak ada short video yang ditemukan sesuai dengan pencarian Anda. Coba ubah filter atau cari istilah lain.
          </p>
        </motion.div>
      ) : (
        <>
          {/* 🎥 Grid Card ala Shorts */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentData.map((short, index) => (
                <motion.div
                  key={short.id}
                  onClick={() => onSelect && onSelect(short, currentData, index)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 180, damping: 15 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                >
                  {/* 🎬 Video Lokal */}
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <video
                      src={short.src}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex flex-col gap-2">
                      <h3 className="font-semibold text-base leading-tight line-clamp-2">
                        {short.title}
                      </h3>
                      <p className="text-sm text-cyan-300 font-medium">
                        @{short.creator?.username || "anonim"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Calendar size={13} className="text-cyan-400" />
                        <span>{short.date || "Tanggal tidak diketahui"}</span>
                        <span className="text-gray-500">•</span>
                        <MapPin size={13} className="text-pink-400" />
                        <span>{short.location || "Lokasi tidak diketahui"}</span>
                      </div>
                      {short.tags && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {short.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white/10 border border-white/20 rounded-full px-2 py-0.5 text-cyan-300 flex items-center gap-1"
                            >
                              <Tag size={12} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Play Icon Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-16 h-16 text-white/70" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* 📄 Pagination angka */}
          {pages.length > 1 && (
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
              {Array.from({ length: Math.min(pages.length, MAX_PAGES_DISPLAY) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-9 h-9 rounded-md border text-sm font-medium transition-all duration-200 ${
                    currentPage === index + 1
                      ? "bg-cyan-400 text-black border-cyan-400"
                      : "border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}