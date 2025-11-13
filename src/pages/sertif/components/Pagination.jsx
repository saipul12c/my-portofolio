import { m } from "framer-motion";

const Pagination = ({ 
  currentPage, 
  setCurrentPage, 
  totalPages,
  getVisiblePages 
}) => {
  if (totalPages <= 1) return null;

  return (
    <m.div
      className="flex flex-wrap justify-center items-center gap-2 mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {getVisiblePages().map((page) => (
        <m.button
          key={page}
          onClick={() => setCurrentPage(page)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            page === currentPage
              ? "bg-cyan-500 text-white shadow-lg"
              : "bg-white/10 text-gray-300 hover:bg-cyan-600/30"
          }`}
        >
          {page}
        </m.button>
      ))}
    </m.div>
  );
};

export default Pagination;