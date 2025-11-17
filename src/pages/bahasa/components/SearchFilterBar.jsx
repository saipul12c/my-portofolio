import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export const SearchFilterBar = React.memo(({ 
  searchTerm, 
  setSearchTerm, 
  filterLevel, 
  setFilterLevel, 
  viewMode, 
  setViewMode,
  filteredData,
  bahasaSehariHari,
  bahasaPemrograman 
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-gradient-to-r from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-cyan-500/20 shadow-lg"
  >
    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Cari bahasa, teknologi, atau kemampuan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#0f172a]/70 border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 text-sm sm:text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0f172a]/70 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 text-sm sm:text-base min-w-[140px]"
        >
          <option value="all">Semua Level</option>
          <option value="beginner">Pemula (0-69%)</option>
          <option value="intermediate">Menengah (70-84%)</option>
          <option value="advanced">Lanjutan (85-100%)</option>
        </select>

        <div className="flex bg-[#0f172a]/70 rounded-xl border border-cyan-500/30 overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base ${
              viewMode === "grid" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-400 hover:text-cyan-300"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base ${
              viewMode === "list" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-400 hover:text-cyan-300"
            }`}
          >
            List
          </button>
        </div>

        {(searchTerm || filterLevel !== "all") && (
          <button
            onClick={() => { setSearchTerm(""); setFilterLevel("all"); }}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm sm:text-base"
          >
            Reset
          </button>
        )}
      </div>
    </div>

    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-3 sm:mt-4 text-center overflow-hidden"
    >
      <p className="text-cyan-300 text-xs sm:text-sm">
        Menampilkan {filteredData.sehariHari.length + filteredData.pemrograman.length} dari {bahasaSehariHari.length + bahasaPemrograman.length} item
        {searchTerm && ` untuk "${searchTerm}"`}
      </p>
    </motion.div>
  </motion.div>
));