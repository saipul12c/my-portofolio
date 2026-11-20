import { memo } from "react";
import { m } from "framer-motion";
import { Search, X } from "lucide-react";

function HobbyFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  searchQuery = "",
  onSearchChange,
  totalHobbies = 0,
  filteredCount = 0
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl flex flex-col items-center gap-6 mb-12"
    >
      {/* Search Input */}
      {onSearchChange && (
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari hobi atau topik..."
            className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#141a28]/90 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Bersihkan pencarian"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {categories.map((category) => (
          <FilterButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
          />
        ))}
      </div>

      {/* Live Counter Info */}
      <div className="text-xs text-gray-400 font-medium">
        {searchQuery ? (
          <span>Ditemukan <strong className="text-cyan-300">{filteredCount}</strong> dari {totalHobbies} aktivitas</span>
        ) : (
          <span>Total <strong className="text-cyan-300">{filteredCount}</strong> aktivitas</span>
        )}
      </div>
    </m.div>
  );
}

const FilterButton = memo(function FilterButton({ category, isSelected, onClick }) {
  const baseClasses = "px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-cyan-400/50";
  const selectedClasses = "bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)]";
  const unselectedClasses = "border-white/10 bg-[#141a28]/50 text-gray-400 hover:text-white hover:border-cyan-400/30";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {category}
    </button>
  );
});

export default memo(HobbyFilter);