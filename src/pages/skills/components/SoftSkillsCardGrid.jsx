// SoftSkillsCardGrid.jsx
import { useState, useMemo, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { highlightText } from "./SoftSkillsUtils";

const ITEMS_PER_PAGE = 9;

const SoftSkillsCardGrid = memo(({ filteredSkills = [], search = "", navigate }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when search or filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSkills.length, search]);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

  // Current page slice
  const currentData = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredSkills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSkills, safeCurrentPage]);

  // Clean pagination range builder
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    if (safeCurrentPage > 3) pages.push("...");

    const start = Math.max(2, safeCurrentPage - 1);
    const end = Math.min(totalPages - 1, safeCurrentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safeCurrentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const handleCardClick = (skill) => {
    if (skill?.id) {
      navigate(`/softskills/${skill.id}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* EMPTY STATE */}
      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-8 sm:p-10 text-center bg-gray-900/60 border border-white/10 rounded-3xl max-w-md w-full my-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 text-3xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Skill Tidak Ditemukan</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {search
              ? `Tidak ditemukan hasil untuk "${search}". Silakan coba kata kunci lain atau pilih kategori lain.`
              : "Belum ada skill yang terdaftar dalam filter ini."}
          </p>
        </motion.div>
      )}

      {/* CARDS GRID */}
      {filteredSkills.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
          <AnimatePresence mode="popLayout">
            {currentData.map((skill, i) => (
              <motion.div
                key={skill.id || `${skill.name}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.15) }}
                className={`relative p-6 rounded-3xl shadow-lg border border-white/10 bg-gradient-to-br ${
                  skill.cardGradient || "from-slate-900/90 to-cyan-950/40"
                } hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-md flex flex-col justify-between`}
                onClick={() => handleCardClick(skill)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(skill);
                  }
                }}
                aria-label={`Lihat detail ${skill.name}`}
              >
                <div>
                  {/* Labels Badge */}
                  {skill.labels?.length > 0 && (
                    <div className="absolute -top-3 left-4 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
                      {skill.labels.map((label, index) => (
                        <span
                          key={index}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow truncate ${
                            skill.labelColorMap?.[label] || "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                          }`}
                          title={label}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-2 mb-3 mt-1">
                    <span className="bg-white/10 text-gray-200 border border-white/10 text-[11px] font-semibold px-3 py-0.5 rounded-full backdrop-blur-sm">
                      {skill.category}
                    </span>
                    <span className={`text-[11px] font-medium px-3 py-0.5 rounded-full ${skill.levelColor || "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"}`}>
                      {skill.level}
                    </span>
                  </div>

                  {/* Title */}
                  {search ? (
                    <h2
                      className="text-xl sm:text-2xl font-bold mb-2 text-white"
                      dangerouslySetInnerHTML={{ __html: highlightText(skill.name, search) }}
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                      {skill.name}
                    </h2>
                  )}

                  {/* Description */}
                  {search ? (
                    <p
                      className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(skill.description || "", search),
                      }}
                    />
                  ) : (
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {skill.description}
                    </p>
                  )}
                </div>

                {/* Footer preview if examples exist */}
                {skill.examples?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="truncate max-w-[200px] italic">
                      Contoh: {skill.examples[0]}
                    </span>
                    <span className="text-cyan-400 font-medium ml-2">Detail →</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 flex-wrap select-none">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={safeCurrentPage === 1}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors text-white"
            aria-label="Halaman sebelumnya"
          >
            ←
          </button>

          {getPageNumbers().map((num, i) =>
            num === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-500 text-sm">
                …
              </span>
            ) : (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  num === safeCurrentPage
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                }`}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={safeCurrentPage === totalPages}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors text-white"
            aria-label="Halaman selanjutnya"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
});

SoftSkillsCardGrid.displayName = "SoftSkillsCardGrid";
export default SoftSkillsCardGrid;
