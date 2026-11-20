import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import dataBahasa from "../../data/bahasa/data.json";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Import komponen dan hooks
import { useScroll } from "./hooks/useScroll";
import { useDebounce } from "./hooks/useDebounce";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { QuickStats } from "./components/QuickStats";
import { LanguageSection } from "./components/LanguageSection";
import { PageConnections } from "./components/PageConnections";

// Slug generator helper
const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

// ⚡ LONG-TERM SCALABILITY: Pre-index and normalize search keywords at module load
// This prevents running .toLowerCase() repeatedly across all items on every search keystroke
const indexData = (list = []) =>
  list.map((item) => ({
    ...item,
    _slug: slugify(item.nama),
    _searchKey: `${item.nama} ${item.tingkat} ${(item.kemampuan || []).join(" ")}`.toLowerCase(),
  }));

const indexedSehariHari = indexData(dataBahasa.bahasaSehariHari || []);
const indexedPemrograman = indexData(dataBahasa.bahasaPemrograman || []);
const totalCount = indexedSehariHari.length + indexedPemrograman.length;

const Bahasa = () => {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [filterLevel, setFilterLevel] = useState("all");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);
  const [viewMode, setViewMode] = useState("grid");
  const [expandedTags, setExpandedTags] = useState({});
  const { showScrollTop } = useScroll();

  // Debounce search term to prevent excessive re-renders while typing
  const debouncedSearchTerm = useDebounce(searchTerm, 180);

  // High-performance filter using pre-computed search keys
  const filteredData = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();

    const matches = (item) => {
      // 1. Level filter check (fast numeric comparison)
      if (filterLevel === "beginner" && item.level >= 70) return false;
      if (filterLevel === "intermediate" && (item.level < 70 || item.level >= 85)) return false;
      if (filterLevel === "advanced" && item.level < 85) return false;

      // 2. Search check (single substring check against pre-indexed key)
      if (term && !item._searchKey.includes(term)) return false;

      return true;
    };

    return {
      sehariHari: indexedSehariHari.filter(matches),
      pemrograman: indexedPemrograman.filter(matches),
    };
  }, [debouncedSearchTerm, filterLevel]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleExpandedTags = useCallback((skillId) => {
    setExpandedTags((prev) => ({
      ...prev,
      [skillId]: !prev[skillId],
    }));
  }, []);

  const totalShown = filteredData.sehariHari.length + filteredData.pemrograman.length;

  return (
    <div className="min-h-screen bg-[#0f172a] py-4 sm:py-8 px-3 sm:px-4 relative overflow-hidden text-gray-300">
      {/* 🚀 GPU-friendly Ambient Glows - Zero continuous repaint overhead */}
      <div 
        className="absolute top-0 left-10 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(6, 182, 212, 0) 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-10 right-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2.5 sm:mb-4 tracking-tight">
            Kemampuan Bahasa & Teknologi
          </h1>
          <p className="text-gray-300 text-xs sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-light px-2">
            Jelajahi berbagai bahasa dan teknologi yang saya kuasai, dari komunikasi sehari-hari 
            hingga stack pengembangan perangkat lunak modern.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats 
          bahasaSehariHari={indexedSehariHari} 
          bahasaPemrograman={indexedPemrograman} 
        />
        
        {/* Search & Filter Bar */}
        <SearchFilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalShown={totalShown}
          totalItems={totalCount}
        />

        {/* Language & Technology Sections */}
        <div className="space-y-6 sm:space-y-10">
          <LanguageSection 
            title="Bahasa Sehari-hari"
            data={filteredData.sehariHari}
            icon="🌍"
            isProgramming={false}
            viewMode={viewMode}
            expandedTags={expandedTags}
            toggleExpandedTags={toggleExpandedTags}
            searchTerm={searchTerm}
            filterLevel={filterLevel}
          />

          <LanguageSection 
            title="Teknologi & Pemrograman"
            data={filteredData.pemrograman}
            icon="💻"
            isProgramming={true}
            viewMode={viewMode}
            expandedTags={expandedTags}
            toggleExpandedTags={toggleExpandedTags}
            searchTerm={searchTerm}
            filterLevel={filterLevel}
          />
        </div>

        {/* Empty State */}
        {totalShown === 0 && (searchTerm || filterLevel !== "all") && (
          <div className="text-center py-10 sm:py-14">
            <div className="text-4xl sm:text-5xl mb-3">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Tidak ada hasil</h3>
            <p className="text-gray-400 mb-4 text-xs sm:text-sm">
              Tidak ada item yang sesuai dengan pencarian dan filter Anda
            </p>
            <button
              onClick={() => { setSearchTerm(""); setFilterLevel("all"); }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-transform active:scale-95 text-xs sm:text-sm"
            >
              Tampilkan Semua
            </button>
          </div>
        )}

        {/* Call to Action - Fix SPA navigation: use Link instead of window.location.href */}
        <div className="text-center mt-10 sm:mt-14">
          <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-cyan-500/25 relative overflow-hidden">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">Siap Berkolaborasi?</h3>
            <p className="text-gray-300 text-xs sm:text-base mb-4 max-w-xl mx-auto">
              Dengan beragam kemampuan bahasa dan teknologi, saya siap membantu mewujudkan proyek Anda.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/contact"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-transform text-xs sm:text-sm inline-flex items-center gap-1.5"
              >
                ✨ Hubungi Saya
              </Link>
            </div>
          </div>
        </div>

        {/* Page Connections */}
        <PageConnections />
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2.5 sm:p-3 rounded-xl shadow-lg z-40 active:scale-95"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bahasa;
