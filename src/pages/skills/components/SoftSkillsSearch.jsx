// SoftSkillsSearch.jsx
import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Sparkles, ArrowRight, Bot, History, Trash2 } from "lucide-react";

const SoftSkillsSearch = memo(({ skills = [], onFilterChange, highlightText, onOpenAI }) => {
  const searchRef = useRef(null);
  const historyRef = useRef(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [placeholderText, setPlaceholderText] = useState("");
  const [ghostText, setGhostText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [recentSearch, setRecentSearch] = useState(() => {
    try {
      const v = localStorage.getItem("ss_recent_search");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });

  const typeTimeoutRef = useRef(null);
  const typeStateRef = useRef({ currentPhrase: 0, currentChar: 0, deleting: false });
  const debounceRef = useRef(null);

  // Suggestions for AI (from Header)
  const aiSuggestions = [
    { text: "Bagaimana menilai keberhasilan pembelajaran digital?", color: "from-cyan-400 to-blue-500" },
    { text: "Teknologi apa yang paling efektif untuk mengajar?", color: "from-purple-400 to-pink-500" },
    { text: "Bagaimana menjadi guru yang kreatif di era digital?", color: "from-orange-400 to-yellow-500" },
  ];

  // Combined typewriter phrases
  useEffect(() => {
    const phrases = [
      "Bagaimana menjadi guru yang kreatif?",
      "Cara meningkatkan kemampuan komunikasi...",
      "Cari kreativitas...",
      "Tips mengelola waktu dengan efektif...",
      "Cari teamwork...",
      "Apa itu growth mindset?",
      "Cari kepemimpinan...",
    ];

    const type = () => {
      const state = typeStateRef.current;
      const fullText = phrases[state.currentPhrase];

      if (!state.deleting) {
        setPlaceholderText(fullText.slice(0, state.currentChar + 1));
        state.currentChar++;
        if (state.currentChar === fullText.length) {
          state.deleting = true;
          typeTimeoutRef.current = setTimeout(type, 1800);
          return;
        }
      } else {
        setPlaceholderText(fullText.slice(0, state.currentChar - 1));
        state.currentChar--;
        if (state.currentChar === 0) {
          state.deleting = false;
          state.currentPhrase = (state.currentPhrase + 1) % phrases.length;
        }
      }
      typeTimeoutRef.current = setTimeout(type, state.deleting ? 100 : 150);
    };

    type();

    return () => {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
    };
  }, []);

  // Keyboard Shortcut: Ctrl/Cmd+F untuk fokus ke search bar
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // Filter with debounce (performance)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = search.trim().toLowerCase();

      const filtered = skills.filter((skill) => {
        if (!skill) return false;
        const name = (skill.name || "").toLowerCase();
        const desc = (skill.description || "").toLowerCase();
        const cat = (skill.category || "").toLowerCase();
        const labels = (skill.labels || []).map((l) => String(l).toLowerCase());

        const matchSearch =
          q.length === 0 ||
          name.includes(q) ||
          desc.includes(q) ||
          cat.includes(q) ||
          labels.some((l) => l.includes(q));

        const matchCategory =
          categoryFilter === "All" ||
          (skill.category || "").toLowerCase() === categoryFilter.toLowerCase();

        return matchSearch && matchCategory;
      });

      onFilterChange?.(filtered, search);

      // Ghost text auto-complete (first suggestion)
      if (q.length > 0) {
        const exactSuggestion = skills.find((s) =>
          (s.name || "").toLowerCase().startsWith(q)
        );
        setGhostText(exactSuggestion ? exactSuggestion.name : "");
      } else {
        setGhostText("");
      }
    }, 220);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, categoryFilter, skills, onFilterChange]);

  // Suggestions (top 6) based on name matching
  useEffect(() => {
    if (search.trim().length === 0) {
      setSuggestions([]);
      setActiveSuggestion(-1);
      return;
    }
    const matched = skills
      .filter((s) => (s.name || "").toLowerCase().includes(search.toLowerCase()))
      .slice(0, 6);
    setSuggestions(matched);
    setActiveSuggestion(matched.length > 0 ? 0 : -1);
  }, [search, skills]);

  // Persist recentSearch to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ss_recent_search", JSON.stringify(recentSearch));
    } catch {
      // intentionally left blank
    }
  }, [recentSearch]);

  // Suggestion selection helper
  const handleSelectSuggestion = (text) => {
    setSearch(text);
    setSuggestions([]);
    setShowSuggestions(false);
    setGhostText("");
    if (!recentSearch.includes(text)) {
      setRecentSearch((prev) => [text, ...prev.slice(0, 4)]);
    }
    setTimeout(() => searchRef.current?.blur(), 40);
  };

  // Tutup riwayat saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
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
        handleSelectSuggestion(suggestions[activeSuggestion].name);
      } else {
        handleSelectSuggestion(search);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setShowHistory(false);
    } else if (e.key === "Tab") {
      if (ghostText && ghostText.toLowerCase().startsWith(search.toLowerCase())) {
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
      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        {/* Search Input Layer */}
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-20 pointer-events-none" />

          {/* Main Input Container */}
          <div className="relative w-full">
            {/* Ghost text overlay */}
            {ghostText && search && ghostText.toLowerCase().startsWith(search.toLowerCase()) && (
              <div className="absolute inset-0 pl-12 pr-[140px] py-3.5 text-sm pointer-events-none flex items-center overflow-hidden font-normal z-10 select-none">
                <span className="invisible">{search}</span>
                <span className="text-gray-500/50">{ghostText.slice(search.length)}</span>
              </div>
            )}
            <input
              ref={searchRef}
              type="text"
              placeholder={placeholderText || "Cari skill..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-[140px] py-3.5 text-sm text-white focus:border-cyan-400 outline-none z-10 transition-all relative"
              style={{ caretColor: "#22d3ee" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              aria-label="Cari skill"
            />

            {/* Action Buttons inside Search Bar */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-20">
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSuggestions([]);
                    setGhostText("");
                  }}
                  className="px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
                  aria-label="Bersihkan pencarian"
                >
                  ✕
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenAI?.(search)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-white transition-all border border-cyan-500/30 shadow-sm"
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
                    layout
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
                          __html: highlightText(s.name, search),
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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

      {/* Suggestions & History (from Header) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-wrap items-center justify-between gap-4 px-2"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-yellow-400/80">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Saran:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onOpenAI?.(s.text)}
                className={`text-[11px] font-medium px-4 py-2 rounded-full bg-gradient-to-r ${s.color} text-white shadow-lg hover:scale-105 transition-transform truncate max-w-[200px] sm:max-w-none`}
              >
                <div className="flex items-center gap-2">
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
            className={`flex items-center gap-2 transition-colors py-1 px-2 rounded-lg ${
              showHistory ? "text-cyan-400 bg-cyan-500/10" : "text-gray-500 hover:text-gray-300"
            }`}
            aria-expanded={showHistory}
            aria-label="Riwayat pencarian"
          >
            <History className="w-4 h-4" />
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
                        localStorage.removeItem("ss_recent_search");
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
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
                            setSearch(item);
                            setShowHistory(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-cyan-500/20 hover:text-white transition-colors truncate flex items-center gap-2"
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

export default SoftSkillsSearch;