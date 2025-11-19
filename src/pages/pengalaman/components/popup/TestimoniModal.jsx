import { motion } from "framer-motion";
import { X, Star, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="flex justify-center gap-1">
      {[...Array(full)].map((_, i) => (
        <Star key={i} size={17} className="text-yellow-400 fill-yellow-400" />
      ))}
      {half && (
        <Star size={17} className="text-yellow-400 stroke-yellow-400" />
      )}
    </div>
  );
};

export default function TestimoniModal({ selected, onClose }) {
  const navigate = useNavigate();

  // Fungsi untuk membuat slug dari nama/company
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleNavigateToAuthor = () => {
    navigate(`/testimoni/authors/${createSlug(selected.name)}`);
  };

  const handleNavigateToCompany = () => {
    navigate(`/testimoni/perusahan/${createSlug(selected.company)}`);
  };
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-6 py-6 sm:py-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-[#1e293b] p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/10 w-full max-w-2xl my-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Tombol Tutup */}
        <button
          className="absolute top-3 sm:top-5 right-3 sm:right-5 text-gray-400 hover:text-white transition flex-shrink-0"
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={24} className="sm:w-7 sm:h-7" />
        </button>

        {/* Konten Utama */}
        <div className="text-center space-y-2 sm:space-y-3 mb-4 sm:mb-6 pt-6 sm:pt-0">
          <img
            src={selected.image}
            alt={selected.name}
            className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-full border-2 border-cyan-400 mx-auto object-cover flex-shrink-0"
          />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold line-clamp-2">{selected.name}</h3>
          <p className="text-cyan-300 text-sm sm:text-base">{selected.role}</p>
          {selected.company && (
            <button
              onClick={handleNavigateToCompany}
              className="text-gray-400 hover:text-cyan-300 text-xs sm:text-sm transition-colors inline-flex items-center gap-1"
            >
              <Building2 size={14} className="flex-shrink-0" />
              <span className="line-clamp-1">{selected.company}</span>
            </button>
          )}
          {selected.location && (
            <p className="text-gray-400 text-xs sm:text-sm">{selected.location}</p>
          )}
          <p className="text-gray-300 text-xs">{selected.formattedDate}</p>
          <Stars rating={selected.rating} />
        </div>

        <p className="italic text-gray-300 border-l-4 border-cyan-400/40 pl-3 sm:pl-4 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
          "{selected.text}"
        </p>

        {selected.highlight && (
          <p className="text-cyan-400 font-semibold text-center mb-4 sm:mb-6 text-sm sm:text-base">
            ✨ {selected.highlight}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-col sm:flex-row">
          <button
            onClick={handleNavigateToAuthor}
            className="flex items-center justify-center gap-2 bg-blue-600/20 border border-blue-500/30 hover:border-blue-400/60 text-blue-300 hover:text-blue-200 py-2 px-3 rounded-lg transition-all text-sm sm:text-base flex-1"
          >
            <User size={16} className="flex-shrink-0" />
            <span className="font-medium">Profil Penulis</span>
          </button>
          {selected.company && (
            <button
              onClick={handleNavigateToCompany}
              className="flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 hover:text-emerald-200 py-2 px-3 rounded-lg transition-all text-sm sm:text-base flex-1"
            >
              <Building2 size={16} className="flex-shrink-0" />
              <span className="font-medium">Perusahaan</span>
            </button>
          )}
        </div>

        {selected.link && (
          <a
            href={selected.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-cyan-500 py-2 sm:py-3 rounded-lg sm:rounded-full hover:bg-cyan-600 font-medium transition text-sm sm:text-base"
          >
            🔗 Kunjungi Proyek
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
