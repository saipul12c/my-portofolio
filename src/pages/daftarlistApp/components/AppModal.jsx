import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Sparkles,
  Check,
  Copy,
  Star,
  Calendar,
  Layers,
  Code2,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { getTechLanguageInfo } from "../../../utils/techRouteHelper";

export default function AppModal({ app, onClose }) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!app) return null;

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + app.path;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#131f38] to-[#0c1324] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden z-10 text-white my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Banner & Close */}
          <div className="relative p-6 sm:p-7 border-b border-white/10 bg-gradient-to-r from-blue-950/60 via-slate-900/60 to-purple-950/60">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pr-10">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${app.themeGradient} p-0.5 shadow-lg flex items-center justify-center text-3xl sm:text-4xl shrink-0`}
              >
                <span className="drop-shadow-md">{app.emoji || "🚀"}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {app.categoryLabel}
                  </span>
                  {app.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    {app.status}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {app.title}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300/90 font-medium">
                  {app.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm">
            {/* Preview Banner if image available */}
            {app.image && (
              <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/10 relative shadow-lg">
                <img
                  src={app.image}
                  alt={app.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 drop-shadow flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pratinjau Proyek & Antarmuka</span>
                </div>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div>
                <div className="text-[11px] text-gray-400">Rating</div>
                <div className="font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{app.rating || "5.0"}</span>
                </div>
              </div>
              <div className="border-x border-white/10">
                <div className="text-[11px] text-gray-400">Tahun Rilis</div>
                <div className="font-bold text-cyan-300 flex items-center justify-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{app.releaseYear || "2026"}</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400">Akses</div>
                <div className="font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{app.isInternal ? "Internal Web" : "Eksternal"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Tentang Aplikasi
              </h4>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                {app.description}
              </p>
            </div>

            {/* Highlights Banner if available */}
            {app.highlights && (
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-cyan-200">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {app.highlights}
                </span>
              </div>
            )}

            {/* Key Features */}
            {app.keyFeatures && app.keyFeatures.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Fitur Unggulan
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {app.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-200 text-xs sm:text-sm"
                    >
                      <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {app.techStack && app.techStack.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    Teknologi & Framework
                  </h4>
                  <span className="text-[10px] text-cyan-400/80">Klik badge untuk lihat detail bahasa</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.techStack.map((tech, idx) => {
                    const techInfo = getTechLanguageInfo(tech);
                    return (
                      <Link
                        key={idx}
                        to={techInfo.url}
                        onClick={onClose}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 inline-flex items-center gap-1.5 transition-all shadow-sm"
                        title={techInfo.found ? `Buka detail ${tech} di halaman Bahasa` : `Cari ${tech} di halaman Bahasa`}
                      >
                        <span>{tech}</span>
                        <span className="text-[10px] opacity-70">↗</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer (Action Buttons) */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
              {app.externalLink && (
                <a
                  href={app.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition"
              >
                Tutup
              </button>

              <Link
                to={app.path}
                onClick={onClose}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                <span>{app.category === "projects" ? "Detail Proyek" : "Buka Aplikasi"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
