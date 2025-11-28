import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Search } from "lucide-react";

export default function PhotoSearchRelated({ searchTerm, filteredPhotos, allPhotos }) {
  const navigate = useNavigate();

  if (searchTerm && filteredPhotos.length === 0) {
    const allCategories = [...new Set(allPhotos.map((p) => p.category))];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-4xl mx-auto mt-6 p-4 sm:p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-100 mb-2">
                Hmm, pencarian "{searchTerm}" tidak menemukan hasil...
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Tapi jangan khawatir! Coba jelajahi kategori lain atau kunjungi halaman terkait untuk menemukan konten yang menarik.
              </p>

              {/* Kategori Suggestions */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-gray-400">Kategori yang tersedia:</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {allCategories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      className="px-2 sm:px-3 py-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400/60 rounded-lg text-cyan-300 transition-all"
                      onClick={() => {
                        const searchInput = document.querySelector('input[placeholder*="Cari"]');
                        if (searchInput) {
                          searchInput.value = category;
                          searchInput.dispatchEvent(new Event("input", { bubbles: true }));
                        }
                      }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Related Content Links */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs font-medium text-gray-400">Atau kunjungi konten terkait:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => navigate("/gallery")}
                    className="px-2 sm:px-3 py-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 transition-all flex items-center gap-1 justify-center sm:justify-start"
                  >
                    <Search size={12} />
                    Galeri Kenangan
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => navigate("/blog")}
                    className="px-2 sm:px-3 py-1.5 text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-300 transition-all flex items-center gap-1 justify-center sm:justify-start"
                  >
                    <Search size={12} />
                    Blog & Cerita
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => navigate("/projects")}
                    className="px-2 sm:px-3 py-1.5 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 transition-all flex items-center gap-1 justify-center sm:justify-start"
                  >
                    <Search size={12} />
                    Proyek & Portfolio
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}