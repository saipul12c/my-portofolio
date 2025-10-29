import { useState, useMemo } from "react";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import * as Icons from "lucide-react";
import hobbiesData from "../../data/hub/hobbiesData.json";

export default function Hobbies() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Ambil semua kategori unik (pakai useMemo biar nggak ngulang tiap render)
  const categories = useMemo(
    () => ["Semua", ...new Set(hobbiesData.map((h) => h.category))],
    []
  );

  // Label acak 35% (diproses sekali aja)
  const hobbiesWithLabels = useMemo(() => {
    const labelTypes = ["🔥 Hot", "🆕 Baru", "⭐ Rekomendasi"];
    return hobbiesData.map((h) => {
      const hasLabel = Math.random() < 0.35;
      return hasLabel
        ? { ...h, label: labelTypes[Math.floor(Math.random() * labelTypes.length)] }
        : { ...h, label: null };
    });
  }, []); // ✅ sekarang aman, gak ada dependency warning

  // Urutkan: label di atas
  const sortedHobbies = useMemo(() => {
    return hobbiesWithLabels.sort((a, b) =>
      a.label && !b.label ? -1 : !a.label && b.label ? 1 : 0
    );
  }, [hobbiesWithLabels]);

  // Filter kategori
  const filteredHobbies = useMemo(() => {
    return selectedCategory === "Semua"
      ? sortedHobbies
      : sortedHobbies.filter((h) => h.category === selectedCategory);
  }, [selectedCategory, sortedHobbies]);

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen flex flex-col items-center justify-start px-6 py-24 bg-gradient-to-b from-[#0d111a] via-[#111726] to-[#0d111a] text-white overflow-hidden scroll-smooth">
        {/* === Background Glow === */}
        <div className="absolute inset-0 -z-10 pointer-events-none select-none">
          <div className="absolute top-1/4 left-[10%] w-60 h-60 bg-cyan-400/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 right-[10%] w-64 h-64 bg-purple-400/10 rounded-full blur-[90px]" />
        </div>

        {/* === Header === */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-300">
            Aktivitas & Ketertarikan
          </h1>
          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Hidup bukan cuma kerja dan belajar. Kadang kita butuh waktu buat{" "}
            <span className="text-cyan-300">eksplor</span>,{" "}
            <span className="text-pink-300">berkarya</span>, dan{" "}
            <span className="text-amber-300">bernapas</span> ✨
          </p>
        </m.div>

        {/* === Category Filter === */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </m.div>

        {/* === Hobby Cards === */}
        <m.section
          layout
          transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredHobbies.map((hobby) => {
              const Icon = Icons[hobby.icon];
              return (
                <m.div
                  key={hobby.title}
                  layoutId={hobby.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="relative group bg-[#141a28]/60 p-7 rounded-2xl border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition-all duration-400 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                >
                  {/* === Floating Label === */}
                  {hobby.label && (
                    <m.span
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute -top-3 left-4 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide shadow-md backdrop-blur-sm ${
                        hobby.label.includes("Hot")
                          ? "bg-red-500/30 text-red-200"
                          : hobby.label.includes("Baru")
                          ? "bg-green-500/30 text-green-200"
                          : "bg-amber-500/30 text-amber-200"
                      }`}
                    >
                      {hobby.label}
                    </m.span>
                  )}

                  <div className="mb-5 flex items-center justify-between">
                    <Icon size={32} className={`${hobby.iconColor}`} />
                    <span className="text-xs uppercase tracking-wide text-white/50">
                      {hobby.category}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-cyan-300 transition-colors">
                    {hobby.title}
                  </h2>

                  <p className="text-gray-400 text-[14px] leading-relaxed">
                    {hobby.desc}
                  </p>

                  {hobby.link && (
                    <a
                      href={hobby.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm text-cyan-300 font-medium hover:underline"
                    >
                      {hobby.linkLabel} →
                    </a>
                  )}
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.section>
      </main>
    </LazyMotion>
  );
}
