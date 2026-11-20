import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Calendar, MapPin, Tag, Play, AlertCircle } from "lucide-react";
import { filterMediaItems } from "../utils/filterHelpers";
import { GALLERY_CONFIG } from "../utils/constants";
import { sanitizeUrl } from "../utils/sanitizers";
import { getMediaPoster } from "../utils/mediaEmbed";

function ShortCardItem({ short, index, currentData, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = getMediaPoster(short);
  const isVideoPoster = /\.(mp4|webm|ogg|mov)$/i.test(posterUrl);

  return (
    <motion.div
      key={short.id}
      onClick={() => onSelect && onSelect(short, currentData, index)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 border border-white/10 hover:border-cyan-400/50 transition-colors shadow-lg"
    >
      {/* Poster Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        {isVideoPoster || imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950/40 to-slate-900 p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-cyan-500/80 backdrop-blur-sm flex items-center justify-center text-black shadow-xl transform scale-90 group-hover:scale-100 transition-transform mb-2">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
            <span className="text-xs text-cyan-300 font-medium line-clamp-1">{short.title}</span>
          </div>
        ) : (
          <img
            src={sanitizeUrl(posterUrl)}
            alt={short.title}
            decoding="async"
            loading={index < 4 ? "eager" : "lazy"}
            fetchpriority={index < 4 ? "high" : "low"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        )}

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex flex-col gap-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            {short.title}
          </h3>
          <p className="text-sm text-cyan-300 font-medium">
            @{short.creator?.username || "anonim"}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Calendar size={13} className="text-cyan-400" />
            <span>{short.date || "2024"}</span>
            <span className="text-gray-500">•</span>
            <MapPin size={13} className="text-pink-400" />
            <span>{short.location || "Indonesia"}</span>
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

        {/* Play Button Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-cyan-500/80 backdrop-blur-sm flex items-center justify-center text-black shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GalleryShortsComponent({ items, onSelect, filterSettings = {} }) {
  const ITEMS_PER_PAGE = GALLERY_CONFIG.ITEMS_PER_PAGE.SHORTS;
  const MAX_PAGES_DISPLAY = GALLERY_CONFIG.MAX_PAGES_DISPLAY;
  const [currentPage, setCurrentPage] = useState(1);
  const [localData, setLocalData] = useState([]);
  
  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // Fallback to local import only if items prop is not provided
  useEffect(() => {
    if (items) return;
    let mounted = true;
    import("../../../data/gallery/shorts.json")
      .then((m) => {
        if (!mounted) return;
        setLocalData(m.default || []);
      })
      .catch((err) => console.error("Failed to load shorts.json", err));
    return () => { mounted = false; };
  }, [items]);

  const rawData = items || localData;

  // Filter data per halaman (stable order, no random re-shuffling on keystroke)
  const { pages, allFilteredData } = useMemo(() => {
    const filtered = filterMediaItems(rawData, searchTerm, selectedTags);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      chunks.push(filtered.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return { pages: chunks, allFilteredData: filtered };
  }, [rawData, searchTerm, selectedTags, ITEMS_PER_PAGE]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags]);

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
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentData.map((short, index) => (
              <ShortCardItem
                key={short.id}
                short={short}
                index={index}
                currentData={currentData}
                onSelect={onSelect}
              />
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
                      ? "bg-cyan-400 text-black border-cyan-400 font-bold"
                      : "border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
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

export default React.memo(GalleryShortsComponent);