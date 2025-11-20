import React, { useState, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import dataBahasa from "../../data/bahasa/data.json";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowUp } from "lucide-react";

// Import komponen dan hooks
import { useScroll } from "./hooks/useScroll";
import { useDebounce } from "./hooks/useDebounce";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { QuickStats } from "./components/QuickStats";
import { LanguageSection } from "./components/LanguageSection";
import { PageConnections } from "./components/PageConnections";

// Lazy load DetailTooltip untuk mengurangi bundle size
const DetailTooltip = lazy(() => 
  import("./components/DetailTooltip").then(module => ({ default: module.DetailTooltip }))
);

const Bahasa = () => {
  const { bahasaSehariHari, bahasaPemrograman } = dataBahasa;
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [expandedTags, setExpandedTags] = useState({});
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const { showScrollTop } = useScroll();

  // Debounce search untuk mengurangi re-renders
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  // Optimized filtering dengan useMemo
  const filteredData = useMemo(() => {
    const filterCondition = (bahasa) => {
      const matchesSearch = bahasa.nama.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           bahasa.tingkat.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           (bahasa.kemampuan && bahasa.kemampuan.some(skill => 
                             skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                           ));
      const matchesLevel = 
        filterLevel === "all" ||
        (filterLevel === "beginner" && bahasa.level < 70) ||
        (filterLevel === "intermediate" && bahasa.level >= 70 && bahasa.level < 85) ||
        (filterLevel === "advanced" && bahasa.level >= 85);
      
      return matchesSearch && matchesLevel;
    };

    return {
      sehariHari: bahasaSehariHari.filter(filterCondition),
      pemrograman: bahasaPemrograman.filter(filterCondition)
    };
  }, [bahasaSehariHari, bahasaPemrograman, debouncedSearchTerm, filterLevel]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Toggle expanded tags dengan optimized state update
  const toggleExpandedTags = useCallback((skillId) => {
    setExpandedTags(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  }, []);

  // Animation variants yang lebih ringan dengan transition yang di-optimize
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        duration: 0.6
      }
    }
  };

  // Memoize detail modal untuk menghindari re-render unnecessary
  const detailModal = useMemo(() => selectedSkill ? (
    <DetailTooltip 
      bahasa={selectedSkill}
      isProgramming={selectedSkill.isProgramming}
      onClose={() => setSelectedSkill(null)}
    />
  ) : null, [selectedSkill]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] py-4 sm:py-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Optimized Background Elements dengan will-change untuk performa */}
      <div className="absolute top-10 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{willChange: "transform"}}></div>
      <div className="absolute bottom-10 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-700" style={{willChange: "transform"}}></div>

      <div className="max-w-7xl mx-auto relative z-10" ref={sectionRef}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Kemampuan Bahasa & Teknologi
          </h1>
          <p className="text-cyan-300 text-sm sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-light px-2">
            Jelajahi berbagai bahasa dan teknologi yang saya kuasai, dari komunikasi sehari-hari 
            hingga stack pengembangan software modern dengan pengalaman nyata
          </p>
        </motion.div>

        <QuickStats 
          bahasaSehariHari={bahasaSehariHari} 
          bahasaPemrograman={bahasaPemrograman} 
        />
        
        <SearchFilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredData={filteredData}
          bahasaSehariHari={bahasaSehariHari}
          bahasaPemrograman={bahasaPemrograman}
        />

        {/* Main Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-8 sm:space-y-12"
        >
          <LanguageSection 
            title="Bahasa Sehari-hari"
            data={filteredData.sehariHari}
            icon="🌍"
            isProgramming={false}
            viewMode={viewMode}
            setSelectedSkill={setSelectedSkill}
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
            setSelectedSkill={setSelectedSkill}
            expandedTags={expandedTags}
            toggleExpandedTags={toggleExpandedTags}
            searchTerm={searchTerm}
            filterLevel={filterLevel}
          />
        </motion.div>

        {/* Empty State */}
        {filteredData.sehariHari.length === 0 && filteredData.pemrograman.length === 0 && 
         (searchTerm || filterLevel !== "all") && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Tidak ada hasil</h3>
            <p className="text-cyan-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Tidak ada item yang sesuai dengan pencarian dan filter Anda
            </p>
            <button
              onClick={() => { setSearchTerm(""); setFilterLevel("all"); }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            >
              Tampilkan Semua
            </button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Siap Berkolaborasi?</h3>
            <p className="text-cyan-300 text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
              Dengan beragam kemampuan bahasa dan teknologi, saya siap membantu mewujudkan 
              ide kreatif Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button 
                onClick={() => (window.location.href = "/contact")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                ✨ Hubungi Saya
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Page Connections */}
        <PageConnections />
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2.5 sm:p-3 rounded-xl shadow-lg z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Detail Modal dengan Suspense untuk lazy loading */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {detailModal}
        </AnimatePresence>
      </Suspense>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
        
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Bahasa;