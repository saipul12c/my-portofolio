import { useState, useMemo, useEffect, useRef } from "react";
import { Bot, History, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({
  blogs,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  onAiClick // New prop if we want to trigger something specific
}) {
  const [localSearchValue, setLocalSearchValue] = useState(searchTerm);
  const [predictedTerm, setPredictedTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // === 📜 Load search history ===
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(stored);
  }, []);

  // Sync with parent searchTerm (e.g. from URL or AI result)
  useEffect(() => {
    if (searchTerm !== localSearchValue) {
      setLocalSearchValue(searchTerm);
    }
  }, [searchTerm]);

  // Debounce external search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchValue !== searchTerm) {
        setSearchTerm(localSearchValue);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearchValue]);

  // === 💾 Save search term ===
  const saveToHistory = (term) => {
    if (!term.trim()) return;
    const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const updated = [term, ...stored.filter((t) => t !== term)].slice(0, 8);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);
  };

  // === 🧠 Autocomplete & Smart Suggestions ===
  const suggestions = useMemo(() => {
    if (!localSearchValue || localSearchValue.length < 1) return [];
    const lower = localSearchValue.toLowerCase();

    // Optimization: Only scan a subset of blogs if there are too many for suggestions
    const blogSubset = blogs.length > 50 ? blogs.slice(0, 50) : blogs;

    // 🔍 Ambil semua teks dari setiap post (judul, kategori, isi, dll)
    const extractTexts = (post) => {
      const texts = [
        { text: post.title, type: "Judul", icon: "📰" },
        { text: post.author, type: "Penulis", icon: "✍️" },
        { text: post.category, type: "Kategori", icon: "🏷️" },
        { text: post.excerpt, type: "Kutipan", icon: "📄" },
        { text: post.series, type: "Seri", icon: "📚" },
        { text: post.source, type: "Sumber", icon: "📖" },
        ...(post.tags || []).map((tag) => ({
          text: tag,
          type: "Tag",
          icon: "🔖",
        })),
        ...(post.labels || []).map((label) => ({
          text: label,
          type: "Label",
          icon: "⭐",
        })),
        {
          text: post.language === "id" ? "Bahasa Indonesia" : "English",
          type: "Bahasa",
          icon: "🌐",
        },
      ];

      // 💬 Tambahan: jika blog punya "content" utama
      if (post.content && typeof post.content === "string") {
        // Ambil potongan konten yang relevan
        const contentSnippets = post.content
          .split('\n')
          .filter(line => line.trim().length > 20)
          .slice(0, 3)
          .map(line => ({
            text: line.length > 60 ? line.substring(0, 60) + '...' : line,
            type: "Konten",
            icon: "📝",
          }));
        
        texts.push(...contentSnippets);
      }

      return texts;
    };

    // Ambil semua teks dari subset blog
    const allSuggestions = blogSubset.flatMap(extractTexts);

    // Buat unik (hindari duplikasi)
    const unique = [
      ...new Map(
        allSuggestions.map((item) => [item.text?.toLowerCase(), item])
      ).values(),
    ];

    // Filter berdasarkan input
    return unique
      .filter((s) => s.text && s.text.toLowerCase().includes(lower))
      .sort((a, b) => {
        const aStarts = a.text.toLowerCase().startsWith(lower);
        const bStarts = b.text.toLowerCase().startsWith(lower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.text.localeCompare(b.text);
      })
      .slice(0, 8);
  }, [searchTerm, blogs]);

  // === ✨ Predictive typing ===
  useEffect(() => {
    if (suggestions.length > 0 && localSearchValue) {
      setPredictedTerm(suggestions[0].text);
    } else {
      setPredictedTerm("");
    }
  }, [localSearchValue, suggestions]);

  // === ⌨️ Keyboard navigation ===
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        const selected = suggestions[highlightIndex].text;
        handleSelectSuggestion(selected);
      } else if (predictedTerm) {
        handleSelectSuggestion(predictedTerm);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  // === 🖱️ Select suggestion ===
  const handleSelectSuggestion = (text) => {
    setLocalSearchValue(text);
    setSearchTerm(text);
    setCurrentPage(1);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    inputRef.current?.blur();
    saveToHistory(text);
  };

  // === 🧩 Highlight matched substring ===
  const highlightMatch = (text) => {
    if (!text) return "";
    const lower = localSearchValue.toLowerCase();
    const index = text.toLowerCase().indexOf(lower);
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <span className="text-cyan-300 font-semibold">
          {text.slice(index, index + localSearchValue.length)}
        </span>
        {text.slice(index + localSearchValue.length)}
      </>
    );
  };

  const clearSearch = () => {
    setLocalSearchValue("");
    setSearchTerm("");
    setShowSuggestions(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const trending = useMemo(() => {
    const tags = blogs.flatMap((b) => b.tags || []);
    const categories = blogs.map((b) => b.category);
    const mix = [...new Set([...tags, ...categories])].filter(Boolean);
    return mix.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [blogs]);

  const handleAiAsk = () => {
    if (localSearchValue) {
      // Trigger AI search
      saveToHistory(localSearchValue);
      setSearchTerm(localSearchValue);
      setCurrentPage(1);
      // Trigger AI visibility
      if (typeof onAiClick === "function") onAiClick();
    } else {
      // Maybe focus input?
      inputRef.current?.focus();
    }
  };

  const suggestionPills = [
    { text: "Teknologi digital terbaru?", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
    { text: "Cara meningkatkan kreativitas?", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { text: "Seni dan teknologi?", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  ];

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {/* --- Row 1: Search Input & AI Bot Button --- */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 group">
          {/* Predictive Text Overlay */}
          <div className="absolute inset-0 px-4 py-3 text-gray-600 pointer-events-none select-none overflow-hidden flex items-center">
            <span className="invisible text-sm">{localSearchValue}</span>
            <span className="text-gray-500 text-sm">
              {predictedTerm.slice(localSearchValue.length)}
            </span>
          </div>

          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={localSearchValue}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => {
              setLocalSearchValue(e.target.value);
              setCurrentPage(1);
              setShowSuggestions(true);
              setHighlightIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan atau cari artikel..."
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-900/40 border border-gray-700/50 
            text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
            focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300
            backdrop-blur-md text-sm shadow-inner"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {localSearchValue && (
              <motion.button
                key="clear-search-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Suggestions Dropdown - Aligned to input width */}
          {showSuggestions && (
            <div
              ref={listRef}
              className="absolute w-full mt-2 bg-gray-900/95 backdrop-blur-xl 
              rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-700/50 
              overflow-hidden animate-fadeIn max-h-[400px] z-[100]"
              style={{ top: '100%' }}
            >
              <div className="overflow-y-auto max-h-[400px] no-scrollbar">
                {localSearchValue && suggestions.length > 0 && (
                  <div className="p-1">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onMouseDown={() => handleSelectSuggestion(s.text)}
                        className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center cursor-pointer 
                        transition-all duration-150 rounded-lg mb-0.5 last:mb-0 ${
                          idx === highlightIndex
                            ? "bg-cyan-500/20 text-white"
                            : "hover:bg-gray-800/50 text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{s.icon}</span>
                          <div className="truncate flex-1 text-left">
                            {highlightMatch(s.text)}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2 px-1.5 py-0.5 bg-gray-800/80 rounded border border-gray-700/50">
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {localSearchValue && suggestions.length === 0 && (
                  <div className="px-6 py-8 text-sm text-gray-500 text-center">
                    <div className="text-2xl mb-2 opacity-20">🔍</div>
                    Tidak ada hasil untuk <span className="text-cyan-400">"{localSearchValue}"</span>
                  </div>
                )}

                {/* Search History */}
                {!localSearchValue && searchHistory.length > 0 && (
                  <div className="border-b border-gray-800/50 last:border-0">
                    <div className="px-4 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-800/30">
                      🔄 Riwayat Pencarian
                    </div>
                    <div className="p-1">
                      {searchHistory.map((item, i) => (
                        <button
                          key={i}
                          onMouseDown={() => handleSelectSuggestion(item)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 
                          rounded-lg transition-all duration-150 flex items-center gap-3 mb-0.5 last:mb-0"
                        >
                          <History className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Suggestions */}
                {!localSearchValue && (
                  <div className="last:border-0">
                    <div className="px-4 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-800/30">
                      🔥 Topik Populer
                    </div>
                    <div className="p-1">
                      {trending.map((t, i) => (
                        <button
                          key={i}
                          onMouseDown={() => handleSelectSuggestion(t)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/50 
                          rounded-lg transition-all duration-150 flex items-center gap-3 mb-0.5 last:mb-0"
                        >
                          <Sparkles className="w-4 h-4 text-orange-500/50 flex-shrink-0" />
                          <span className="truncate">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Tips */}
                <div className="px-4 py-3 bg-gray-950/30 border-t border-gray-800/50">
                  <div className="text-[10px] text-gray-600 text-center flex items-center justify-center gap-2">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">↑↓</kbd> Navigasi
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Enter</kbd> Pilih
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Tanya AI Button --- */}
        <button
          onClick={handleAiAsk}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900/60 border border-gray-700/50 
          hover:border-cyan-500/50 rounded-xl text-gray-300 hover:text-white transition-all 
          duration-300 group relative overflow-hidden backdrop-blur-md shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bot className="w-5 h-5 text-cyan-400 group-hover:animate-pulse" />
          <span className="text-sm font-medium">Tanya AI</span>
        </button>
      </div>

      {/* --- Row 2: Suggested Tags & History --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
          <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Saran:</span>
          <div className="flex gap-2">
            {suggestionPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggestion(pill.text)}
                className={`text-[11px] px-3 py-1.5 rounded-full border whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 ${pill.color}`}
              >
                {pill.text}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowSuggestions(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors py-1 group"
        >
          <History className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
          <span>Riwayat</span>
        </button>
      </div>

    </div>
  );
}