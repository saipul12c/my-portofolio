// SoftSkillsCardGrid.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoftSkillsCardGrid({ filteredSkills, search = "", highlightText, navigate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Hitung total halaman
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);

  // Batasi data yang ditampilkan hanya per halaman
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSkills.slice(start, start + itemsPerPage);
  }, [filteredSkills, currentPage]);

  // Fungsi pembuat range pagination
  const getPageNumbers = () => {
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
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
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        <AnimatePresence>
          {currentData.map((skill, i) => (
            <motion.div
              key={skill.id || `${skill.name}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className={`relative p-6 rounded-3xl shadow-xl border border-gray-700 bg-gradient-to-br ${skill.cardGradient} hover:scale-105 hover:shadow-2xl transition-all cursor-pointer backdrop-blur-lg`}
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