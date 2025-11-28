import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    
    if (currentPage <= 3) {
      // Case: 1 2 3 4 ... last
      pages.push(1, 2, 3, 4);
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Case: 1 ... last-3 last-2 last-1 last
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Case: 1 ... current-1 current current+1 ... last
      pages.push(1);
      pages.push('ellipsis');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('ellipsis');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-12 px-2"
    >
      {/* Info Halaman */}
      <div className="text-xs md:text-sm text-gray-400 order-2 sm:order-1">
        Menampilkan halaman {currentPage} dari {totalPages}
      </div>

      {/* Navigasi Halaman */}
      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* Tombol Previous */}
        <motion.button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          className={`p-2 rounded-lg border text-sm transition-all ${
            currentPage === 1
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : "border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50"
          }`}
        >
          <ChevronLeft size={16} />
        </motion.button>

        {/* Tombol Halaman */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                  <MoreHorizontal size={14} />
                </div>
              );
            }

            return (
              <motion.button
                key={page}
                onClick={() => onPageChange(page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all min-w-[40px] ${
                  currentPage === page
                    ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-lg shadow-cyan-500/10"
                    : "border-gray-600 text-gray-400 hover:border-cyan-400/30 hover:text-cyan-300"
                }`}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        {/* Tombol Next */}
        <motion.button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          className={`p-2 rounded-lg border text-sm transition-all ${
            currentPage === totalPages
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : "border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50"
          }`}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}