import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Heart, MessageCircle, Share2, Play, Music } from "lucide-react";
import shortsData from "../../data/gallery/shorts.json";

// 🔀 Fungsi acak data (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ⚙️ Fungsi untuk ngecek jenis video
function getVideoType(src) {
  if (!src) return "unknown";
  if (src.includes("youtube.com") || src.includes("youtu.be")) return "youtube";
  if (src.includes("vimeo.com")) return "vimeo";
  if (src.includes("tiktok.com")) return "tiktok";
  if (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg"))
    return "direct";
  return "unknown";
}

// ⚙️ Fungsi ambil ID YouTube/Vimeo/TikTok & bikin embed URL
function getVideoEmbedUrl(src) {
  const type = getVideoType(src);
  if (type === "youtube") {
    const match = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match
      ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`
      : "";
  }
  if (type === "vimeo") {
    const match = src.match(/vimeo\.com\/([0-9]+)/);
    return match
      ? `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1`
      : "";
  }
  if (type === "tiktok") {
    // TikTok embed langsung
    return src.replace("www.tiktok.com", "www.tiktok.com/embed");
  }
  return src; // direct video
}

export default function GalleryShorts({ onSelect }) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // 🔄 Acak data dan bagi per halaman
  const pages = useMemo(() => {
    const shuffled = shuffleArray(shortsData);
    const totalPages = Math.ceil(shuffled.length / ITEMS_PER_PAGE);
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      chunks.push(shuffled.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return chunks;
  }, []);

  const currentData = pages[currentPage - 1] || [];

  const nextPage = () => {
    if (currentPage < pages.length) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <section className="w-full max-w-7xl mb-24">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-cyan-300">
        <Film className="w-6 h-6" /> Shorts — Swipe & Chill ⚡
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-cyan-500/40 snap-x snap-mandatory"
        >
          {currentData.map((short) => {
            const type = getVideoType(short.src);
            const embedUrl = getVideoEmbedUrl(short.src);

            return (
              <motion.div
                key={short.id}
                onClick={() => onSelect(short)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
                className="relative flex-shrink-0 w-[240px] sm:w-[300px] aspect-[9/16] bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-[0_0_35px_rgba(34,211,238,0.4)] backdrop-blur-md transition-all duration-300 snap-center"
              >
                {/* 🎥 Video */}
                {type === "direct" ? (
                  <video
                    src={embedUrl}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : type === "youtube" || type === "vimeo" || type === "tiktok" ? (
                  <iframe
                    src={embedUrl}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Video tidak tersedia
                  </div>
                )}

                {/* 🔮 Overlay Info */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  {short.creator && (
                    <div className="flex items-center gap-3">
                      {short.creator.avatar && (
                        <img
                          src={short.creator.avatar}
                          alt={short.creator.display_name || "User"}
                          className="w-8 h-8 rounded-full border border-white/20"
                        />
                      )}
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-white">
                          {short.creator.display_name || "Anonim"}
                          {short.creator.verified && (
                            <span className="ml-1 text-cyan-400 text-xs">✔</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-300">
                          @{short.creator.username || "unknown"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-left">
                    <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
                      {short.title}
                    </h3>
                    {short.music && (
                      <p className="text-xs text-gray-300 flex items-center gap-1">
                        <Music size={14} className="text-cyan-300" />
                        {short.music.title} — {short.music.artist}
                      </p>
                    )}
                  </div>
                </div>

                {/* ❤️ Interaksi */}
                {short.engagement && (
                  <div className="absolute bottom-3 right-3 flex flex-col items-center gap-4 text-white">
                    <div className="flex flex-col items-center">
                      <Heart
                        size={22}
                        className="hover:scale-125 transition-transform text-pink-400"
                      />
                      <span className="text-xs">
                        {short.engagement.likes?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageCircle size={22} />
                      <span className="text-xs">
                        {short.engagement.comments?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Share2 size={22} />
                      <span className="text-xs">
                        {short.engagement.shares?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center opacity-70">
                      <Play size={20} />
                      <span className="text-xs">
                        {short.engagement.views?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-cyan-400/10 to-transparent transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* 📜 Pagination */}
      {pages.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
                : "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
            }`}
          >
            ⬅ Sebelumnya
          </button>
          <span className="text-sm text-gray-400">
            Halaman {currentPage} dari {pages.length}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === pages.length}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              currentPage === pages.length
                ? "opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
                : "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
            }`}
          >
            Berikutnya ➡
          </button>
        </div>
      )}
    </section>
  );
}
