import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Rocket,
  Compass,
  ArrowRight,
  RotateCcw,
  Layers,
  Send,
  ChevronUp,
  Cpu,
  Laptop
} from "lucide-react";

import { APPS_DATA } from "./data/appsData";
import AppStats from "./components/AppStats";
import AppFilters from "./components/AppFilters";
import AppCard from "./components/AppCard";
import AppModal from "./components/AppModal";

export default function DaftarListApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Set page document title
  useEffect(() => {
    document.title = "Daftar Aplikasi & Tools | My Portfolio";
    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter & Sort Logic
  const filteredApps = useMemo(() => {
    let result = [...APPS_DATA];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((app) => app.category === selectedCategory);
    }

    // Filter by Status
    if (selectedStatus !== "all") {
      result = result.filter((app) => app.status === selectedStatus);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((app) => {
        const titleMatch = app.title.toLowerCase().includes(q);
        const subMatch = app.subtitle?.toLowerCase().includes(q);
        const descMatch = app.description?.toLowerCase().includes(q);
        const catMatch = app.categoryLabel?.toLowerCase().includes(q);
        const techMatch = app.techStack?.some((t) => t.toLowerCase().includes(q));
        const featMatch = app.keyFeatures?.some((f) => f.toLowerCase().includes(q));
        return titleMatch || subMatch || descMatch || catMatch || techMatch || featMatch;
      });
    }

    // Sort Logic
    if (sortBy === "popular") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.releaseYear.localeCompare(a.releaseYear));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient decorative glowing orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-80 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* ━━━ HERO HEADER ━━━ */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>App Hub & Web Tools Directory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight"
          >
            Daftar Aplikasi{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Karya Saya
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Jelajahi seluruh aplikasi web interaktif, mini tools, platform komunitas, sistem portofolio, dan proyek teknologi yang telah saya kembangkan. Klik pada aplikasi untuk meluncurkan atau melihat detail fiturnya.
          </motion.p>
        </div>

        {/* ━━━ QUICK METRICS STATS ━━━ */}
        <AppStats apps={APPS_DATA} />

        {/* ━━━ FILTER & SEARCH BAR ━━━ */}
        <AppFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalResults={filteredApps.length}
        />

        {/* ━━━ APPS GRID / LIST ━━━ */}
        {filteredApps.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }
          >
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                viewMode={viewMode}
                onSelect={(selected) => setSelectedApp(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 rounded-3xl bg-[#111c34]/50 border border-white/10 backdrop-blur-xl max-w-lg mx-auto"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Aplikasi Tidak Ditemukan
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Tidak ada aplikasi yang cocok dengan kata kunci "<strong>{searchQuery}</strong>"
              atau filter yang dipilih. Coba cari dengan kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Semua Filter</span>
            </button>
          </motion.div>
        )}

        {/* ━━━ COLLABORATION CALL TO ACTION BANNER ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
              Kolaborasi & Pengembangan
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Punya Ide Aplikasi atau Ingin Bekerja Sama?
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              Saya selalu terbuka untuk mendiskusikan pembuatan aplikasi baru, integrasi web interaktif, atau proyek kolaboratif lainnya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-900 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>Hubungi Saya</span>
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors"
            >
              <span>Katalog Proyek</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ━━━ QUICK VIEW MODAL ━━━ */}
      {selectedApp && (
        <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      {/* ━━━ SCROLL TO TOP FLOATING BUTTON ━━━ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/40 backdrop-blur-xl shadow-xl shadow-cyan-950/50 transition-all z-40 hover:scale-110"
            aria-label="Kembali ke atas"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
