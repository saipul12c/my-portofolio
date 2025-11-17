import SearchBar from "./pencarian/SearchBar";
import { SORT_OPTIONS } from "../utils/constants";

export default function BlogControls({
  blogs,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories
}) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50 relative overflow-visible" style={{ position: 'relative', zIndex: 10 }}>
      {/* ✅ Tambahkan 'relative' dan 'overflow-visible' */}
      
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between overflow-visible">
        {/* Search Bar */}
        <div className="flex-1 w-full relative overflow-visible" style={{ position: 'relative', zIndex: 20 }}>
          {/* ✅ Tambahkan 'relative' dan 'overflow-visible' */}
          <SearchBar
            blogs={blogs}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Category Filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "all" ? "📁 Semua Kategori" : `📂 ${cat}`}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}