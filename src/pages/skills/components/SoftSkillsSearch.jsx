// SoftSkillsSearch.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Sparkles, ArrowRight } from "lucide-react";

export default function SoftSkillsSearch({ skills = [], onFilterChange, highlightText }) {
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

  // Placeholder typewriter animation (cleaned up)
  useEffect(() => {
    const phrases = [
      "Cari skill...",
      "Cari kemampuan komunikasi...",
      "Cari kreativitas...",
      "Cari teamwork...",
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
      typeTimeoutRef.current = setTimeout(type, state.deleting ? 40 : 80);
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

        const matchCategory = categoryFilter === "All" || (skill.category || "").toLowerCase() === categoryFilter.toLowerCase();

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
    setActiveSuggestion((m) => (matched.length > 0 ? 0 : -1));
  }, [search, skills]);

  // Persist recentSearch to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ss_recent_search", JSON.stringify(recentSearch));
    } catch {}
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
    <div className="relative flex flex-col sm:flex-row items-center w-full max-w-5xl gap-6 mb-12">
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
        <input
          ref={searchRef}
          type="text"
          placeholder={placeholderText || "Cari skill..."}
          className="absolute top-0 left-0 w-full bg-transparent border border-white/10 rounded-2xl pl-12 pr-10 py-3 text-sm text-white focus:border-cyan-400 outline-none z-10 transition-all"
          style={{ caretColor: "#22d3ee" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          aria-label="Cari skill"
        />

        {/* Clear Button */}
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setSuggestions([]);
              setGhostText("");
            }}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
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
              className="absolute z-20 w-full mt-2 bg-gray-900/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-md overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <motion.li
                  key={s.id || `${s.name}-${i}`}
                  layout
                  onClick={() => handleSelectSuggestion(s.name)}
                  onMouseEnter={() => setActiveSuggestion(i)}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-all ${
                    activeSuggestion === i ? "bg-cyan-600/40 text-white" : "hover:bg-cyan-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {s.priority ? (
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: highlightText(s.name, search) }} />
                  </div>

                  {activeSuggestion === i && <ArrowRight className="w-4 h-4 text-cyan-300" />}
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
  );
}
