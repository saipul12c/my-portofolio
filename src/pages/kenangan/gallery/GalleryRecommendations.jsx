import { motion } from "framer-motion";
import { Lightbulb, ChevronRight, Calendar, User } from "lucide-react";
import { useMemo } from "react";

export default function GalleryRecommendations({ allMedia = [], currentMedia = null }) {
  const recommendations = useMemo(() => {
    if (!currentMedia || !allMedia.length) return [];

    const currentTags = new Set(currentMedia.tags || []);
    const scored = allMedia
      .filter((item) => item.id !== currentMedia.id) // Exclude current media
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
      className="w-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-2xl p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" /> Rekomendasi untuk Mu
      </h3>

      <div className="space-y-3">
        {recommendations.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 5 }}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
                <img
                  src={
                    item.type === "album" ? item.src?.[0] : item.src
                  }
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-cyan-300 transition">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span className="inline-block px-2 py-0.5 bg-white/5 rounded text-cyan-300">
                    {item.type}
                  </span>
                  {item.creator && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {item.creator.display_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition flex-shrink-0" />
            </div>
          </motion.div>
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
}
