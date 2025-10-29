import { motion } from "framer-motion";
import { X, Star } from "lucide-react";

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
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-[#1e293b] p-6 sm:p-10 rounded-3xl border border-white/10 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Tombol Tutup */}
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Konten Utama */}
        <div className="text-center space-y-2 mb-4">
          <img
            src={selected.image}
            alt={selected.name}
            className="w-28 h-28 rounded-full border border-cyan-400 mx-auto object-cover"
          />
          <h3 className="text-2xl font-semibold">{selected.name}</h3>
          <p className="text-cyan-300">{selected.role}</p>
          {selected.company && (
            <p className="text-gray-400 text-sm">{selected.company}</p>
          )}
          {selected.location && (
            <p className="text-gray-400 text-sm">{selected.location}</p>
          )}
          <p className="text-gray-300 text-xs">{selected.formattedDate}</p>
          <Stars rating={selected.rating} />
        </div>

        <p className="italic text-gray-300 border-l-4 border-cyan-400/40 pl-4 mb-4">
          “{selected.text}”
        </p>

        {selected.highlight && (
          <p className="text-cyan-400 font-semibold text-center mb-6">
            ✨ {selected.highlight}
          </p>
        )}

        {selected.link && (
          <a
            href={selected.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-cyan-500 py-3 rounded-full hover:bg-cyan-600 font-medium transition"
          >
            🔗 Kunjungi Proyek
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
