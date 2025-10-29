import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
      >
        {paginated.map((t, i) => (
          <motion.div
            key={t.id}
            whileHover={{ scale: 1.05, y: -6 }}
            onClick={() => setSelected(t)}
            className="relative bg-white/8 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg cursor-pointer"
          >
            <Quote className="absolute top-6 right-8 text-cyan-400 w-5 h-5" />
            <div className="flex flex-col items-center text-center space-y-3">
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full border-2 border-cyan-400 object-cover"
              />
              <h3 className="font-semibold text-white text-lg">{t.name}</h3>
              <p className="text-cyan-300 text-xs">{t.role}</p>
              <p className="text-gray-400 text-xs">{t.formattedDate}</p>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                {t.text}
              </p>
              <Stars rating={t.rating} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-gray-400 mt-6">Tidak ada hasil ditemukan...</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-3 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-3 bg-cyan-500/30 rounded-full disabled:opacity-20"
          >
            <ChevronLeft />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  currentPage === i + 1
                    ? "bg-cyan-500 border-cyan-400"
                    : "border-white/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-3 bg-cyan-500/30 rounded-full disabled:opacity-20"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
