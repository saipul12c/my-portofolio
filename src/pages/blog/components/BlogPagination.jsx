import { POSTS_PER_PAGE } from "../utils/constants";

export default function BlogPagination({
  filteredBlogs,
  currentPage,
  setCurrentPage,
  postsPerPage = POSTS_PER_PAGE
}) {
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  if (filteredBlogs.length <= postsPerPage) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 sm:mt-14">
      <div className="text-gray-400 text-xs sm:text-sm">
        Menampilkan {indexOfFirst + 1}-{Math.min(indexOfLast, filteredBlogs.length)} dari {filteredBlogs.length} artikel
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-800/60 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
        >
          ← Sebelumnya
        </button>
        
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg transition-all text-xs sm:text-sm ${
                currentPage === i + 1
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-800/60 text-gray-400 hover:bg-gray-700/60"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-800/60 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  );
}