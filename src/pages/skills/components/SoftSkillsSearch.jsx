// SoftSkillsSearch.jsx
import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Sparkles, ArrowRight, Bot, History } from "lucide-react";

const SoftSkillsSearch = memo(({ skills = [], onFilterChange, highlightText, onOpenAI }) => {
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [placeholderText, setPlaceholderText] = useState("");
  const [ghostText, setGhostText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    } else if (e.key === "Tab" && suggestions[0]) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[0].name);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 mb-12">
      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        {/* Search Input Layer */}
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />

          {/* Ghost Auto-Text (Read-Only) */}
          <input
            type="text"
            readOnly
            value={ghostText}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-500 pointer-events-none select-none opacity-80"
            aria-hidden
          />

          {/* Main Input (Typing) */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center pr-2">
            <input
              ref={searchRef}
              type="text"
              placeholder={placeholderText || "Cari skill..."}
              className="w-full bg-transparent border border-white/10 rounded-2xl pl-12 pr-[120px] py-3 text-sm text-white focus:border-cyan-400 outline-none z-10 transition-all h-full"
              style={{ caretColor: "#22d3ee" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              aria-label="Cari skill"
            />
            
            {/* Unified AI Button inside Search Bar */}
            <button
              onClick={() => onOpenAI?.(search)}
              className="absolute right-2 flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#252b3d] hover:bg-[#2d354a] text-gray-300 hover:text-white transition-all border border-white/5 z-20"
            >
              <Bot className="w-4 h-4" />
              <span className="font-semibold text-[10px] uppercase tracking-wider">Tanya AI</span>
            </button>
          </div>

          {/* Clear Button (Offset by AI button) */}
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setSuggestions([]);
                setGhostText("");
              }}
              className="absolute right-[110px] top-3.5 text-gray-400 hover:text-white z-20"
              aria-label="Bersihkan pencarian"
            >
              ✕
            </button>
          )}

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
                    onClick={() => handleSelectSuggestion(s.name)}
                    onMouseEnter={() => setActiveSuggestion(i)}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-all ${
                      activeSuggestion === i
                        ? "bg-cyan-600/40 text-white"
                        : "hover:bg-cyan-500/20"
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
            className="w-full p-3.5 rounded-2xl bg-gray-800 border border-white/10 text-white focus:border-cyan-400 outline-none cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter kategori"
          >
            <option value="All">🔥 Semua Kategori</option>
            <option value="Soft Skill">Soft Skill</option>
            <option value="Professional Skill">Professional Skill</option>
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

        <button 
          onClick={() => {
            if (recentSearch.length > 0) {
              setSearch(recentSearch[0]);
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Riwayat</span>
        </button>
      </motion.div>
    </div>
  );
});

export default SoftSkillsSearch;