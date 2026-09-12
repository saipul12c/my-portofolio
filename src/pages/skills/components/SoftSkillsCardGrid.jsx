// SoftSkillsCardGrid.jsx
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoftSkillsCardGrid({ filteredSkills, search = "", highlightText, navigate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset page saat hasil filter atau kata kunci pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSkills.length, search]);

  // Hitung total halaman
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);

  // Pastikan currentPage valid
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

  // Batasi data yang ditampilkan hanya per halaman
  const currentData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredSkills.slice(start, start + itemsPerPage);
  }, [filteredSkills, safeCurrentPage]);

  // Fungsi pembuat range pagination
  const getPageNumbers = () => {
    const maxVisible = 10;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);
    return pages;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* EMPTY STATE */}
      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-10 text-center bg-gray-900/60 border border-white/10 rounded-3xl max-w-md w-full my-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 text-3xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Skill Tidak Ditemukan</h3>
          <p className="text-gray-400 text-sm">
            {search
              ? `Tidak ditemukan hasil untuk "${search}". Silakan coba kata kunci lain atau pilih kategori lain.`
              : "Belum ada skill yang terdaftar dalam filter ini."}
          </p>
        </motion.div>
      )}

      {/* GRID */}
      {filteredSkills.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        <AnimatePresence>
          {currentData.map((skill, i) => (
            <motion.div
              key={skill.id || `${skill.name}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.2) }}
              className={`relative p-6 rounded-3xl shadow-lg border border-white/10 bg-gradient-to-br ${skill.cardGradient} hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-md`}
              onClick={() => skill.id ? navigate(`/SoftSkills/${skill.id}`) : undefined}
            >
              {/* label dan detail skill */}
              {skill.labels?.length > 0 && (
                <div className="absolute -top-4 left-4 flex flex-wrap gap-2 z-10 max-w-[70%]">
                  {skill.labels.map((label, index) => (
                    <span
                      key={index}
                      className={`text-xs font-semibold px-3 py-1 rounded-full shadow truncate ${
                        skill.labelColorMap?.[label] || "bg-gray-600"
                      }`}
                      title={label}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-2xl">
                  {skill.category}
                </span>
                <span className={`text-xs font-medium px-4 py-1 rounded-2xl ${skill.levelColor}`}>
                  {skill.level}
                </span>
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                dangerouslySetInnerHTML={{ __html: highlightText(skill.name, search) }}
              />
              <p
                className="text-gray-100 text-sm leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: highlightText(skill.description || "", search),
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
          >
            ←
          </button>

          {getPageNumbers().map((num, i) =>
            num === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-lg ${
                  num === currentPage
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}