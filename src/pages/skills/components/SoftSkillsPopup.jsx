// SoftSkillsPopup.jsx
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatYouTubeURL, levelToProgress } from "./SoftSkillsUtils";

export default function SoftSkillsPopup({ selectedSkill, setSelectedSkill, navigate }) {
  const handleClose = useCallback(() => {
    setSelectedSkill(null);
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/SoftSkills");
    }
  }, [setSelectedSkill, navigate]);

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    if (!selectedSkill) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSkill, handleClose]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (selectedSkill) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedSkill]);

  return (
    <AnimatePresence>
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleClose}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900/90 border border-gray-700 rounded-2xl shadow-2xl max-w-3xl md:max-w-5xl w-full overflow-y-auto p-4 sm:p-6 relative flex flex-col md:flex-row gap-6 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedSkill.name || "Detail skill"}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition"
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="flex-1 space-y-3 min-w-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                {selectedSkill.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-2xl bg-white/20 font-medium">
                  {selectedSkill.category}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-2xl font-medium ${selectedSkill.levelColor || "bg-cyan-500 text-white"}`}
                >
                  {selectedSkill.level}
                </span>
                {selectedSkill.labels?.map((label, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-2xl font-semibold shadow-sm ${
                      selectedSkill.labelColorMap?.[label] || "bg-emerald-500 text-white"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed">{selectedSkill.description}</p>

              {selectedSkill.examples?.length > 0 && (
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-2 text-sm">
                    Contoh Penerapan:
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {selectedSkill.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Bar dengan label jelas */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-gray-300">
                  <span>Tingkat Kemahiran ({selectedSkill.level})</span>
                  <span className="text-cyan-400 font-semibold">{levelToProgress(selectedSkill.level)}%</span>
                </div>
                <div className="w-full bg-gray-700/60 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="h-2.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${levelToProgress(selectedSkill.level)}%`,
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Tags */}
              {selectedSkill.tags?.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {selectedSkill.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-gray-800 border border-white/10 text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {selectedSkill.video && (
              <div className="flex-1 flex flex-col items-center min-w-0">
                <h3 className="text-pink-400 font-semibold mb-2">
                  Video Pendukung
                </h3>
                {(() => {
                  const videoURL = selectedSkill.video;
                  const embedURL = formatYouTubeURL(videoURL);
                  const isShorts = /shorts[/?]/i.test(videoURL || "");
                  
                  if (!embedURL) {
                    return (
                      <div className="w-full p-6 bg-gray-800/80 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-center min-h-[180px]">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-xl mb-3">
                          🎬
                        </div>
                        <p className="text-sm font-semibold text-gray-200 mb-1">
                          Video Praktik Belum Tersedia
                        </p>
                        <p className="text-xs text-gray-400 max-w-xs">
                          Dokumentasi video implementasi untuk kemampuan ini akan segera diperbarui.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div
                      className={`overflow-hidden shadow-lg border border-gray-700 rounded-xl bg-black flex justify-center items-center ${
                        isShorts
                          ? "w-[220px] sm:w-[250px] md:w-[280px] aspect-[9/16] max-h-[420px]"
                          : "w-full aspect-video max-h-[360px]"
                      }`}
                    >
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={embedURL}
                        title={selectedSkill.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}