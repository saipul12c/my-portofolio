import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Award, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";

export default function KKNDetailModal({ item, type, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isGallery = type === "gallery";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#131b2e] to-[#0c1220] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 text-white"
        >
          {/* Header Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {isGallery ? (
            /* Gallery Preview View */
            <div>
              <div className="relative w-full h-72 sm:h-96 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/80 text-white backdrop-blur-md shadow-lg">
                  {item.category}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {item.desc}
                </p>

                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Pillar / Proker Detail View */
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between pr-8">
                <div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3 inline-block">
                    {item.category || "Pilar Program Kerja"}
                  </span>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
                    {item.title || item.name}
                  </h3>
                </div>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {item.description || item.desc}
              </p>

              {item.programs && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                    Daftar Program Kerja Terlaksana:
                  </h4>
                  <div className="space-y-2.5">
                    {item.programs.map((pro, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-white text-sm">{pro.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{pro.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                            {pro.target}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                            {pro.metric}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
