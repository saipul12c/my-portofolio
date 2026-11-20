// SoftSkillsSearch.jsx
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Sparkles, ArrowRight, Bot, History, Trash2 } from "lucide-react";
import { highlightText } from "./SoftSkillsUtils";

const AI_SUGGESTIONS = [
  { text: "Bagaimana menilai keberhasilan pembelajaran digital?", color: "from-cyan-400 to-blue-500" },
  { text: "Teknologi apa yang paling efektif untuk mengajar?", color: "from-purple-400 to-pink-500" },
  { text: "Bagaimana menjadi guru yang kreatif di era digital?", color: "from-orange-400 to-yellow-500" },
];

const TYPEWRITER_PHRASES = [
  "Bagaimana menjadi guru yang kreatif?",
  "Cara meningkatkan kemampuan komunikasi...",
  "Cari kreativitas...",
  "Tips mengelola waktu dengan efektif...",
  "Cari teamwork...",
  "Apa itu growth mindset?",
  "Cari kepemimpinan...",
];

const SoftSkillsSearch = memo(({
  skills = [],
  searchValue = "",
  categoryValue = "All",
  onSearchChange,
  onCategoryChange,
  onOpenAI
}) => {
  const searchRef = useRef(null);
  const historyRef = useRef(null);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [ghostText, setGhostText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [recentSearch, setRecentSearch] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const v = localStorage.getItem("ss_recent_search");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });

  // Sync with prop if changed from outside
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // HIGH-PERFORMANCE TYPEWRITER EFFECT:
  // Directly updates input.placeholder via DOM ref so ZERO React re-renders occur!
  useEffect(() => {
    let currentPhrase = 0;
    let currentChar = 0;
    let deleting = false;
    let timer = null;

    const type = () => {
      const fullText = TYPEWRITER_PHRASES[currentPhrase];
      if (!deleting) {
        currentChar++;
        if (searchRef.current && !searchRef.current.value) {
          searchRef.current.placeholder = fullText.slice(0, currentChar);
        }
        if (currentChar === fullText.length) {
          deleting = true;
          timer = setTimeout(type, 2000);
          return;
        }
      } else {
        currentChar--;
        if (searchRef.current && !searchRef.current.value) {
          searchRef.current.placeholder = fullText.slice(0, currentChar) || "Cari skill...";
        }
        if (currentChar === 0) {
          deleting = false;
          currentPhrase = (currentPhrase + 1) % TYPEWRITER_PHRASES.length;
        }
      }
      timer = setTimeout(type, deleting ? 80 : 130);
    };

    timer = setTimeout(type, 150);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Keyboard Shortcut: Ctrl/Cmd + F to focus search bar
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // Debounced search notification to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange?.(localSearch);

      // Compute ghost text
      const q = localSearch.trim().toLowerCase();
      if (q.length > 0) {
        const match = skills.find((s) => (s.name || "").toLowerCase().startsWith(q));
        setGhostText(match ? match.name : "");
      } else {
        setGhostText("");
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange, skills]);

  // Suggestions (top 6 matches)
  useEffect(() => {
    const q = localSearch.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setActiveSuggestion(-1);
      return;
    }
    const matched = skills
      .filter((s) => (s.name || "").toLowerCase().includes(q))
      .slice(0, 6);
    setSuggestions(matched);
    setActiveSuggestion(matched.length > 0 ? 0 : -1);
  }, [localSearch, skills]);

  // Persist recent search
  const saveRecentSearch = useCallback((text) => {
    if (!text || typeof text !== "string") return;
    const clean = text.trim();
    if (!clean) return;

    setRecentSearch((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered.slice(0, 4)];
      try {
        localStorage.setItem("ss_recent_search", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleSelectSuggestion = useCallback((text) => {
    setLocalSearch(text);
    onSearchChange?.(text);
    setSuggestions([]);
    setShowSuggestions(false);
    setGhostText("");
    saveRecentSearch(text);
    setTimeout(() => searchRef.current?.blur(), 40);
  }, [onSearchChange, saveRecentSearch]);

  // Click outside to close history dropdown
  useEffect(() => {
    if (!showHistory) return;
    const handleClickOutside = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHistory]);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeSuggestion].name);
      } else if (localSearch.trim()) {
        saveRecentSearch(localSearch);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setShowHistory(false);
    } else if (e.key === "Tab") {
      if (ghostText && ghostText.toLowerCase().startsWith(localSearch.toLowerCase())) {
        e.preventDefault();
        handleSelectSuggestion(ghostText);
      } else if (suggestions[0]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[0].name);
      }
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    skills.forEach((s) => {
      if (s?.category) set.add(s.category);
    });
    return ["All", ...Array.from(set)];
  }, [skills]);

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 mb-12">
      <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Search Input Layer */}
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-20 pointer-events-none" />

          {/* Main Input Container */}
          <div className="relative w-full">
            {/* Ghost text overlay */}
            {ghostText && localSearch && ghostText.toLowerCase().startsWith(localSearch.toLowerCase()) && (
              <div className="absolute inset-0 pl-12 pr-[140px] py-3.5 text-sm pointer-events-none flex items-center overflow-hidden font-normal z-10 select-none">
                <span className="invisible">{localSearch}</span>
                <span className="text-gray-500/50">{ghostText.slice(localSearch.length)}</span>
              </div>
            )}
            <input
              ref={searchRef}
              type="text"
              placeholder="Cari skill..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-[140px] py-3.5 text-sm text-white focus:border-cyan-400 outline-none z-10 transition-all relative"
              style={{ caretColor: "#22d3ee" }}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              aria-label="Cari soft skill"
            />

            {/* Action Buttons inside Search Bar */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-20">
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    onSearchChange?.("");
                    setSuggestions([]);
                    setGhostText("");
                  }}
                  className="px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                  aria-label="Bersihkan pencarian"
                >
                  ✕
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenAI?.(localSearch)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-white transition-all border border-cyan-500/30 shadow-sm cursor-pointer"
                title="Tanyakan kepada Asisten AI"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="font-semibold text-[10px] uppercase tracking-wider">Tanya AI</span>
              </button>
            </div>
          </div>

          {/* Suggestion Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-[30] w-full mt-2 bg-gray-900/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-md overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <motion.li
                    key={s.id || `${s.name}-${i}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectSuggestion(s.name)}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all ${
                      activeSuggestion === i
                        ? "bg-cyan-600/40 text-white"
                        : "hover:bg-cyan-500/20 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {s.priority ? (
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(s.name, localSearch),
                        }}
                      />
                    </div>

                    {activeSuggestion === i && (
                      <ArrowRight className="w-4 h-4 text-cyan-300" />
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-1/3">
          <select
            className="w-full p-3.5 rounded-2xl bg-gray-800 border border-white/10 text-white focus:border-cyan-400 outline-none cursor-pointer text-sm"
            value={categoryValue}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            aria-label="Filter kategori"
          >
            <option value="All">🔥 Semua Kategori</option>
            {categories
              .filter((cat) => cat !== "All")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Suggestions & History */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-wrap items-center justify-between gap-4 px-1"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-yellow-400/80 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Saran:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {AI_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => onOpenAI?.(s.text)}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-full bg-gradient-to-r ${s.color} text-white shadow-md hover:scale-105 transition-transform truncate max-w-[200px] sm:max-w-none cursor-pointer`}
              >
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                   {s.text}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* History Button & Popover */}
        <div className="relative" ref={historyRef}>
          <button 
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className={`flex items-center gap-1.5 transition-colors py-1 px-2.5 rounded-lg cursor-pointer ${
              showHistory ? "text-cyan-400 bg-cyan-500/10" : "text-gray-500 hover:text-gray-300"
            }`}
            aria-expanded={showHistory}
            aria-label="Riwayat pencarian"
          >
            <History className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Riwayat</span>
            {recentSearch.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute right-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 w-64 bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-3 z-40"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Pencarian Terakhir
                  </span>
                  {recentSearch.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSearch([]);
                        try {
                          localStorage.removeItem("ss_recent_search");
                        } catch {
                          // ignore
                        }
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </button>
                  )}
                </div>

                {recentSearch.length === 0 ? (
                  <p className="text-xs text-gray-500 py-3 text-center">
                    Belum ada riwayat pencarian
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {recentSearch.map((item, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalSearch(item);
                            onSearchChange?.(item);
                            setShowHistory(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-cyan-500/20 hover:text-white transition-colors truncate flex items-center gap-2 cursor-pointer"
                        >
                          <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
});

SoftSkillsSearch.displayName = "SoftSkillsSearch";
export default SoftSkillsSearch;
