import { motion, AnimatePresence } from "framer-motion";

export default function SoftSkillsSearch({
  searchRef,
  search,
  setSearch,
  suggestions,
  activeSuggestion,
  handleKeyDown,
  handleSelectSuggestion,
  highlightText,
  placeholderText,
  categoryFilter,
  setCategoryFilter,
}) {
  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl mb-12 gap-6">
      <div className="relative w-full">
        <input
          ref={searchRef}
          type="text"
          placeholder={placeholderText || "Cari skill..."}
          className="flex-1 w-full p-4 rounded-2xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-3 text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        )}

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-20 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.id || s.name}
                  onClick={() => handleSelectSuggestion(s.name)}
                  className={`px-4 py-2 cursor-pointer hover:bg-cyan-600 ${
                    i === activeSuggestion ? "bg-cyan-700" : ""
                  }`}
                >
                  {highlightText(s.name, search)}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <select
        className="p-4 rounded-2xl bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400 transition-all"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="All">Semua Kategori</option>
        <option value="Soft Skill">Soft Skill</option>
        <option value="Professional Skill">Professional Skill</option>
      </select>
    </div>
  );
}
