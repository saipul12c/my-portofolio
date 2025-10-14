import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, X, Search } from "lucide-react";
import testimonialsData from "../data/testimoni/testimonials.json";

export default function Testimoni() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🧠 Proses data
  const processedTestimonials = useMemo(() => {
    const now = new Date();
    return testimonialsData
      .map((t) => {
        const date = new Date(t.date);
        const diffMonths =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());
        return { ...t, isNew: diffMonths < 6 };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // 🔍 Filter pencarian
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return processedTestimonials.filter((t) =>
      [t.name, t.role, t.project, t.company]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [processedTestimonials, searchQuery]);

  // ⭐ Rata-rata rating
  const avgRating = useMemo(() => {
    const total = testimonialsData.reduce((acc, t) => acc + t.rating, 0);
    return (total / testimonialsData.length).toFixed(2);
  }, []);

  // 💎 Komponen kartu
  const Card = ({ t }) => (
    <motion.div
      layout
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
      onClick={() => setSelected(t)}
      className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/15 rounded-3xl 
                 p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_40px_rgba(34,211,238,0.25)]
                 transition-all cursor-pointer group"
    >
      {t.isNew && (
        <span className="absolute top-4 left-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-[10px] uppercase tracking-wide font-bold px-3 py-1 rounded-full shadow-md">
          Baru
        </span>
      )}
      <Quote className="absolute top-6 right-8 text-cyan-400 w-5 h-5 opacity-70 group-hover:rotate-12 transition-transform" />

      <div className="flex flex-col items-center text-center space-y-4">
        <img
          src={t.image}
          alt={t.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
        />
        <h3 className="text-lg font-semibold text-white">{t.name}</h3>
        <p className="text-sm text-cyan-300">{t.role}</p>
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
          {t.text}
        </p>
        <div className="flex justify-center gap-1 pt-2">
          {[...Array(Math.round(t.rating))].map((_, i) => (
            <Star key={i} size={17} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-24 relative overflow-hidden">
      {/* 🌈 Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* ✨ Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6 mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Testimoni & Kolaborasi
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Cerita dan pengalaman kolaborasi profesional bersama Syaiful.
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Star size={20} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-semibold">
            Rata-rata: {avgRating} / 5
          </span>
        </div>
      </motion.div>

      {/* 🔍 Search */}
      <div className="relative mb-14 w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari nama, peran, atau proyek..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />
      </div>

      {/* 🧱 Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-24"
      >
        {filtered.map((t) => (
          <Card key={t.id} t={t} />
        ))}
      </motion.div>

      {/* 📦 Tidak ada hasil */}
      {filtered.length === 0 && (
        <p className="text-gray-400 italic">Tidak ada hasil ditemukan...</p>
      )}

      {/* 🪄 Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative bg-gradient-to-br from-[#1e293b]/95 via-[#0f172a]/95 to-[#1e293b]/95 
                         text-white rounded-3xl p-10 sm:p-12 md:p-14 w-full max-w-2xl 
                         border border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.3)] overflow-y-auto max-h-[85vh]"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-cyan-400 transition"
              >
                <X size={28} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl bg-cyan-400/20 rounded-full" />
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-cyan-400 shadow-xl"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-semibold">{selected.name}</h3>
                  <p className="text-cyan-300">{selected.role}</p>
                  <p className="text-gray-400 text-sm italic">{selected.company}</p>
                </div>

                <div className="flex justify-center gap-1">
                  {[...Array(Math.round(selected.rating))].map((_, idx) => (
                    <Star key={idx} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <motion.div
                className="mt-8 text-gray-300 leading-relaxed text-base md:text-lg space-y-6 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="italic border-l-4 border-cyan-400/50 pl-4 text-gray-200">
                  “{selected.text}”
                </p>

                <div className="text-sm md:text-base text-gray-400 space-y-1">
                  <p>
                    <span className="font-semibold text-cyan-400">Proyek:</span>{" "}
                    {selected.project}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-400">Tanggal:</span>{" "}
                    {selected.date}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
