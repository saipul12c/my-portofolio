// AboutSoftSkills.jsx
import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const levelColors = {
  Ahli: {
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    pill: "hover:border-amber-400/50 hover:bg-amber-500/10",
  },
  Mahir: {
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    pill: "hover:border-emerald-400/50 hover:bg-emerald-500/10",
  },
  Menengah: {
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    pill: "hover:border-blue-400/50 hover:bg-blue-500/10",
  },
  Dasar: {
    badge: "bg-slate-700/50 text-slate-300 border-slate-600",
    pill: "hover:border-slate-500 hover:bg-slate-800/50",
  },
};

const SLOT_COUNT = 14; // Jumlah pill yang tampil bersamaan

function AboutSoftSkills({ softSkills }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Semua");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rawSkills = useMemo(() => {
    return softSkills?.skills?.filter((s) => s?.name && s?.level) || [];
  }, [softSkills]);

  const levels = useMemo(() => ["Semua", "Ahli", "Mahir", "Menengah"], []);

  // Filter skills berdasarkan search dan level
  const filteredSkills = useMemo(() => {
    return rawSkills.filter((skill) => {
      const matchSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (skill.tags && skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchLevel = selectedLevel === "Semua" || skill.level === selectedLevel;

      return matchSearch && matchLevel;
    });
  }, [rawSkills, searchQuery, selectedLevel]);

  // State untuk menyimpan daftar skill yang sedang ditampilkan per slot
  const [displayedSkills, setDisplayedSkills] = useState(() => {
    return filteredSkills.slice(0, SLOT_COUNT);
  });

  const activeSlotRef = useRef(0);
  const nextIndexRef = useRef(SLOT_COUNT);

  // Sinkronkan displayedSkills jika filter atau data berubah
  useEffect(() => {
    setDisplayedSkills(filteredSkills.slice(0, SLOT_COUNT));
    activeSlotRef.current = 0;
    nextIndexRef.current = SLOT_COUNT % Math.max(1, filteredSkills.length);
  }, [filteredSkills]);

  // Rotasi: Berganti satu per satu setiap 3 detik secara bergiliran (slot 0 -> 1 -> 2 -> ... -> 0)
  useEffect(() => {
    if (filteredSkills.length <= SLOT_COUNT || isHovered || isExpanded || searchQuery.trim() !== "") {
      return;
    }

    const interval = setInterval(() => {
      setDisplayedSkills((prev) => {
        if (!prev || prev.length === 0) return filteredSkills.slice(0, SLOT_COUNT);

        const slotToUpdate = activeSlotRef.current % prev.length;
        const nextSkill = filteredSkills[nextIndexRef.current % filteredSkills.length];

        // Majukan giliran skill berikutnya dan slot berikutnya
        nextIndexRef.current = (nextIndexRef.current + 1) % filteredSkills.length;
        activeSlotRef.current = (activeSlotRef.current + 1) % prev.length;

        const updated = [...prev];
        updated[slotToUpdate] = nextSkill;
        return updated;
      });
    }, 3000); // ⏱️ Tepat setiap 3 detik sekali

    return () => clearInterval(interval);
  }, [filteredSkills, isHovered, isExpanded, searchQuery]);

  if (!softSkills?.sectionTitle || rawSkills.length === 0) return null;

  const skillsToShow = isExpanded ? filteredSkills : displayedSkills;

  return (
    <section className="mt-28 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative inline-block mb-3">
          <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
          <div className="relative z-10 p-3 bg-[#111c34]/90 rounded-2xl border border-rose-500/30 shadow-lg shadow-rose-950/20">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400">
          {softSkills.sectionTitle}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full my-3" />
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Karakter kepemimpinan, komunikasi empatik, dan kecakapan interpersonal dalam mengajar serta berkolaborasi
        </p>

        {/* Search & Level Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari soft skill..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#111c34]/80 border border-blue-900/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Level Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Badges Cloud dengan Animasi Berganti Satu per Satu setiap 3 Detik */}
      <div
        className="flex flex-wrap justify-center gap-3 min-h-[160px] items-center py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {skillsToShow.map((skill, slotIndex) => {
          if (!skill) return null;
          const config = levelColors[skill.level] || levelColors.Dasar;

          return (
            <div
              key={isExpanded ? skill.id : `slot-${slotIndex}`}
              className="relative inline-block"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <Link
                    to={`/SoftSkills/${skill.id}`}
                    className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111c34]/80 border border-blue-900/40 ${config.pill} backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400`}
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badge}`}
                    >
                      {skill.level}
                    </span>

                    {/* Tooltip on Hover */}
                    {skill.description && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-2.5 rounded-xl bg-[#091122]/95 border border-cyan-500/30 text-slate-200 text-xs font-normal leading-tight opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-2xl z-40 text-left">
                        <p>{skill.description}</p>
                        <div className="text-[10px] text-rose-300 font-semibold mt-1">
                          Klik untuk melihat studi kasus →
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}

        {skillsToShow.length === 0 && (
          <p className="text-slate-400 text-sm py-8">
            Tidak ditemukan soft skill dengan kata kunci "{searchQuery}"
          </p>
        )}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {filteredSkills.length > SLOT_COUNT && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-all hover:scale-105"
          >
            {isExpanded
              ? "Tampilkan Mode Rotasi Otomatis (14)"
              : `Tampilkan Semua (${filteredSkills.length}) Keahlian`}
          </button>
        </div>
      )}

      {/* Footer Link */}
      <div className="mt-10">
        <Link
          to={softSkills?.link || "/softskills"}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-rose-500/20 active:scale-95"
        >
          <Heart className="w-5 h-5" />
          Eksplorasi Matriks Nilai & Soft Skills
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}

export default memo(AboutSoftSkills);
