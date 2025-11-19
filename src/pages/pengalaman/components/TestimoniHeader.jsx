import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimoniHeader({ avgRating }) {
  return (
    <div className="flex justify-center w-full">
      <motion.div
        className="text-center w-full max-w-4xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mb-6 sm:mb-10 md:mb-12 lg:mb-16 px-2 sm:px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Testimoni & Kolaborasi
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto px-1">
          Setiap langkah adalah perjuangan, setiap karya adalah kontribusi. Dalam
          setiap kolaborasi, saya mengedepankan integritas, keberanian untuk
          berinovasi, serta kepemimpinan yang memberi dampak.
        </p>
        <div className="flex justify-center gap-2 mt-2 items-center">
          <Star size={16} className="text-yellow-400 fill-yellow-400 sm:w-5 sm:h-5" />
          <span className="text-yellow-400 font-semibold text-sm sm:text-base">
            Rata-rata: {avgRating} / 5
          </span>
        </div>
      </motion.div>
    </div>
  );
}