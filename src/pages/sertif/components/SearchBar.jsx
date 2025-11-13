import { m, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { highlightMatch } from "../utils/searchUtils";

const SearchBar = ({
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  categories,
  suggestions,
  activeIndex,
  ghostText,
  suggestionRef,
  handleKeyDown,
  highlightMatch
}) => {
  return (
    <div className="relative w-full max-w-3xl mb-10">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-300" size={18} />

          {/* Ghost Text */}
          <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
            <span className="text-gray-500/40 select-none">
              {search}
              <span className="text-gray-500/20">{ghostText}</span>
            </span>
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Cari sertifikat, penerbit, atau tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/10 border border-white/20 px-10 py-3 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition relative z-10 text-transparent caret-cyan-400"
            style={{ textShadow: "0 0 0 #fff" }}
          />

          {/* Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <m.ul
                ref={suggestionRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 right-0 bg-[#101726]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden z-30"
              >
                {suggestions.map((s, i) => (
                  <li
                    key={`${s.value}-${i}`}
                    onClick={() => setSearch(s.value)}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                      i === activeIndex
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "hover:bg-white/10"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(s.value, search),
                    }}
                  />
                ))}
              </m.ul>
            )}
          </AnimatePresence>
        </div>

        <select
          className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl cursor-pointer focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;