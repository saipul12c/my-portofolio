import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { PlayCircle, UserCheck, Tag, AlertCircle, Play } from "lucide-react";
import { filterMediaItems } from "../utils/filterHelpers";
import { GALLERY_CONFIG } from "../utils/constants";
import { sanitizeUrl } from "../utils/sanitizers";
import { getMediaPoster } from "../utils/mediaEmbed";

function VideoCardItem({ vid, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = getMediaPoster(vid);
  const isVideoPoster = /\.(mp4|webm|ogg|mov)$/i.test(posterUrl);

  return (
    <motion.div
      key={vid.id}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect && onSelect(vid)}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400 transition-all cursor-pointer group shadow-lg"
    >
      {/* Video Poster Thumbnail with Play button overlay */}
      <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-black">
        {isVideoPoster || imgError ? (
          <video
            src={`${sanitizeUrl(vid.src)}#t=0.5`}
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          />
        ) : (
          <img
            src={sanitizeUrl(posterUrl)}
            alt={vid.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Play Button Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Overlay saat hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-all p-5 flex flex-col justify-end pointer-events-none">
        <h3 className="text-lg font-semibold text-white">{vid.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{vid.category}</p>

        {/* Creator */}
        {vid.creator && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={sanitizeUrl(vid.creator.avatar, 'https://randomuser.me/api/portraits/lego/2.jpg')}
              alt={`${vid.creator.display_name} avatar`}
              className="w-6 h-6 rounded-full border border-white/20"
              loading="lazy"
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
                className="text-xs bg-purple-500/20 border border-purple-400/30 text-purple-300 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
            {vid.tags.length > 3 && (
              <span className="text-xs bg-purple-500/20 border border-purple-400/30 text-purple-300 px-2 py-1 rounded-full">
                +{vid.tags.length - 3} lainnya
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GalleryVideosComponent({ items, onSelect, filterSettings = {} }) {
  const [visibleCount, setVisibleCount] = useState(GALLERY_CONFIG.INITIAL_VISIBLE_COUNT);
  const [localData, setLocalData] = useState([]);
  const sentinelRef = useRef(null);

  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // Fallback to local import only if items prop is not provided
  useEffect(() => {
    if (items) return;
    let mounted = true;
    import("../../../data/gallery/videos.json")
      .then((m) => {
        if (!mounted) return;
        setLocalData(m.default || []);
      })
      .catch((err) => console.error("Failed to load videos.json", err));
    return () => { mounted = false; };
  }, [items]);

  const rawData = items || localData;

  // 🔍 Filter videos based on search and tags
  const filteredVideos = useMemo(() => {
    return filterMediaItems(rawData, searchTerm, selectedTags);
  }, [rawData, searchTerm, selectedTags]);

  const hasNoData = filteredVideos.length === 0;

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(GALLERY_CONFIG.INITIAL_VISIBLE_COUNT);
  }, [searchTerm, selectedTags]);

  // Smooth infinite scroll using modern IntersectionObserver (zero scroll-jank & no forced reflow)
  useEffect(() => {
    if (!sentinelRef.current || visibleCount >= filteredVideos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + GALLERY_CONFIG.LOAD_MORE_COUNT, filteredVideos.length));
        }
      },
      { rootMargin: "250px" }
    );

    const currentSentinel = sentinelRef.current;
    observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [visibleCount, filteredVideos.length]);

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
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredVideos.slice(0, visibleCount).map((vid) => (
              <VideoCardItem key={vid.id} vid={vid} onSelect={onSelect} />
            ))}
          </motion.div>

          {/* Sentinel element for infinite scroll */}
          {visibleCount < filteredVideos.length && (
            <div ref={sentinelRef} className="w-full flex justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Memuat video lainnya...</span>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default React.memo(GalleryVideosComponent);

