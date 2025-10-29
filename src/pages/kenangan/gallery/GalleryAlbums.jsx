import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, UserCheck, Tag } from "lucide-react";
import albums from "../../../data/gallery/albums.json";

export default function GalleryAlbums({ onSelect }) {
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setVisibleCount((prev) => prev + 6);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full max-w-7xl mb-24">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-pink-300">
        <Image className="w-6 h-6" /> Koleksi Album 📸
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {albums.slice(0, visibleCount).map((alb) => (
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
    </section>
  );
}
