import { motion } from "framer-motion";
import { MapPin, Camera } from "lucide-react";

export default function PhotoLocationInfo({ photo }) {
  // Ekstrak informasi lokasi dari photo
  const { location, category, date_taken, camera, mood } = photo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-3 px-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 hover:border-cyan-400/30 transition-all group"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all">
          <MapPin size={18} className="text-cyan-300" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors truncate">
          {location}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-400">
          <p className="truncate">
            <span className="text-gray-500">Kategori:</span> {category}
          </p>
          <p className="truncate">
            <span className="text-gray-500">Mood:</span> {mood?.split(",")[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
