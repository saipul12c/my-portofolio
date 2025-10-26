import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function InterestsSection({ interests }) {
  // 🔒 Cegah error ketika data belum tersedia atau tidak sesuai format
  if (!interests || !Array.isArray(interests.list) || interests.list.length === 0) {
    return null; // Tidak tampil apa-apa jika datanya belum siap
  }

  return (
    <motion.section
      className="mt-24 w-full max-w-6xl text-center pb-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Heart className="w-10 h-10 text-red-400 mx-auto mb-3 animate-pulse" />

      {/* Jika title belum ada, hindari tampil "undefined" */}
      <h3 className="text-3xl font-extrabold text-red-300 mb-6">
        {interests.title || ""}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {interests.list.map((interest, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl border border-red-400/20 rounded-2xl p-6 hover:scale-105 transition"
          >
            <h4 className="text-xl font-semibold text-red-300 mb-2">
              {interest.name || "Tanpa Judul"}
            </h4>
            <p className="text-gray-300 text-sm">
              {interest.description || ""}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
