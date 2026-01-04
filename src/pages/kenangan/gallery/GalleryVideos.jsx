import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { PlayCircle, UserCheck, Tag, AlertCircle } from "lucide-react";
import { filterMediaItems } from "../utils/filterHelpers";
import { GALLERY_CONFIG } from "../utils/constants";
import { sanitizeVideoUrl, sanitizeUrl } from "../utils/sanitizers";

// load videos lazily to avoid bundling large json into main chunk

export default function GalleryVideos({ onSelect, filterSettings = {}, onFilteredDataChange }) {
  const [visibleCount, setVisibleCount] = useState(GALLERY_CONFIG.INITIAL_VISIBLE_COUNT);
  const [videos, setVideos] = useState([]);
  const tickingRef = useRef(false);

  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  useEffect(() => {
    let mounted = true;
    import("../../../data/gallery/videos.json")
      .then((m) => {
        if (!mounted) return;
        setVideos(m.default || []);
      })
      .catch((err) => console.error("Failed to load videos.json", err));
    return () => { mounted = false; };
  }, []);

  // 🔍 Filter videos based on search and tags
  const filteredVideos = useMemo(() => {
    return filterMediaItems(videos, searchTerm, selectedTags);
  }, [videos, searchTerm, selectedTags]);

  // 📢 Notify parent of filtered data (use effect to avoid updates during render)
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredVideos.slice(0, visibleCount));
    }
  }, [filteredVideos, visibleCount, onFilteredDataChange]);

  const hasNoData = filteredVideos.length === 0;

  // Reset visibleCount when filters change (prevents memory leak)
  useEffect(() => {
    setVisibleCount(GALLERY_CONFIG.INITIAL_VISIBLE_COUNT);
  }, [searchTerm, selectedTags]);

  // Infinite scroll with max limit
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - GALLERY_CONFIG.SCROLL_THRESHOLD) {
          setVisibleCount((prev) => Math.min(prev + GALLERY_CONFIG.LOAD_MORE_COUNT, filteredVideos.length));
        }
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      tickingRef.current = false;
    };
  }, [filteredVideos.length]);

  return (
    <section className="w-full max-w-7xl mb-24">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-purple-300">
        <PlayCircle className="w-6 h-6" /> Video Seru 🎥
      </h2>

      {hasNoData ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
        >
          <AlertCircle className="w-12 h-12 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Tidak Ada Video Seru</h3>
          <p className="text-gray-400">
            Tidak ada video yang ditemukan sesuai dengan pencarian Anda. Coba ubah filter atau cari istilah lain.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {filteredVideos.slice(0, visibleCount).map((vid) => (
          <motion.div
            key={vid.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(vid)}
            className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400 transition-all cursor-pointer group"
          >
            {/* Video Preview (do not autoplay in grid) */}
            <video
              src={sanitizeVideoUrl(vid.src)}
              muted
              loop
              preload="none"
              className="w-full h-64 object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition"
              aria-label={`Video: ${vid.title}`}
            />

            {/* Overlay saat hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all p-5 flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white">{vid.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{vid.category}</p>

              {/* Creator */}
              {vid.creator && (
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={sanitizeUrl(vid.creator.avatar, '/default-avatar.jpg')}
                    alt={`${vid.creator.display_name} avatar`}
                    className="w-6 h-6 rounded-full border border-white/20"
                  />
                  <p className="text-xs text-cyan-300 flex items-center gap-1">
                    {vid.creator.display_name}
                    {vid.creator.verified && <UserCheck size={12} />}
                  </p>
                </div>
              )}

              {/* Tags */}
              {vid.tags && (
                <div className="flex flex-wrap gap-1">
                  {vid.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-500/10 border border-purple-400/30 text-purple-300 px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                  {vid.tags.length > 3 && (
                    <span className="text-xs bg-purple-500/10 border border-purple-400/30 text-purple-300 px-2 py-1 rounded-full">
                      +{vid.tags.length - 3} lainnya
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
