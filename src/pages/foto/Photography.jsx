import { useState } from "react";
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

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 9;

  const isMaintenance = false;

  // 🔍 Filter pencarian
  const filteredPhotos = photos.filter((photo) =>
    [photo.title, photo.category, photo.mood, photo.location]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🧮 Hitung pagination
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const currentPhotos = filteredPhotos.slice(startIndex, startIndex + photosPerPage);

  // 🔄 Reset ke halaman 1 saat pencarian berubah
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // 🎯 Fungsi untuk mengganti halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 py-8 md:py-12 lg:py-20 relative overflow-hidden">
      <BackgroundGlow />
      
      <div className="w-full max-w-7xl">
        {/* Header dan Search di tengah */}
        <div className="flex flex-col items-center w-full">
          <PhotoHeader />
          <PhotoSearch onSearch={handleSearch} allPhotos={photos} />
        </div>

        {/* ✨ Grid foto */}
        <motion.div
          key={`${searchTerm}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center"
        >
          {currentPhotos.length > 0 ? (
            <PhotoGrid photos={currentPhotos} setSelectedPhoto={setSelectedPhoto} />
          ) : (
            <p className="text-gray-400 italic mt-10 text-center text-sm md:text-base">
              Tidak ada foto yang cocok dengan pencarianmu 😅
            </p>
          )}
        </motion.div>

        {/* 🎯 Pagination */}
        {filteredPhotos.length > photosPerPage && (
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
            <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}