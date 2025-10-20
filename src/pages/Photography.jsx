import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Maintenance from "./errors/Maintenance";
import photos from "../data/foto/photos.json";

import BackgroundGlow from "../components/foto/BackgroundGlow";
import PhotoHeader from "../components/foto/PhotoHeader";
import PhotoSearch from "../components/foto/PhotoSearch";
import PhotoGrid from "../components/foto/PhotoGrid";
import PhotoPhilosophy from "../components/foto/PhotoPhilosophy";
import PhotoModal from "../components/foto/PhotoModal";

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePhotos, setVisiblePhotos] = useState(9); // berapa banyak yang tampil
  const [isFetching, setIsFetching] = useState(false);
  const loaderRef = useRef(null);
  const isMaintenance = false;

  if (isMaintenance) return <Maintenance />;

  // 🔍 Filter pencarian
  const filteredPhotos = photos.filter((photo) =>
    [photo.title, photo.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Ambil foto sesuai jumlah visible
  const currentPhotos = filteredPhotos.slice(0, visiblePhotos);

  // Reset saat pencarian berubah
  const handleSearch = (value) => {
    setSearchTerm(value);
    setVisiblePhotos(9); // tampilkan ulang dari awal
  };

  // 🧲 Infinite Scroll menggunakan Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && visiblePhotos < filteredPhotos.length) {
          setIsFetching(true);
          setTimeout(() => {
            setVisiblePhotos((prev) => prev + 9); // tambah batch 9 foto
            setIsFetching(false);
          }, 500); // delay kecil biar smooth
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visiblePhotos, filteredPhotos.length, isFetching]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      <BackgroundGlow />
      <PhotoHeader />
      <PhotoSearch onSearch={handleSearch} allPhotos={photos} />

      {/* ✨ Grid foto + animasi */}
      <motion.div
        key={searchTerm}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center"
      >
        {currentPhotos.length > 0 ? (
          <PhotoGrid photos={currentPhotos} setSelectedPhoto={setSelectedPhoto} />
        ) : (
          <p className="text-gray-500 italic mt-10">
            Tidak ada foto yang cocok dengan pencarianmu 😅
          </p>
        )}
      </motion.div>

      {/* Loader (trigger infinite scroll) */}
      <div ref={loaderRef} className="h-20 flex items-center justify-center text-gray-400 mt-8">
        {visiblePhotos < filteredPhotos.length ? (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Memuat foto berikutnya...
          </motion.div>
        ) : (
          filteredPhotos.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 italic"
            >
              Semua foto sudah ditampilkan 🎉
            </motion.p>
          )
        )}
      </div>

      <PhotoPhilosophy />

      {/* Modal Foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
