import SearchBar from "./pencarian/SearchBar";
import { SORT_OPTIONS } from "../utils/constants";
import { Filter, ArrowUpAZ } from "lucide-react";

export default function BlogControls({
  blogs,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  onAiClick
}) {
  return (
    <div className="relative mb-10 group z-40">
      {/* Decorative background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
      
      <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl overflow-visible">
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Search Area (left 8/12 on XL) */}
          <div className="xl:col-span-8 w-full relative z-30">
            <SearchBar
              blogs={blogs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              onAiClick={onAiClick}
            />
          </div>

          {/* Filter Controls (right 4/12 on XL) */}
          <div className="xl:col-span-4 flex flex-col sm:flex-row gap-3 w-full sm:pt-0">
            {/* Category Filter */}
            <div className="flex-1 relative group/select">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block">Kategori</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 z-10 pointer-events-none">
                  <Filter className="w-4 h-4" />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-gray-200 
                  appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 
                  transition-all cursor-pointer text-sm backdrop-blur-md shadow-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900 text-gray-200">
                      {cat === "all" ? "📁 Semua Kategori" : cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex-1 relative group/select">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block">Urutkan</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 z-10 pointer-events-none">
                  <ArrowUpAZ className="w-4 h-4" />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-gray-200 
                  appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 
                  transition-all cursor-pointer text-sm backdrop-blur-md shadow-lg"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-900 text-gray-200">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}