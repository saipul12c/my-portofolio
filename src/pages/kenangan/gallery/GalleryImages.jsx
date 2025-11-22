import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, UserCheck, Tag, AlertCircle } from "lucide-react";
import imagesData from "../../../data/gallery/images.json";

// 🔀 Fungsi acak (Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 🔍 Filter helper function
function filterImages(images, searchTerm = "", selectedTags = []) {
  let filtered = images;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (img) =>
        img.title?.toLowerCase().includes(term) ||
        img.desc?.toLowerCase().includes(term) ||
        img.category?.toLowerCase().includes(term) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  if (selectedTags.length > 0) {
    filtered = filtered.filter((img) =>
      selectedTags.some((tag) => img.tags?.includes(tag))
    );
  }

  return filtered;
}

export default function GalleryImages({ onSelect, filterSettings = {}, onFilteredDataChange }) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // 🔄 Acak data & bagi ke halaman
  const { pages, allFilteredData } = useMemo(() => {
    const filtered = filterImages(imagesData, searchTerm, selectedTags);
    const shuffled = shuffleArray(filtered);
    const totalPages = Math.ceil(shuffled.length / ITEMS_PER_PAGE);
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      chunks.push(shuffled.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return { pages: chunks, allFilteredData: filtered };
  }, [searchTerm, selectedTags]);

  // 📢 Notify parent of filtered data
  useMemo(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(allFilteredData);
    }
  }, [allFilteredData, onFilteredDataChange]);

  const currentData = pages[currentPage - 1] || [];
  const hasNoData = allFilteredData.length === 0;

  // ⚙️ Navigasi halaman
  const nextPage = () => {
    if (currentPage < pages.length) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <section className="w-full max-w-7xl mb-24">
      {/* 🖼️ Header */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-cyan-300">
        <Image className="w-6 h-6" /> Foto Kece 📸
      </h2>

      {hasNoData ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-500/10 border border-cyan-400/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
        >
          <AlertCircle className="w-12 h-12 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">Tidak Ada Foto Kece</h3>
          <p className="text-gray-400">
            Tidak ada foto yang ditemukan sesuai dengan pencarian Anda. Coba ubah filter atau cari istilah lain.
          </p>
        </motion.div>
      ) : (
        <>
          {/* 🎨 Grid Gambar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentData.map((img) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => onSelect(img)}
              className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400 transition-all cursor-pointer group"
            >
              {/* Gambar + Watermark */}
              <div className="relative w-full h-64 overflow-hidden rounded-2xl">
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Watermark */}
                <div className="absolute bottom-2 right-2 text-white text-xs font-bold bg-black/30 px-2 py-1 rounded">
                  MyGallery
                </div>
              </div>

              {/* Overlay saat hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all p-5 flex flex-col justify-end">
                <h3 className="text-lg font-semibold text-white">{img.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{img.category}</p>

                {/* Creator */}
                {img.creator && (
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={img.creator.avatar}
                      alt={img.creator.display_name}
                      className="w-6 h-6 rounded-full border border-white/20"
                    />
                    <p className="text-xs text-cyan-300 flex items-center gap-1">
                      {img.creator.display_name}
                      {img.creator.verified && <UserCheck size={12} />}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {img.tags && (
                  <div className="flex flex-wrap gap-1">
                    {img.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                    {img.tags.length > 3 && (
                      <span className="text-xs bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full">
                        +{img.tags.length - 3} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
            </motion.div>
          </AnimatePresence>

          {/* 📜 Pagination */}
          {pages.length > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
                    : "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                }`}
              >
                ⬅ Sebelumnya
              </button>
              <span className="text-sm text-gray-400">
                Halaman {currentPage} dari {pages.length}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === pages.length}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  currentPage === pages.length
                    ? "opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
                    : "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                }`}
              >
                Berikutnya ➡
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
