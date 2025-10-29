import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimoniHeader({ avgRating }) {
  return (
    <motion.div
      className="text-center max-w-3xl space-y-4 sm:space-y-6 mb-8 sm:mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
        Testimoni & Kolaborasi
      </h1>
      <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
        Setiap langkah adalah perjuangan, setiap karya adalah kontribusi. Dalam
        setiap kolaborasi, saya mengedepankan integritas, keberanian untuk
        berinovasi, serta kepemimpinan yang memberi dampak.
      </p>
      <div className="flex justify-center gap-2 mt-2 items-center">
        <Star size={18} className="text-yellow-400 fill-yellow-400" />
        <span className="text-yellow-400 font-semibold">
          Rata-rata: {avgRating} / 5
        </span>
      </div>
    </motion.div>
  );
}
