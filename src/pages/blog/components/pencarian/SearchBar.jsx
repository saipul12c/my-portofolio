import { useState, useMemo, useEffect, useRef } from "react";

export default function SearchBar({
  blogs,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
}) {
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
    if (!searchTerm) return [];
    const lower = searchTerm.toLowerCase();

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

    // Ambil semua teks dari semua blog
    const allSuggestions = blogs.flatMap(extractTexts);

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
    if (suggestions.length > 0 && searchTerm) {
      setPredictedTerm(suggestions[0].text);
    } else {
      setPredictedTerm("");
    }
  }, [searchTerm, suggestions]);

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
    const lower = searchTerm.toLowerCase();
    const index = text.toLowerCase().indexOf(lower);
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <span className="text-cyan-300 font-semibold">
          {text.slice(index, index + searchTerm.length)}
        </span>
        {text.slice(index + searchTerm.length)}
      </>
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const trending = useMemo(() => {
    const tags = blogs.flatMap((b) => b.tags || []);
    const categories = blogs.map((b) => b.category);
    const authors = blogs.map((b) => b.author);
    const mix = [...new Set([...tags, ...categories, ...authors])];
    return mix.filter(Boolean).sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [blogs]);

  return (
    <div className="w-full mb-6 relative">
      <div className="relative">
        {/* Predictive Text Overlay */}
        <div className="absolute inset-0 px-4 py-3 text-gray-600 pointer-events-none select-none overflow-hidden">
          <span className="invisible">{searchTerm}</span>
          <span className="text-gray-500">
            {predictedTerm.slice(searchTerm.length)}
          </span>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            setShowSuggestions(true);
            setHighlightIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Cari artikel..."
          className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800/80 border border-gray-600/50 
          text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200
          backdrop-blur-sm text-sm"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors duration-200 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={listRef}
          className="absolute w-full mt-1 bg-gray-900/95 backdrop-blur-xl 
          rounded-lg shadow-xl border border-gray-600/50 overflow-y-auto animate-fadeIn max-h-80"
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          {searchTerm && suggestions.length > 0 && (
            <>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => handleSelectSuggestion(s.text)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex justify-between items-center cursor-pointer 
                  transition-all duration-150 border-b border-gray-700/50 last:border-b-0 ${
                    idx === highlightIndex
                      ? "bg-cyan-500/20 text-white"
                      : "hover:bg-gray-700/50 text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm flex-shrink-0">{s.icon}</span>
                    <div className="truncate flex-1 text-left">
                      {highlightMatch(s.text)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2 px-2 py-0.5 bg-gray-800 rounded">
                    {s.type}
                  </span>
                </button>
              ))}
            </>
          )}

          {searchTerm && suggestions.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400 text-center border-b border-gray-700/50">
              Tidak ada hasil untuk{" "}
              <span className="text-cyan-400 font-medium">"{searchTerm}"</span>
            </div>
          )}

          {/* Search History */}
          {!searchTerm && searchHistory.length > 0 && (
            <div className="border-b border-gray-700/50">
              <div className="px-4 py-2 text-xs text-gray-500 font-medium bg-gray-800/50">
                🔄 Riwayat Pencarian
              </div>
              {searchHistory.map((item, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 
                  cursor-pointer transition-all duration-150 flex items-center gap-3 border-b border-gray-700/30 last:border-b-0"
                >
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Suggestions */}
          {!searchTerm && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 font-medium bg-gray-800/50">
                🔥 Pencarian Populer
              </div>
              {trending.map((t, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSelectSuggestion(t)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 
                  cursor-pointer transition-all duration-150 flex items-center gap-3 border-b border-gray-700/30 last:border-b-0"
                >
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                  <span className="truncate">{t}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Tips */}
          <div className="px-4 py-2 bg-gray-800/70 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 text-center">
              💡 Gunakan <kbd className="px-1.5 py-0.5 mx-1 bg-gray-700 rounded text-xs">↑↓</kbd> untuk navigasi, 
              <kbd className="px-1.5 py-0.5 mx-1 bg-gray-700 rounded text-xs">Enter</kbd> untuk memilih
            </div>
          </div>
        </div>
      )}
    </div>
  );
}