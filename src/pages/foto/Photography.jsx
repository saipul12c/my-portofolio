import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Maintenance from "../errors/Maintenance";
import photos from "../../data/foto/photos.json";

import BackgroundGlow from "./foto/BackgroundGlow";
import PhotoHeader from "./foto/PhotoHeader";
import PhotoSearch from "./foto/PhotoSearch";
import PhotoGrid from "./foto/PhotoGrid";
import PhotoPhilosophy from "./foto/PhotoPhilosophy";
import PhotoModal from "./foto/PhotoModal";
import PhotoRelatedContent from "./foto/PhotoRelatedContent";
import PhotoSearchRelated from "./foto/PhotoSearchRelated";
import Pagination from "./foto/Pagination";
import PhotoStats from "./foto/PhotoStats";

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({ category: "all", sortBy: "date" });
  const [viewMode, setViewMode] = useState("grid");
  const photosPerPage = 9;

  const isMaintenance = false;

  // 🔍 Filter dan sort optimal
  const filteredAndSortedPhotos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let result = photos;

    if (term) {
      result = result.filter((photo) =>
        (photo.title && photo.title.toLowerCase().includes(term)) ||
        (photo.category && photo.category.toLowerCase().includes(term)) ||
        (photo.mood && photo.mood.toLowerCase().includes(term)) ||
        (photo.location && photo.location.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (filterOptions.category !== "all") {
      result = result.filter(photo => photo.category === filterOptions.category);
    }

    // Sort
    const sorted = [...result];
    switch (filterOptions.sortBy) {
      case "title":
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "category":
        sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      case "date":
      default:
        sorted.sort((a, b) => new Date(b.date_taken || 0) - new Date(a.date_taken || 0));
        break;
    }

    return sorted;
  }, [searchTerm, filterOptions]);

  // 🧮 Hitung pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPhotos.length / photosPerPage));
  const startIndex = (currentPage - 1) * photosPerPage;
  const currentPhotos = useMemo(() => 
    filteredAndSortedPhotos.slice(startIndex, startIndex + photosPerPage),
    [filteredAndSortedPhotos, startIndex]
  );

  // 🔄 Reset ke halaman 1 saat pencarian atau filter berubah
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((options) => {
    setFilterOptions(options);
    setCurrentPage(1);
  }, []);

  const handleViewChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // 🎯 Fungsi untuk mengganti halaman
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Safe navigation between photos in modal
  const handlePhotoNavigate = useCallback((direction) => {
    if (!selectedPhoto || !filteredAndSortedPhotos.length) return;
    const currentIndex = filteredAndSortedPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredAndSortedPhotos.length;
    } else {
      newIndex = (currentIndex - 1 + filteredAndSortedPhotos.length) % filteredAndSortedPhotos.length;
    }
    
    setSelectedPhoto(filteredAndSortedPhotos[newIndex]);
  }, [filteredAndSortedPhotos, selectedPhoto]);

  // Pilih kategori dari related search saran secara clean lewat React state
  const handleSelectCategoryFromRelated = useCallback((category) => {
    setFilterOptions(prev => ({ ...prev, category }));
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 py-6 md:py-10 lg:py-16 relative overflow-hidden">
      <BackgroundGlow />
      
      <div className="w-full max-w-7xl">
        {/* Header dan Search di tengah */}
        <div className="flex flex-col items-center w-full">
          <PhotoHeader />
          
          {/* Stats Section */}
          <PhotoStats photos={photos} />
          
          <PhotoSearch 
            onSearch={handleSearch} 
            allPhotos={photos}
            onFilterChange={handleFilterChange}
            onViewChange={handleViewChange}
            currentView={viewMode}
            externalSearchTerm={searchTerm}
          />
        </div>

        {/* ✨ Grid foto: searchTerm dihapus dari key agar DOM tidak remount setiap ketik 1 huruf */}
        <motion.div
          key={`${currentPage}-${filterOptions.category}-${filterOptions.sortBy}-${viewMode}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full flex flex-col items-center"
        >
          {currentPhotos.length > 0 ? (
            <PhotoGrid 
              photos={currentPhotos} 
              setSelectedPhoto={setSelectedPhoto}
              viewMode={viewMode}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 italic text-base md:text-lg mb-2">
                Tidak ada foto yang cocok dengan pencarianmu 😅
              </p>
              <p className="text-gray-500 text-sm">
                Coba kata kunci lain atau ubah filter
              </p>
            </div>
          )}
        </motion.div>

        {/* 🎯 Pagination */}
        {filteredAndSortedPhotos.length > photosPerPage && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* 🔗 Saran konten terkait saat pencarian tidak ada hasil */}
        {searchTerm && currentPhotos.length === 0 && (
          <PhotoSearchRelated 
            searchTerm={searchTerm} 
            filteredPhotos={currentPhotos} 
            allPhotos={photos} 
            onSelectCategory={handleSelectCategoryFromRelated}
          />
        )}

        {/* Filosofi di tengah */}
        <div className="flex justify-center w-full">
          <PhotoPhilosophy />
        </div>

        <PhotoRelatedContent />

        {/* Modal Foto */}
        <AnimatePresence>
          {selectedPhoto && (
            <PhotoModal 
              photo={selectedPhoto} 
              onClose={() => setSelectedPhoto(null)}
              onNavigate={handlePhotoNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}