import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Quote, Star, ChevronLeft, ChevronRight, User, Building2 } from "lucide-react";

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="flex justify-center gap-1">
      {[...Array(full)].map((_, i) => (
        <Star key={i} size={17} className="text-yellow-400 fill-yellow-400" />
      ))}
      {half && <Star size={17} className="text-yellow-400 stroke-yellow-400" />}
    </div>
  );
};

export default function TestimoniGrid({
  paginated,
  filtered,
  totalPages,
  currentPage,
  setCurrentPage,
  setSelected,
}) {
  const navigate = useNavigate();

  // Fungsi untuk membuat slug dari nama/company
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleNavigateToAuthor = (e, name) => {
    e.stopPropagation();
    navigate(`/testimoni/authors/${createSlug(name)}`);
  };

  const handleNavigateToCompany = (e, company) => {
    e.stopPropagation();
    navigate(`/testimoni/perusahan/${createSlug(company)}`);
  };
  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 w-full"
      >
        {paginated.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ scale: 1.05, y: -6 }}
            onClick={() => setSelected(t)}
            className="relative bg-white/8 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 shadow-lg cursor-pointer group h-full flex flex-col"
          >
            <Quote className="absolute top-4 sm:top-6 right-4 sm:right-8 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 flex-grow">
              <img
                src={t.image}
                alt={t.name}
                className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 border-cyan-400 object-cover flex-shrink-0"
              />
              <h3 className="font-semibold text-white text-base sm:text-lg line-clamp-1">{t.name}</h3>
              <p className="text-cyan-300 text-xs sm:text-sm line-clamp-1">{t.role}</p>
              <p className="text-gray-400 text-xs">{t.formattedDate}</p>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                {t.text}
              </p>
              <Stars rating={t.rating} />
              
              {/* Link Badges */}
              <div className="flex gap-2 pt-2 w-full flex-wrap justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => handleNavigateToAuthor(e, t.name)}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 rounded-full text-blue-300 text-xs transition-colors whitespace-nowrap"
                  title="Lihat profil penulis"
                >
                  <User size={12} />
                  <span>Profil</span>
                </button>
                {t.company && (
                  <button
                    onClick={(e) => handleNavigateToCompany(e, t.company)}
                    className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/30 rounded-full text-emerald-300 text-xs transition-colors whitespace-nowrap"
                    title="Lihat detail perusahaan"
                  >
                    <Building2 size={12} />
                    <span>Perusahaan</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-gray-400 mt-6 text-sm sm:text-base">Tidak ada hasil ditemukan...</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10 flex-wrap px-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 sm:p-3 bg-cyan-500/30 rounded-full disabled:opacity-20 hover:bg-cyan-500/50 transition-colors flex-shrink-0"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={18} className="sm:w-6 sm:h-6" />
          </button>

          <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm transition-colors ${
                  currentPage === i + 1
                    ? "bg-cyan-500 border-cyan-400 text-white"
                    : "border-white/20 text-gray-300 hover:border-white/40"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 sm:p-3 bg-cyan-500/30 rounded-full disabled:opacity-20 hover:bg-cyan-500/50 transition-colors flex-shrink-0"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={18} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </>
  );
}
