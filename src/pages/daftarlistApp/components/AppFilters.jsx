import React from "react";
import {
  Search,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import { APP_CATEGORIES } from "../data/appsData";

export default function AppFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalResults
}) {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Bar: Search + Sorting + View Mode */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama aplikasi, fitur, atau teknologi (misal: Zodiak, AI, React)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#111c34]/80 border border-white/10 hover:border-cyan-500/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-400 text-sm backdrop-blur-xl transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting & View Toggle */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-3 rounded-2xl bg-[#111c34]/80 border border-white/10 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif (Live)</option>
            <option value="Beta">Versi Beta</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-3 rounded-2xl bg-[#111c34]/80 border border-white/10 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="popular">Rating Tertinggi</option>
            <option value="newest">Tahun Terbaru</option>
            <option value="name">Nama (A - Z)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-[#111c34]/80 border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === "grid"
                  ? "bg-cyan-500 text-slate-900 shadow-md font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Tampilan Grid"
              aria-label="Tampilan Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === "list"
                  ? "bg-cyan-500 text-slate-900 shadow-md font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Tampilan List"
              aria-label="Tampilan List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {APP_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50 scale-[1.02]"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-white/10 text-cyan-300"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results status indicator */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Menampilkan <strong className="text-cyan-300 font-semibold">{totalResults}</strong> aplikasi
          {selectedCategory !== "all" && " pada kategori terpilih"}
          {searchQuery && ` untuk "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedStatus("all");
            }}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
}
