import { motion } from "framer-motion";
import { Lightbulb, ChevronRight, Calendar, User } from "lucide-react";
import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { getMediaRoute } from "../utils/routeHelpers";

const GalleryRecommendations = memo(function GalleryRecommendations({ allMedia = [], currentMedia = null }) {
  const recommendations = useMemo(() => {
    if (!currentMedia || !allMedia.length) return [];

    const currentTags = new Set(currentMedia.tags || []);
    const scored = allMedia
      .filter((item) => String(item.id) !== String(currentMedia.id)) // Exclude current media
      .map((item) => {
        // Score berdasarkan tag match
        const tagMatches = (item.tags || []).filter((tag) =>
          currentTags.has(tag)
        ).length;

        // Score berdasarkan kategori
        const categoryMatch = item.category === currentMedia.category ? 10 : 0;

        // Score berdasarkan creator
        const creatorMatch =
          item.creator?.username === currentMedia.creator?.username ? 15 : 0;

        return {
          ...item,
          score: tagMatches * 5 + categoryMatch + creatorMatch,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return scored;
  }, [allMedia, currentMedia]);

  if (!recommendations.length) return null;

  return (
    <motion.aside
      className="w-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-2xl p-6 mt-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" /> Rekomendasi Terkait untuk Anda
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={getMediaRoute(item.type, item.id)}
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.02, x: 2 }}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 rounded-xl p-3 transition h-full"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                  <img
                    src={
                      item.type === "album"
                        ? item.src?.[0]
                        : item.thumbnail || item.poster || item.src
                    }
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white line-clamp-1 group-hover:text-cyan-300 transition">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="inline-block px-2 py-0.5 bg-cyan-500/10 border border-cyan-400/20 rounded text-cyan-300 capitalize text-[11px]">
                      {item.type}
                    </span>
                    {item.creator && (
                      <span className="flex items-center gap-1 truncate text-gray-300">
                        <User size={12} className="text-gray-400" />
                        <span className="truncate">{item.creator.display_name}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition flex-shrink-0 self-center" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <motion.p
        className="text-xs text-gray-500 mt-4 pt-4 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        💡 Rekomendasi berdasarkan tag, kategori, dan kreator yang relevan
      </motion.p>
    </motion.aside>
  );
});

export default GalleryRecommendations;
