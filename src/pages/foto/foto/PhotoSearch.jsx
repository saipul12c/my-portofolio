import { useState, useEffect, useMemo, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Grid3x3, Grid2x2 } from "lucide-react";

// Subkomponen terisolasi untuk efek ketik agar TIDAK me-render ulang seluruh PhotoSearch
const TypewriterPlaceholder = memo(function TypewriterPlaceholder({ phrases, active }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!active) return;
    
    let currentPhrase = 0;
    let currentChar = 0;
    let deleting = false;
    let timeout;

    const type = () => {
      const fullText = phrases[currentPhrase];

      if (!deleting) {
        setText(fullText.slice(0, currentChar + 1));
        currentChar++;
        if (currentChar === fullText.length) {
          deleting = true;
          timeout = setTimeout(type, 2200);
          return;
        }
      } else {
        setText(fullText.slice(0, currentChar - 1));
        currentChar--;
        if (currentChar === 0) {
          deleting = false;
          currentPhrase = (currentPhrase + 1) % phrases.length;
        }
      }
      timeout = setTimeout(type, deleting ? 35 : 70);
    };

    type();
    return () => clearTimeout(timeout);
  }, [phrases, active]);

  if (!active) return null;

  return (
    <span className="pointer-events-none absolute left-10 top-2.5 text-sm text-gray-400 select-none flex items-center">
      {text}
      <span className="inline-block w-1 h-3.5 ml-0.5 bg-cyan-400 animate-pulse" />
    </span>
  );
});

function PhotoSearch({ onSearch, allPhotos = [], onFilterChange, onViewChange, currentView = "grid", externalSearchTerm = "" }) {
  const [query, setQuery] = useState(externalSearchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isFocused, setIsFocused] = useState(false);
  const queryRef = useRef(query);
  queryRef.current = query;

  // Sync external search term jika diubah dari luar (misal saran kategori)
  useEffect(() => {
    if (externalSearchTerm !== undefined && externalSearchTerm !== queryRef.current) {
      setQuery(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  const phrases = useMemo(
    () => [
      "Cari foto berdasarkan judul atau kategori...",
      "Cari foto berdasarkan tema (Nature, City, Portrait...)",
      "Cari foto berdasarkan mood (Dark, Bright, Warm...)",
      "Cari foto berdasarkan lokasi...",
    ],
    []
  );

  // Extract unique categories efficiently
  const categories = useMemo(() => {
    const cats = new Set(["all"]);
    allPhotos.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [allPhotos]);

  // Precompute unique search tokens once
  const allTerms = useMemo(() => {
    const terms = new Set();
    allPhotos.forEach(p => {
      if (p.title) terms.add(p.title);
      if (p.category) terms.add(p.category);
      if (p.mood) terms.add(p.mood);
      if (p.location) terms.add(p.location);
    });
    return Array.from(terms);
  }, [allPhotos]);

  // O(N) suggestions with early termination at 6 items
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches = [];
    for (let i = 0; i < allTerms.length; i++) {
      if (allTerms[i].toLowerCase().includes(q)) {
        matches.push(allTerms[i]);
        if (matches.length >= 6) break;
      }
    }
    return matches;
  }, [allTerms, query]);

  // Debounced search trigger to avoid lag when typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
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
          <Search className="absolute left-3 top-3 text-gray-400 z-10" size={18} />
          
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setShowSuggestions(true);
              setIsFocused(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
              setIsFocused(false);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-transparent transition-all"
          />

          {/* Typewriter placeholder terisolasi (hanya aktif saat kosong & tidak fokus) */}
          <TypewriterPlaceholder phrases={phrases} active={!query && !isFocused} />

          {query && (
            <motion.button
              onClick={clearSearch}
              whileHover={{ scale: 1.1 }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition z-10"
              title="Hapus pencarian"
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
              ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-lg shadow-cyan-500/10" 
              : "bg-white/5 border-white/10 text-gray-400 hover:border-cyan-400/30"
          }`}
          title="Filter & Urutkan"
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
            title={currentView === "grid" ? "Ubah ke Masonry View" : "Ubah ke Grid View"}
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

export default memo(PhotoSearch);