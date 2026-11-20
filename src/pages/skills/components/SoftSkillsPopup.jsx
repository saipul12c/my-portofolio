// SoftSkillsPopup.jsx
import { useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatYouTubeURL, levelToProgress } from "./SoftSkillsUtils";

const SoftSkillsPopup = memo(({ selectedSkill, setSelectedSkill, navigate }) => {
  const handleClose = useCallback(() => {
    setSelectedSkill(null);
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/softskills");
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleClose}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900/95 border border-gray-700 rounded-3xl shadow-2xl max-w-3xl md:max-w-4xl w-full overflow-y-auto p-5 sm:p-8 relative flex flex-col md:flex-row gap-6 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedSkill.name || "Detail skill"}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer z-10"
              aria-label="Tutup dialog"
            >
              ✕
            </button>

            {/* Content Left */}
            <div className="flex-1 space-y-4 min-w-0 pr-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                {selectedSkill.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-200 font-medium">
                  {selectedSkill.category}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedSkill.levelColor || "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {selectedSkill.level}
                </span>
                {selectedSkill.labels?.map((label, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${
                      selectedSkill.labelColorMap?.[label] || "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {selectedSkill.description}
              </p>

              {/* Examples */}
              {selectedSkill.examples?.length > 0 && (
                <div className="bg-gray-800/40 p-4 rounded-2xl border border-white/5 space-y-2">
                  <h3 className="text-emerald-400 font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡</span> Contoh Penerapan Riil:
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-xs sm:text-sm leading-relaxed">
                    {selectedSkill.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-gray-300">
                  <span>Tingkat Kemahiran ({selectedSkill.level})</span>
                  <span className="text-cyan-400 font-semibold">{levelToProgress(selectedSkill.level)}%</span>
                </div>
                <div className="w-full bg-gray-855 rounded-full h-2.5 overflow-hidden bg-gray-800">
                  <motion.div
                    className="h-2.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${levelToProgress(selectedSkill.level)}%`,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              {/* Tags */}
              {selectedSkill.tags?.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {selectedSkill.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-gray-800/80 border border-white/10 text-gray-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Video Right (if exists) */}
            {selectedSkill.video && (
              <div className="md:w-5/12 flex flex-col items-center justify-center min-w-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-800 md:pl-6">
                <h3 className="text-pink-400 font-semibold text-sm mb-3 self-start flex items-center gap-1.5">
                  <span>🎬</span> Video Dokumentasi
                </h3>
                {(() => {
                  const videoURL = selectedSkill.video;
                  const embedURL = formatYouTubeURL(videoURL);
                  const isShorts = /shorts[/?]/i.test(videoURL || "");

                  if (!embedURL) {
                    return (
                      <div className="w-full p-6 bg-gray-800/50 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-center min-h-[180px]">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-xl mb-3">
                          🎬
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-200 mb-1">
                          Video Belum Tersedia
                        </p>
                        <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed">
                          Dokumentasi video implementasi untuk kemampuan ini akan segera diperbarui.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div
                      className={`overflow-hidden shadow-xl border border-gray-700 rounded-2xl bg-black flex justify-center items-center ${
                        isShorts
                          ? "w-[200px] sm:w-[220px] aspect-[9/16] max-h-[380px]"
                          : "w-full aspect-video max-h-[300px]"
                      }`}
                    >
                      <iframe
                        className="w-full h-full rounded-2xl"
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
});

SoftSkillsPopup.displayName = "SoftSkillsPopup";
export default SoftSkillsPopup;
