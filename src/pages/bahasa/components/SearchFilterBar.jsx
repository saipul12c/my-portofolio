import React, { memo } from "react";
import { Search } from "lucide-react";

const SearchFilterBarComponent = ({ 
  searchTerm, 
  setSearchTerm, 
  filterLevel, 
  setFilterLevel, 
  viewMode, 
  setViewMode,
  totalShown,
  totalItems,
}) => (
  <div className="bg-gradient-to-r from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 mb-6 sm:mb-8 border border-cyan-500/20 shadow-md">
    <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-4 items-stretch lg:items-center justify-between">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Cari bahasa, teknologi, atau kemampuan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-[#0f172a]/70 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-colors text-xs sm:text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2 bg-[#0f172a]/70 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm min-w-[130px]"
        >
          <option value="all">Semua Level</option>
          <option value="beginner">Pemula (0-69%)</option>
          <option value="intermediate">Menengah (70-84%)</option>
          <option value="advanced">Lanjutan (85-100%)</option>
        </select>

        <div className="flex bg-[#0f172a]/70 rounded-xl border border-cyan-500/30 overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 transition-colors text-xs sm:text-sm font-medium ${
              viewMode === "grid" ? "bg-cyan-500/25 text-cyan-300" : "text-gray-400 hover:text-cyan-300"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 transition-colors text-xs sm:text-sm font-medium ${
              viewMode === "list" ? "bg-cyan-500/25 text-cyan-300" : "text-gray-400 hover:text-cyan-300"
            }`}
          >
            List
          </button>
        </div>

        {(searchTerm || filterLevel !== "all") && (
          <button
            onClick={() => { setSearchTerm(""); setFilterLevel("all"); }}
            className="px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors text-xs sm:text-sm"
          >
            Reset
          </button>
        )}
      </div>
    </div>

    <div className="mt-2.5 text-center">
      <p className="text-gray-400 text-xs">
        Menampilkan {totalShown} dari {totalItems} item
        {searchTerm && ` untuk "${searchTerm}"`}
      </p>
    </div>
  </div>
);

export const SearchFilterBar = memo(SearchFilterBarComponent);
SearchFilterBarComponent.displayName = "SearchFilterBar";
