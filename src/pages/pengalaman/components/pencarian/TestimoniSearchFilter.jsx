import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { similarity } from "../utilsTestimoni.jsx";

export default function TestimoniSearchFilter({
  searchQuery,
  setSearchQuery,
  suggestions,
  focusedIndex,
  setFocusedIndex,
  showSuggestions,
  setShowSuggestions,
  inputRef,
  suggestionRef,
  minRating,
  setMinRating,
  selectedTag,
  setSelectedTag,
  tags,
  setDebouncedQuery,
}) {
  // 🧩 History-based prioritization
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem("search_history_testimoni");
    return stored ? JSON.parse(stored) : [];
  });

  const addToHistory = (term) => {
    setSearchHistory((prev) => {
      const updated = [term, ...prev.filter((t) => t !== term)].slice(0, 10);
      localStorage.setItem("search_history_testimoni", JSON.stringify(updated));
      return updated;
    });
  };

  // 🎯 Adaptive Fuzzy Threshold (auto menyesuaikan panjang query)
  const getAdaptiveThreshold = (q) => {
    if (!q) return 0.05;
    if (q.length <= 3) return 0.05;
    if (q.length <= 6) return 0.1;
    return 0.15;
  };

  // 🧠 Smart Autocomplete Continuation + multi-layer similarity
  const ghostText = useMemo(() => {
    if (!searchQuery.trim() || !suggestions?.length) return "";

    const lowerQuery = searchQuery.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/);
    const lastWord = words[words.length - 1];

    const contextOverlap = (queryWords, name) => {
      const nameWords = name.split(/\s+/);
      let matchCount = 0;
      queryWords.forEach((q) => {
        if (nameWords.some((n) => n.startsWith(q))) matchCount++;
      });
      return matchCount / nameWords.length;
    };

    const ranked = suggestions.map((s) => {
      const name = s.name.toLowerCase();

      const scoreGlobal = similarity(lowerQuery, name);
      const scoreWord = similarity(lastWord, name);
      const scoreLetter = name.startsWith(lowerQuery)
        ? Math.min(1, lowerQuery.length / name.length)
        : 0;
      const scoreContext = contextOverlap(words, name);

      // Smart continuation: prediksi kelanjutan kata yang sering muncul setelah query
      const continuationBoost =
        name.includes(lowerQuery + " ") || name.startsWith(lowerQuery + " ")
          ? 0.25
          : 0;

      const reorderBoost =
        words.every((w) => name.includes(w)) && words.length > 1 ? 0.15 : 0;

      const totalWeight =
        scoreGlobal * 0.45 +
        scoreWord * 0.2 +
        scoreLetter * 0.1 +
        scoreContext * 0.1 +
        continuationBoost +
        reorderBoost;

      return { name: s.name, score: totalWeight, nameLower: name };
    });

    const sorted = ranked.sort((a, b) => b.score - a.score);
    const best = sorted[0];
    if (!best || best.score < getAdaptiveThreshold(searchQuery)) return "";

    const bestName = best.name;
    const bestLower = best.nameLower;

    // Case 1: cocok dari awal kata
    if (bestLower.startsWith(lowerQuery)) return bestName;

    // Case 2: lanjut kata berikutnya
    const matchWord = bestName
      .split(" ")
      .find((w) => w.toLowerCase().startsWith(lastWord));
    if (matchWord)
      return (
        searchQuery +
        (searchQuery.endsWith(" ") ? "" : " ") +
        matchWord.slice(lastWord.length)
      );

    // Case 3: urutan bebas
    const nameWords = bestName.split(" ");
    const missing = nameWords.filter(
      (w) => !words.some((q) => w.toLowerCase().startsWith(q))
    );
    if (missing.length > 0) return searchQuery + " " + missing.join(" ");

    return bestName;
  }, [searchQuery, suggestions]);

  // 🔍 Smart sorting with history + adaptive threshold
  const sortedSuggestions = useMemo(() => {
    if (!suggestions) return [];

    if (!searchQuery) {
      const recent = searchHistory
        .map((term) => suggestions.find((s) => s.name === term))
        .filter(Boolean);
      const others = suggestions
        .filter((s) => !recent.some((r) => r.name === s.name))
        .slice(0, 5 - recent.length);
      return [...recent, ...others].slice(0, 5);
    }

    const threshold = getAdaptiveThreshold(searchQuery);

    const scored = suggestions
      .map((s) => ({
        ...s,
        score:
          similarity(searchQuery, s.name) +
          (searchHistory.includes(s.name) ? 0.1 : 0),
      }))
      .filter((s) => s.score > threshold)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 5);
  }, [suggestions, searchQuery, searchHistory]);

  // 💬 Animated placeholder (✅ FIXED: words pakai useMemo)
  const [placeholder, setPlaceholder] = useState("");
  const words = useMemo(
    () => ["Cari nama...", "Cari peran...", "Cari proyek..."],
    []
  );

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout;
    const type = () => {
      const currentWord = words[wordIndex];
      if (!deleting) {
        setPlaceholder(currentWord.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentWord.length) {
          deleting = true;
          timeout = setTimeout(type, 1500);
          return;
        }
      } else {
        setPlaceholder(currentWord.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      timeout = setTimeout(type, deleting ? 50 : 100);
    };
    type();
    return () => clearTimeout(timeout);
  }, [words]);

  // 📜 Scroll otomatis ke item aktif
  useEffect(() => {
    if (suggestionRef?.current && focusedIndex >= 0) {
      const activeItem = suggestionRef.current.children[focusedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [focusedIndex, suggestionRef]);

  // ⌨️ Keyboard navigation + autocomplete
  const handleKeyDown = (e) => {
    if (!showSuggestions || sortedSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % sortedSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev <= 0 ? sortedSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = sortedSuggestions[focusedIndex] || sortedSuggestions[0];
      if (chosen) {
        setSearchQuery(chosen.name);
        setDebouncedQuery(chosen.name);
        addToHistory(chosen.name);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      setSearchQuery(ghostText);
      setDebouncedQuery(ghostText);
      addToHistory(ghostText);
      setShowSuggestions(false);
    }
  };

  // Tutup suggestion saat klik di luar (✅ FIXED: tambahkan dependencies)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef, suggestionRef, setShowSuggestions]);

  const escapeRegex = (str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mb-8 sm:mb-12 relative px-2 sm:px-0">
      {/* Search */}
      <div className="relative" ref={inputRef}>
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-300 z-30 w-4 h-4 sm:w-5 sm:h-5" />

        <div className="relative w-full">
          {/* Ghost text */}
          {ghostText && (
            <div
              className="absolute inset-0 flex items-center pl-10 sm:pl-12 pr-3 sm:pr-4 pointer-events-none z-10 font-medium text-gray-400 text-sm sm:text-base"
              style={{ whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {ghostText.toLowerCase().startsWith(searchQuery.toLowerCase()) ? (
                <>
                  <span className="text-transparent">{searchQuery}</span>
                  <span className="opacity-40">
                    {ghostText.slice(searchQuery.length)}
                  </span>
                </>
              ) : null}
            </div>
          )}

          {/* Input */}
          <input
            type="text"
            value={searchQuery}
            placeholder={placeholder + " |"}
            onFocus={() => {
              setShowSuggestions(true);
              if (!searchQuery.trim()) setDebouncedQuery("");
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
              setFocusedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border border-cyan-400/30 rounded-full py-2 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 relative z-20 font-medium tracking-wide text-sm sm:text-base"
          />
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && sortedSuggestions.length > 0 && (
            <motion.ul
              ref={suggestionRef}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute top-12 sm:top-14 left-0 right-0 bg-[#1e293b]/95 border border-cyan-400/20 rounded-lg sm:rounded-xl shadow-xl z-40 max-h-48 sm:max-h-60 overflow-y-auto"
            >
              {sortedSuggestions.map((s, i) => {
                const regex = new RegExp(`(${escapeRegex(searchQuery)})`, "gi");
                const highlighted = s.name.replace(
                  regex,
                  (match) =>
                    `<mark class='bg-cyan-400/40 text-white'>${match}</mark>`
                );
                return (
                  <li
                    key={s.id || s.name}
                    onMouseEnter={() => setFocusedIndex(i)}
                    onClick={() => {
                      setSearchQuery(s.name);
                      setDebouncedQuery(s.name);
                      addToHistory(s.name);
                      setShowSuggestions(false);
                    }}
                    className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer text-xs sm:text-sm transition-colors ${
                      i === focusedIndex
                        ? "bg-cyan-500/30"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span
                      className="font-medium"
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                    <span className="text-cyan-300 text-xs ml-1 sm:ml-2">{s.role}</span>
                    {s.company && (
                      <span className="text-gray-400 text-[10px] sm:text-[11px] ml-1 sm:ml-2">
                        {s.company}
                      </span>
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1e293b]/85 border border-cyan-400/30 rounded-lg sm:rounded-full text-sm">
          <Filter size={16} className="text-cyan-300 flex-shrink-0" />
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-transparent text-gray-100 w-full outline-none cursor-pointer text-sm"
          >
            <option value="0">Semua Rating</option>
            <option value="4">Minimal 4 ⭐</option>
            <option value="4.5">Minimal 4.5 ⭐</option>
            <option value="5">Hanya 5 ⭐</option>
          </select>
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="bg-[#1e293b]/85 border border-cyan-400/30 rounded-lg sm:rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-gray-100 outline-none cursor-pointer focus:ring-2 focus:ring-cyan-400 text-sm"
        >
          {tags.map((tag) => (
            <option key={tag} value={tag} className="bg-[#0f172a]">
              {tag.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
