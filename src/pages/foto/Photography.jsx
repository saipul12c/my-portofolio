import { useState, useMemo } from "react";
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

  // 🔍 Filter dan sort
  const filteredAndSortedPhotos = useMemo(() => {
    let result = photos.filter((photo) =>
      [photo.title, photo.category, photo.mood, photo.location]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    // Filter by category
    if (filterOptions.category !== "all") {
      result = result.filter(photo => photo.category === filterOptions.category);
    }

    // Sort
    switch (filterOptions.sortBy) {
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "date":
      default:
        result.sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken));
        break;
    }

    return result;
  }, [searchTerm, filterOptions]);

  // 🧮 Hitung pagination
  const totalPages = Math.ceil(filteredAndSortedPhotos.length / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const currentPhotos = filteredAndSortedPhotos.slice(startIndex, startIndex + photosPerPage);

  // 🔄 Reset ke halaman 1 saat pencarian atau filter berubah
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (options) => {
    setFilterOptions(options);
    setCurrentPage(1);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // 🎯 Fungsi untuk mengganti halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate between photos in modal
  const handlePhotoNavigate = (direction) => {
    const currentIndex = filteredAndSortedPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredAndSortedPhotos.length;
    } else {
      newIndex = (currentIndex - 1 + filteredAndSortedPhotos.length) % filteredAndSortedPhotos.length;
    }
    
    setSelectedPhoto(filteredAndSortedPhotos[newIndex]);
  };

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 py-8 md:py-12 lg:py-20 relative overflow-hidden">
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
          />
        </div>

        {/* ✨ Grid foto */}
        <motion.div
          key={`${searchTerm}-${currentPage}-${filterOptions.category}-${filterOptions.sortBy}-${viewMode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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