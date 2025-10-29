import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Calendar, MapPin, Tag, Play } from "lucide-react";
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

export default function GalleryShorts({ onSelect }) {
  const ITEMS_PER_PAGE = 3;
  const MAX_PAGES_DISPLAY = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // 🔄 Filter hanya video lokal & bagi data per halaman
  const pages = useMemo(() => {
    const localVideos = shortsData.filter((short) => isLocalVideo(short.src));
    const shuffled = shuffleArray(localVideos);
    const totalPages = Math.ceil(shuffled.length / ITEMS_PER_PAGE);
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      chunks.push(shuffled.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return chunks;
  }, []);

  const currentData = pages[currentPage - 1] || [];

  return (
    <section className="w-full max-w-7xl mx-auto mb-24">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-cyan-300">
        <Film className="w-6 h-6" /> Shorts Video 🎬
      </h2>

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
              onClick={() => onSelect && onSelect(short, currentData, index)} // 🔹 kirim data lengkap
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
    </section>
  );
}
