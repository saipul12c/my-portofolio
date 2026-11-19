import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Info,
  Star,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AppCard({ app, viewMode = "grid", onSelect }) {
  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#111c34]/70 hover:bg-[#152342] border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 shadow-md hover:shadow-cyan-500/10"
      >
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.themeGradient} p-0.5 shadow-md flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform duration-300`}
          >
            <span>{app.emoji || "🚀"}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {app.title}
              </h3>
              {app.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${app.badgeColor}`}>
                  {app.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
              {app.subtitle} &bull; {app.description}
            </p>
          </div>
        </div>

        {/* Center: Category & Tech */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-cyan-300">
            {app.categoryLabel}
          </span>
          {app.techStack?.slice(0, 2).map((tech, i) => (
            <span
              key={i}
              className="hidden lg:inline-block px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-gray-300 border border-slate-700/60"
            >
              {tech}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded-lg">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {app.rating}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
          <button
            onClick={() => onSelect(app)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Detail
          </button>
          <Link
            to={app.path}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <span>{app.category === "projects" ? "Lihat" : "Buka"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#121d38]/90 to-[#0c1426]/90 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden"
    >
      {/* Background ambient glow on hover */}
      <div
        className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: app.glowColor || "rgba(6,182,212,0.4)" }}
      />

      {/* Top Bar: Icon, Category & Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* App Avatar */}
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.themeGradient} p-0.5 shadow-lg shadow-black/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
          >
            <span className="drop-shadow-md">{app.emoji || "🚀"}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5">
            {app.badge && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${app.badgeColor}`}>
                {app.badge}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-cyan-300">
              {app.categoryLabel}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {app.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold ml-2 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {app.rating}
            </span>
          </div>
          <p className="text-xs font-medium text-cyan-400/90 line-clamp-1">
            {app.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-300/80 leading-relaxed line-clamp-3 mb-4">
          {app.description}
        </p>

        {/* Key Features Pill */}
        {app.keyFeatures && (
          <div className="space-y-1.5 mb-4 border-t border-white/5 pt-3">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              Fitur Utama:
            </div>
            <div className="space-y-1">
              {app.keyFeatures.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Tech Stack & Actions */}
      <div className="border-t border-white/5 pt-4 space-y-3 mt-2">
        {/* Tech Chips */}
        <div className="flex flex-wrap gap-1.5">
          {app.techStack?.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-gray-300 border border-white/5"
            >
              {tech}
            </span>
          ))}
          {app.techStack?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-gray-400">
              +{app.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSelect(app)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Detail</span>
          </button>

          <Link
            to={app.path}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
          >
            <span>{app.category === "projects" ? "Lihat" : "Buka"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
