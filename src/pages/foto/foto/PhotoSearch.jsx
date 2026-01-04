import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Grid3x3, Grid2x2 } from "lucide-react";

export default function PhotoSearch({ onSearch, allPhotos = [], onFilterChange, onViewChange, currentView = "grid" }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const phrases = useMemo(
    () => [
      "Cari foto berdasarkan judul atau kategori...",
      "Cari foto berdasarkan tema (Nature, City, Portrait...)",
      "Cari foto berdasarkan mood (Dark, Bright, Warm...)",
      "Cari foto berdasarkan lokasi...",
    ],
    []
  );

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(allPhotos.map(p => p.category).filter(Boolean))];
    return cats;
  }, [allPhotos]);

  // Typing effect untuk placeholder
  useEffect(() => {
    let currentPhrase = 0;
    let currentChar = 0;
    let deleting = false;
    let timeout;

    const type = () => {
      const fullText = phrases[currentPhrase];

      if (!deleting) {
        setPlaceholderText(fullText.slice(0, currentChar + 1));
        currentChar++;
        if (currentChar === fullText.length) {
          deleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
      } else {
        setPlaceholderText(fullText.slice(0, currentChar - 1));
        currentChar--;
        if (currentChar === 0) {
          deleting = false;
          currentPhrase = (currentPhrase + 1) % phrases.length;
        }
      }
      timeout = setTimeout(type, deleting ? 40 : 80);
    };

    type();
    return () => clearTimeout(timeout);
  }, [phrases]);

  const suggestions = allPhotos
    .flatMap((p) => [p.title, p.category, p.mood, p.location])
    .filter((item, index, self) => item && self.indexOf(item) === index)
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    onSearch(value);
  };

  const handleSelect = (value) => {
    setQuery(value);
    setShowSuggestions(false);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    onSearch("");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange({ category, sortBy });
    }
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    if (onFilterChange) {
      onFilterChange({ category: selectedCategory, sortBy: sort });
    }
  };

  return (
    <div className="w-full max-w-4xl mb-8 mx-auto space-y-4">
      {/* Search Bar with View Toggle */}
      <div className="flex gap-2 items-center">
        <motion.div
          className="relative flex-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={placeholderText || "Cari foto..."}
            value={query}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition-all"
          />

          {query && (
            <motion.button
              onClick={clearSearch}
              whileHover={{ scale: 1.1 }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </motion.button>
          )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            className="absolute mt-2 w-full bg-[#0f172a]/95 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((item, i) => (
              <motion.li
                key={i}
                onClick={() => handleSelect(item)}
                whileHover={{
                  backgroundColor: "rgba(34,211,238,0.15)",
                  transition: { duration: 0.1 },
                }}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white cursor-pointer flex items-center gap-2"
              >
                <Search size={14} className="text-cyan-400 flex-shrink-0" /> 
                <span className="truncate">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
        </motion.div>

        {/* Filter Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-full border transition-all ${
            showFilters 
              ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300" 
              : "bg-white/5 border-white/10 text-gray-400 hover:border-cyan-400/30"
          }`}
        >
          <SlidersHorizontal size={18} />
        </motion.button>

        {/* View Toggle */}
        {onViewChange && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange(currentView === "grid" ? "masonry" : "grid")}
            className="p-2.5 rounded-full border bg-white/5 border-white/10 text-gray-400 hover:border-cyan-400/30 transition-all"
            title={currentView === "grid" ? "Switch to Masonry" : "Switch to Grid"}
          >
            {currentView === "grid" ? <Grid2x2 size={18} /> : <Grid3x3 size={18} />}
          </motion.button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 backdrop-blur-md">
              {/* Category Filter */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === cat
                          ? "bg-cyan-500/30 border-cyan-400/60 text-cyan-300 shadow-lg shadow-cyan-500/20"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-400/30"
                      }`}
                    >
                      {cat === "all" ? "Semua" : cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium">Urutkan</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "date", label: "Terbaru" },
                    { value: "title", label: "Judul" },
                    { value: "category", label: "Kategori" }
                  ].map(option => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSortChange(option.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        sortBy === option.value
                          ? "bg-purple-500/30 border-purple-400/60 text-purple-300 shadow-lg shadow-purple-500/20"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:border-purple-400/30"
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}