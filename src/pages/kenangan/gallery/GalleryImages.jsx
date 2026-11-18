import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, UserCheck, Tag, AlertCircle } from "lucide-react";
import { filterMediaItems } from "../utils/filterHelpers";
import { GALLERY_CONFIG } from "../utils/constants";
import { sanitizeUrl, generateAltText } from "../utils/sanitizers";

function GalleryImagesComponent({ items, onSelect, filterSettings = {} }) {
  const ITEMS_PER_PAGE = GALLERY_CONFIG.ITEMS_PER_PAGE.IMAGES;
  const [currentPage, setCurrentPage] = useState(1);
  const [localData, setLocalData] = useState([]);

  const { searchTerm = "", tags: selectedTags = [] } = filterSettings;

  // Fallback to local import only if items prop is not provided
  useEffect(() => {
    if (items) return;
    let mounted = true;
    import("../../../data/gallery/images.json")
      .then((m) => {
        if (!mounted) return;
        setLocalData(m.default || []);
      })
      .catch((err) => {
        console.error("Failed to load images.json", err);
      });
    return () => { mounted = false; };
  }, [items]);

  const rawData = items || localData;

  // 🔄 Filter data & bagi ke halaman (stabil tanpa setState di useMemo)
  const { pages, allFilteredData } = useMemo(() => {
    const filtered = filterMediaItems(rawData, searchTerm, selectedTags);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const chunks = [];
    for (let i = 0; i < totalPages; i++) {
      chunks.push(filtered.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE));
    }
    return { pages: chunks, allFilteredData: filtered };
  }, [rawData, searchTerm, selectedTags, ITEMS_PER_PAGE]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags]);

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
        <Image className="w-6 h-6" /> Foto Kece
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
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentData.map((img) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelect && onSelect(img)}
                  className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400 transition-all cursor-pointer group shadow-lg"
                >
                  {/* Gambar + Watermark */}
                  <div className="relative w-full h-64 overflow-hidden rounded-2xl bg-black">
                    <img
                      src={sanitizeUrl(img.src)}
                      alt={generateAltText(img)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Watermark */}
                    <div className="absolute bottom-2 right-2 text-white text-xs font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                      MyGallery
                    </div>
                  </div>

                  {/* Overlay saat hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all p-5 flex flex-col justify-end">
                    <h3 className="text-lg font-semibold text-white">{img.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{img.category}</p>

                    {/* Creator */}
                    {img.creator && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={sanitizeUrl(img.creator.avatar, 'https://randomuser.me/api/portraits/lego/1.jpg')}
                          alt={`${img.creator.display_name} avatar`}
                          className="w-6 h-6 rounded-full border border-white/20"
                          loading="lazy"
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
                            className="text-xs bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                        {img.tags.length > 3 && (
                          <span className="text-xs bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full">
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
                className={`px-4 py-2 rounded-lg border text-sm transition ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
                    : "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                  }`}
                aria-label="Go to previous page"
                aria-disabled={currentPage === 1}
              >
                ⬅ Sebelumnya
              </button>
              <span className="text-sm text-gray-400" aria-live="polite">
                Halaman {currentPage} dari {pages.length}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === pages.length}
                className={`px-4 py-2 rounded-lg border text-sm transition ${currentPage === pages.length
                    ? "opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
                    : "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
                  }`}
                aria-label="Go to next page"
                aria-disabled={currentPage === pages.length}
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

export default React.memo(GalleryImagesComponent);

