import { memo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, RefreshCw } from "lucide-react";
import HobbyCard from "./HobbyCard";

function HobbyGrid({ 
  displayedHobbies = [], 
  totalCount = 0, 
  hasMore = false, 
  onLoadMore, 
  onResetFilter 
}) {
  if (displayedHobbies.length === 0) {
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto">
        <p className="text-gray-400 text-base mb-4">
          Tidak ada hobi yang cocok dengan filter atau kata kunci pencarian.
        </p>
        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 text-sm font-medium transition-all"
          >
            <RefreshCw size={15} />
            Reset Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl">
      <m.section
        layout="position"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full"
      >
        <AnimatePresence mode="popLayout">
          {displayedHobbies.map((hobby) => (
            <HobbyCard 
              key={hobby.id} 
              hobby={hobby} 
              label={hobby.label} 
            />
          ))}
        </AnimatePresence>
      </m.section>

      {/* Progressive Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={onLoadMore}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#141a28] hover:bg-[#1c2438] border border-white/10 hover:border-cyan-400/40 text-sm font-semibold text-gray-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 active:scale-95"
          >
            <span>Tampilkan Lebih Banyak</span>
            <span className="text-xs text-gray-400 font-normal">
              ({displayedHobbies.length} dari {totalCount})
            </span>
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform text-cyan-400" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(HobbyGrid);