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

  // === 📜 Load history dari localStorage ===
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(stored);
  }, []);

  // === 💾 Simpan history ke localStorage ===
  const saveToHistory = (term) => {
    if (!term.trim()) return;
    const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const updated = [term, ...stored.filter((t) => t !== term)].slice(0, 8);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);
  };

  // === 🧠 Autocomplete + Smart Suggestions ===
  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const lower = searchTerm.toLowerCase();

    const allSuggestions = blogs.flatMap((post) => [
      { text: post.title, type: "Judul" },
      { text: post.author, type: "Penulis" },
      ...(post.labels || []).map((label) => ({ text: label, type: "Label" })),
    ]);

    const unique = [
      ...new Map(allSuggestions.map((item) => [item.text, item])).values(),
    ];

    // Sort berdasarkan relevansi (prioritaskan yang diawali dulu)
    return unique
      .filter((s) => s.text.toLowerCase().includes(lower))
      .sort((a, b) => {
        const aStarts = a.text.toLowerCase().startsWith(lower);
        const bStarts = b.text.toLowerCase().startsWith(lower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.text.localeCompare(b.text);
      })
      .slice(0, 8);
  }, [searchTerm, blogs]);

  // === ✨ Predicted Term (typeahead) ===
  useEffect(() => {
    if (suggestions.length > 0 && searchTerm) {
      setPredictedTerm(suggestions[0].text);
    } else {
      setPredictedTerm("");
    }
  }, [searchTerm, suggestions]);

  // === ⌨️ Keyboard Navigation ===
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
    }
  };

  // === 🖱️ Pilih saran ===
  const handleSelectSuggestion = (text) => {
    setSearchTerm(text);
    setCurrentPage(1);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    inputRef.current.blur();
    saveToHistory(text);
  };

  // === 🔍 Highlight bagian teks yang cocok ===
  const highlightMatch = (text) => {
    const lower = searchTerm.toLowerCase();
    const index = text.toLowerCase().indexOf(lower);
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <span className="text-cyan-300 font-medium">
          {text.slice(index, index + searchTerm.length)}
        </span>
        {text.slice(index + searchTerm.length)}
      </>
    );
  };

  // === ✨ Clear Search ===
  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setHighlightIndex(-1);
    inputRef.current.focus();
  };

  // === 🌟 Trending Search (opsional statis) ===
  const trending = ["React", "UX Design", "Pemrograman", "Web App", "JavaScript"];

  return (
    <div className="max-w-xl mx-auto mb-14 relative">
      <div className="relative">
        {/* Ghost Typeahead Prediction */}
        <div className="absolute inset-0 px-5 py-3 text-gray-500 pointer-events-none select-none">
          <span className="invisible">{searchTerm}</span>
          <span className="text-gray-400">
            {predictedTerm.slice(searchTerm.length)}
          </span>
        </div>

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
          placeholder="Cari artikel berdasarkan judul, penulis, atau label..."
          className="w-full px-5 py-3 pr-12 rounded-2xl bg-gray-800/60 border border-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 relative"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-3.5 text-gray-400 hover:text-gray-200 transition"
          >
            ✕
          </button>
        )}

        <span className="absolute right-4 top-3.5 text-cyan-400 text-lg">
          🔍
        </span>
      </div>

      {/* 🔮 Suggestion Dropdown */}
      {showSuggestions && (
        <ul
          ref={listRef}
          className="absolute z-20 w-full mt-2 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in"
        >
          {/* Jika sedang mengetik dan ada hasil */}
          {searchTerm && suggestions.length > 0 && (
            <>
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => handleSelectSuggestion(s.text)}
                  className={`px-5 py-2 text-sm flex justify-between items-center cursor-pointer transition-colors ${
                    idx === highlightIndex
                      ? "bg-cyan-500/20 text-white"
                      : "hover:bg-cyan-500/10 text-gray-200"
                  }`}
                >
                  <div>{highlightMatch(s.text)}</div>
                  <span className="text-xs text-gray-500 italic">{s.type}</span>
                </li>
              ))}
            </>
          )}

          {/* Jika tidak ada hasil */}
          {searchTerm && suggestions.length === 0 && (
            <li className="px-5 py-3 text-sm text-gray-400 italic">
              Tidak ada hasil untuk{" "}
              <span className="text-cyan-400 font-medium">"{searchTerm}"</span>
            </li>
          )}

          {/* Riwayat pencarian */}
          {!searchTerm && searchHistory.length > 0 && (
            <div className="border-t border-white/10">
              <div className="px-5 py-2 text-xs text-gray-500">
                🔄 Riwayat pencarian
              </div>
              {searchHistory.map((item, i) => (
                <li
                  key={i}
                  onMouseDown={() => handleSelectSuggestion(item)}
                  className="px-5 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}
            </div>
          )}

          {/* Trending search */}
          {!searchTerm && (
            <div className="border-t border-white/10">
              <div className="px-5 py-2 text-xs text-gray-500">
                🔥 Pencarian populer
              </div>
              {trending.map((t, i) => (
                <li
                  key={i}
                  onMouseDown={() => handleSelectSuggestion(t)}
                  className="px-5 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 cursor-pointer transition"
                >
                  {t}
                </li>
              ))}
            </div>
          )}
        </ul>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
