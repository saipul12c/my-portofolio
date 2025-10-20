import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Sparkles, ArrowRight } from "lucide-react";

export default function SearchBar({
  projects,
  categories,
  onSearchChange,
  onCategoryChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [ghostText, setGhostText] = useState("");
  const inputRef = useRef(null);

  // 📜 Ambil riwayat dari localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(saved);
  }, []);

  // 💾 Simpan riwayat & statistik
  const saveSearchHistory = (term) => {
    if (!term.trim()) return;

    const stats = JSON.parse(localStorage.getItem("searchStats") || "{}");
    const now = Date.now();
    stats[term] = {
      count: (stats[term]?.count || 0) + 1,
      lastUsed: now,
    };
    localStorage.setItem("searchStats", JSON.stringify(stats));

    const updated = [term, ...searchHistory.filter((t) => t !== term)].slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // 🧠 Ambil top project (rating tertinggi)
  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map((p) => p.title);
  }, [projects]);

  // 🔮 Saran otomatis adaptif
  const suggestions = useMemo(() => {
    const stats = JSON.parse(localStorage.getItem("searchStats") || "{}");

    const sortByStats = (a, b) => {
      const scoreA = (stats[a]?.count || 0) + (stats[a]?.lastUsed || 0) / 100000;
      const scoreB = (stats[b]?.count || 0) + (stats[b]?.lastUsed || 0) / 100000;
      return scoreB - scoreA;
    };

    if (!searchTerm.trim()) {
      const base = [...topProjects, ...searchHistory.filter((x) => !topProjects.includes(x))];
      return base.slice(0, 8).sort(sortByStats);
    }

    const filtered = projects
      .filter((p) =>
        [p.title, p.category, p.description]
          .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .map((p) => p.title);

    return filtered
      .filter((x, i, arr) => arr.indexOf(x) === i)
      .sort(sortByStats)
      .slice(0, 8);
  }, [searchTerm, projects, topProjects, searchHistory]);

  // 🪄 Update ghost text
  useEffect(() => {
    if (!searchTerm) return setGhostText("");
    const match = suggestions.find((s) =>
      s.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setGhostText(match && match !== searchTerm ? match : "");
  }, [searchTerm, suggestions]);

  // 🧹 Hapus semua data
  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    localStorage.removeItem("searchStats");
    setSearchHistory([]);
  };

  // ✨ Pilih suggestion
  const handleSelectSuggestion = (term) => {
    setSearchTerm(term);
    saveSearchHistory(term);
    onSearchChange(term);
    setShowSuggestions(false);
    setGhostText("");
  };

  // 🎯 Debounce pencarian
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      onSearchChange(value);
    }, 400);
    setTypingTimeout(timeout);
  };

  // ⌨️ Navigasi keyboard
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0) handleSelectSuggestion(suggestions[highlightIndex]);
      else handleSelectSuggestion(searchTerm);
    } else if ((e.key === "Tab" || e.key === "ArrowRight") && ghostText) {
      e.preventDefault();
      handleSelectSuggestion(ghostText);
    }
  };

  // ✨ Highlight hasil
  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark class='bg-cyan-600/50 text-white'>$1</mark>");
  };

  // 🗂 Ganti kategori
  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full max-w-4xl justify-center relative">
      {/* 🔍 Input + Ghost Layer */}
      <div className="relative w-full sm:w-2/3">
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />

        {/* Layer ghost */}
        <div className="relative w-full">
          <input
            type="text"
            readOnly
            value={ghostText}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-500 pointer-events-none select-none"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari proyek... (AI, Game, EduTech...)"
            value={searchTerm}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="absolute top-0 left-0 w-full bg-transparent border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder-gray-400 z-10"
            style={{ caretColor: "#22d3ee" }}
          />
        </div>

        {/* 💡 Daftar Saran */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-20 w-full mt-2 bg-[#1e293b]/90 border border-white/10 rounded-xl shadow-lg overflow-hidden backdrop-blur-lg"
            >
              {suggestions.map((term, i) => (
                <motion.li
                  key={i}
                  layout
                  onClick={() => handleSelectSuggestion(term)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-all ${
                    highlightIndex === i
                      ? "bg-cyan-600/40 text-white"
                      : "hover:bg-cyan-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {topProjects.includes(term) ? (
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                    <span
                      dangerouslySetInnerHTML={{ __html: highlightMatch(term) }}
                    />
                  </div>
                  {highlightIndex === i && (
                    <ArrowRight className="w-4 h-4 text-cyan-300" />
                  )}
                </motion.li>
              ))}

              {searchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="w-full text-center py-2 text-xs text-gray-400 hover:text-red-400 transition"
                >
                  Hapus riwayat pencarian
                </button>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* 🗂 Dropdown kategori */}
      <div className="relative w-full sm:w-1/3">
        <select
          value={activeCategory}
          onChange={handleCategoryChange}
          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 text-white appearance-none cursor-pointer"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat} className="bg-[#0f172a] text-white">
              {cat.includes("Popular") ? `🔥 ${cat}` : cat.includes("New") ? `🆕 ${cat}` : cat}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-3 text-gray-400 pointer-events-none">▼</span>
      </div>
    </div>
  );
}
