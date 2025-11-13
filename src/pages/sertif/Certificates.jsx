"use client";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { useEffect } from "react";
import { Star, Sparkles, Rocket } from "lucide-react";

// Import hooks
import { useCertificatesData } from "./hooks/useCertificatesData";
import { useCertificatesSearch } from "./hooks/useCertificatesSearch";
import { useCertificatesUI } from "./hooks/useCertificatesUI";

// Import components
import CertificateCard from "./components/CertificateCard";
import CertificateModal from "./components/CertificateModal";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";

// Import utils
import { highlightMatch } from "./utils/searchUtils";

export default function Certificates() {
  // Data hooks
  const { certificates, tagColors, skills, projects, testimonials } = useCertificatesData();
  
  // Search hooks
  const {
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    activeIndex,
    currentPage,
    setCurrentPage,
    categories,
    currentCertificates,
    totalPages,
    suggestions,
    ghostText,
    suggestionRef,
    handleKeyDown,
  } = useCertificatesSearch(certificates);
  
  // UI hooks
  const {
    selected,
    setSelected,
    closePopup,
    handleSkillClick,
    handleProjectClick,
    handleTestimonialClick
  } = useCertificatesUI();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // === Render stars untuk rating ===
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++)
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm"
        />
      );
    if (half)
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400/60" />);
    return stars;
  };

  // === Pagination numbers ===
  const getVisiblePages = () => {
    const maxPagesToShow = 10;
    if (totalPages <= maxPagesToShow)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    let startPage = Math.max(currentPage - 4, 1);
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxPagesToShow + 1;
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen bg-[#0a0f1a] text-white py-24 px-6 flex flex-col items-center select-none">
        {/* 🌈 Background efek seperti Projects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header dengan animasi seperti Projects */}
        <m.div
          className="text-center max-w-3xl mx-auto space-y-6 mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center items-center gap-3">
            <Rocket className="w-10 h-10 text-cyan-400" />
            Sertifikat & Penghargaan
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
            Koleksi profesional kredibel dan dapat{" "}
            <span className="text-cyan-400 font-semibold">diverifikasi langsung</span>.
            Eksplorasi pencapaian di bidang{" "}
            <span className="text-blue-400 font-semibold">teknologi</span>,{" "}
            <span className="text-purple-400 font-semibold">sertifikasi</span>, dan{" "}
            <span className="text-emerald-400 font-semibold">pengembangan skill</span>.
          </p>
        </m.div>

        {/* Search + Filter */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
          suggestions={suggestions}
          activeIndex={activeIndex}
          ghostText={ghostText}
          suggestionRef={suggestionRef}
          handleKeyDown={handleKeyDown}
          highlightMatch={highlightMatch}
        />

        {/* Grid Sertifikat dengan hover effect seperti Projects */}
        <AnimatePresence mode="wait">
          {currentCertificates.length > 0 ? (
            <m.div
              key={currentPage}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              {currentCertificates.map((cert) => (
                <CertificateCard
                  key={cert.id}
                  cert={cert}
                  tagColors={tagColors}
                  onSelect={setSelected}
                  renderStars={renderStars}
                />
              ))}
            </m.div>
          ) : (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-20 flex flex-col items-center"
            >
              <Sparkles className="w-10 h-10 text-cyan-400 mb-2" />
              <p>Tidak ada hasil yang cocok 😢</p>
              <p className="text-sm text-gray-500">
                Coba ketik kata lain atau pilih kategori "All".
              </p>
            </m.div>
          )}
        </AnimatePresence>

        {/* 🔢 Pagination seperti Projects */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          getVisiblePages={getVisiblePages}
        />

        {/* Enhanced Modal Detail dengan Skills, Projects, dan Testimonials Terkait */}
        <CertificateModal
          selected={selected}
          tagColors={tagColors}
          skills={skills}
          projects={projects}
          testimonials={testimonials}
          closePopup={closePopup}
          handleSkillClick={handleSkillClick}
          handleProjectClick={handleProjectClick}
          handleTestimonialClick={handleTestimonialClick}
          renderStars={renderStars}
        />
      </main>
    </LazyMotion>
  );
}