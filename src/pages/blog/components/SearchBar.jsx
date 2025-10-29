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

      // 💡 Tambahan: dukung sub_bab, sub_materi, dan poin (termasuk isi teks)
      if (post.sub_bab) {
        post.sub_bab.forEach((bab) => {
          texts.push({ text: bab.judul, type: "Sub Bab", icon: "📖" });

          if (bab.isi) {
            texts.push({ text: bab.isi, type: "Isi Sub Bab", icon: "🪶" });
          }

          if (bab.sub_materi) {
            bab.sub_materi.forEach((materi) => {
              texts.push({ text: materi.judul, type: "Sub Materi", icon: "📚" });

              if (materi.isi) {
                texts.push({ text: materi.isi, type: "Isi Sub Materi", icon: "🧾" });
              }

              if (materi.poin) {
                materi.poin.forEach((p, i) =>
                  texts.push({
                    text: typeof p === "string" ? p : p.teks || `Poin ${i + 1}`,
                    type: "Poin",
                    icon: "•",
                  })
                );
              }
            });
          }

          if (bab.poin) {
            bab.poin.forEach((p, i) =>
              texts.push({
                text: typeof p === "string" ? p : p.teks || `Poin ${i + 1}`,
                type: "Poin",
                icon: "•",
              })
            );
          }
        });
      }

      // 💬 Tambahan: jika blog punya "content" utama
      if (post.content && typeof post.content === "string") {
        texts.push({ text: post.content, type: "Isi Artikel", icon: "📝" });
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
    }
  };

  // === 🖱️ Select suggestion ===
  const handleSelectSuggestion = (text) => {
    setSearchTerm(text);
    setCurrentPage(1);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    inputRef.current.blur();
    saveToHistory(text);
  };

  // === 🧩 Highlight matched substring ===
  const highlightMatch = (text) => {
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
    inputRef.current.focus();
  };

  const trending = useMemo(() => {
    const tags = blogs.flatMap((b) => b.tags || []);
    const categories = blogs.map((b) => b.category);
    const subbab = blogs.flatMap((b) =>
      (b.sub_bab || []).map((s) => s.judul)
    );
    const mix = [...new Set([...tags, ...categories, ...subbab])];
    return mix.filter(Boolean).sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [blogs]);

  return (
    <div className="max-w-xl mx-auto mb-14 relative">
      <div className="relative">
        <div className="absolute inset-0 px-5 py-3 text-gray-600 pointer-events-none select-none">
          <span className="invisible">{searchTerm}</span>
          <span className="text-gray-500">
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
          placeholder="Cari berdasarkan judul, isi, penulis, kategori, tag, atau poin..."
          className="w-full px-5 py-3 pr-12 rounded-2xl bg-gray-800/60 border border-white/10 
          text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-3.5 text-gray-400 hover:text-gray-100 transition"
          >
            ✕
          </button>
        )}

        <span className="absolute right-4 top-3.5 text-cyan-400 text-lg">🔍</span>
      </div>

      {/* Dropdown */}
      {showSuggestions && (
        <ul
          ref={listRef}
          className="absolute z-20 w-full mt-2 bg-gray-900/95 backdrop-blur-xl 
          rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in"
        >
          {searchTerm && suggestions.length > 0 && (
            <>
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => handleSelectSuggestion(s.text)}
                  className={`px-5 py-2 text-sm flex justify-between items-center cursor-pointer 
                  transition-colors ${
                    idx === highlightIndex
                      ? "bg-cyan-500/20 text-white"
                      : "hover:bg-cyan-500/10 text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <div>{highlightMatch(s.text)}</div>
                  </div>
                  <span className="text-xs text-gray-500 italic">{s.type}</span>
                </li>
              ))}
            </>
          )}

          {searchTerm && suggestions.length === 0 && (
            <li className="px-5 py-3 text-sm text-gray-400 italic">
              Tidak ada hasil untuk{" "}
              <span className="text-cyan-400 font-medium">"{searchTerm}"</span>
            </li>
          )}

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
    </div>
  );
}
