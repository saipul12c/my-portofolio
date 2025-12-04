import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, X, Bookmark, Star } from "lucide-react";

// LocalStorage keys
const HISTORY_KEY = "gallery_search_history_v1";
const BOOKMARK_KEY = "gallery_bookmarks_v1";

function readHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(arr) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, 30)));
  } catch {}
}

function readBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeBookmarks(arr) {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(arr));
  } catch {}
}

export default function GalleryFilter({ onFilter, allTags = [], allMedia = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState(() => readHistory());
  const [bookmarks, setBookmarks] = useState(() => readBookmarks());
  const debounced = useRef(null);
  const navigate = useNavigate();

  const uniqueTags = useMemo(() => {
    const tags = new Set(allTags);
    return Array.from(tags).sort();
  }, [allTags]);

  // Save search into history (most recent first)
  const saveHistoryTerm = (term) => {
    if (!term || !term.trim()) return;
    const list = [term, ...history.filter((h) => h !== term)];
    setHistory(list.slice(0, 30));
    writeHistory(list);
  };

  const toggleBookmark = (item) => {
    // Normalize item and create a stable key so bookmarks without URLs
    // (history / tag suggestions) are stored and toggled safely.
    const normalizedUrl = item.url || "";
    const key = normalizedUrl ? `url:${normalizedUrl}` : `title:${item.title}`;

    // Backwards-compatible existence check (support old entries without `key`)
    const exists = bookmarks.find((b) => b.key === key || b.url === item.url || b.title === item.title);
    let next;
    if (exists) {
      next = bookmarks.filter((b) => !(b.key === key || b.url === item.url || b.title === item.title));
    } else {
      const newEntry = { title: item.title, url: normalizedUrl, key };
      next = [newEntry, ...bookmarks].slice(0, 40);
    }
    setBookmarks(next);
    writeBookmarks(next);
  };

  // Build suggestions based on input
  useEffect(() => {
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => {
      const term = (searchTerm || "").toLowerCase().trim();
      const results = [];

      if (term) {
        // Note: external quick-search actions (Google / DuckDuckGo) removed
        // Tags suggestions
        uniqueTags
          .filter((t) => t.toLowerCase().includes(term))
          .slice(0, 8)
          .forEach((t) => results.push({ type: "tag", id: `tag-${t}`, title: t }));

        // Internal media suggestions (titles/categories/tags)
        allMedia
          .filter((m) => {
            return (
              m.title?.toLowerCase().includes(term) ||
              m.desc?.toLowerCase().includes(term) ||
              m.category?.toLowerCase().includes(term) ||
              (m.tags || []).some((tg) => tg.toLowerCase().includes(term))
            );
          })
          .slice(0, 12)
          .forEach((m) =>
            results.push({
              type: "internal",
              id: m.id,
              title: m.title || m.desc || `${m.type} ${m.id}`,
              mediaType: m.type,
              url: `/kenangan/${m.type}/${m.id}`,
            })
          );

        // Bookmarks
        bookmarks
          .filter((b) => b.title.toLowerCase().includes(term) || (b.url || "").toLowerCase().includes(term))
          .slice(0, 8)
          .forEach((b, i) => results.push({ type: "bookmark", id: `bm-${i}`, title: b.title, url: b.url }));

        // History
        history
          .filter((h) => h.toLowerCase().includes(term))
          .slice(0, 8)
          .forEach((h, i) => results.push({ type: "history", id: `hist-${i}`, title: h }));
      } else {
        // If empty, show recent history and bookmarks only when input focused
        if (isFocused) {
          history.slice(0, 8).forEach((h, i) => results.push({ type: "history", id: `hist-${i}`, title: h }));
          bookmarks.slice(0, 8).forEach((b, i) => results.push({ type: "bookmark", id: `bm-${i}`, title: b.title, url: b.url }));
        }
      }

      setSuggestions(results);
      setActiveIndex(-1);
    }, 120);

    return () => {
      if (debounced.current) clearTimeout(debounced.current);
    };
  }, [searchTerm, allMedia, uniqueTags, history, bookmarks, isFocused]);

  // Handlers
  const applyFilter = (term = searchTerm, tags = selectedTags) => {
    onFilter?.({ searchTerm: term, tags });
  };

  const handleToggleTag = (tag) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    setSelectedTags(newTags);
    applyFilter(searchTerm, newTags);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedTags([]);
    applyFilter("", []);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // live filter but debounced in parent components; still call for responsiveness
    applyFilter(term, selectedTags);
  };

  const handleSelectSuggestion = (sugg) => {
    if (!sugg) return;
    if (sugg.type === "tag") {
      handleToggleTag(sugg.title);
      setSearchTerm(sugg.title);
      saveHistoryTerm(sugg.title);
      return;
    }
    if (sugg.type === "history") {
      setSearchTerm(sugg.title);
      applyFilter(sugg.title, selectedTags);
      saveHistoryTerm(sugg.title);
      return;
    }
    if ((sugg.type === "bookmark" || sugg.type === "internal") && sugg.url) {
      // If internal route (starts with /), navigate within the app
      if (sugg.url.startsWith("/")) {
        navigate(sugg.url);
      } else {
        // External bookmark: open in new tab
        window.open(sugg.url, "_blank");
      }
      saveHistoryTerm(sugg.title);
      return;
    }

    // Fallback: set search term and filter
    setSearchTerm(sugg.title || "");
    applyFilter(sugg.title || "", selectedTags);
    saveHistoryTerm(sugg.title || "");
  };

  // Keyboard support
  const inputRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        // plain enter = search
        applyFilter(searchTerm, selectedTags);
        saveHistoryTerm(searchTerm);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  // Keep local bookmarks updated with storage changes (if any)
  useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key === BOOKMARK_KEY) setBookmarks(readBookmarks());
      if (ev.key === HISTORY_KEY) setHistory(readHistory());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <motion.div className="w-full max-w-7xl mx-auto mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm relative">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari gallery... (ketik untuk saran) — contoh: animals, travel, tiktok"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 120)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 transition"
            aria-autocomplete="list"
            aria-expanded={isFocused && suggestions.length > 0}
          />
          {(searchTerm || selectedTags.length > 0) && (
            <button onClick={handleClear} className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 text-red-300 px-3 py-2 rounded-lg transition flex items-center gap-1">
              <X size={16} /> Clear
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (isFocused || searchTerm) && (
          <div className="relative z-30 mt-2 bg-[#0b1220] border border-white/6 rounded-xl p-2 shadow-lg max-h-72 overflow-auto">
            {suggestions.map((s, idx) => (
              <div
                key={s.id + idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
                onMouseDown={(e) => e.preventDefault()} /* prevent input blur before click */
                onClick={() => handleSelectSuggestion(s)}
                className={`flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer transition ${
                  idx === activeIndex ? "bg-white/5" : "hover:bg-white/2"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-sm text-gray-200 font-medium">{s.title}</div>
                  <div className="text-xs text-gray-400">{s.type}</div>
                </div>

                <div className="flex items-center gap-2">
                  {s.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (s.url.startsWith("/")) {
                          navigate(s.url);
                        } else {
                          window.open(s.url, "_blank");
                        }
                      }}
                      title="Open"
                      className="text-cyan-300 hover:text-cyan-200"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(s);
                    }}
                    title="Toggle Bookmark"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tags Filter */}
        {uniqueTags.length > 0 && (
          <div className="mt-4">
            <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition text-sm mb-2">
              <Filter size={16} /> Filter by Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
            </button>

            {isExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 mt-2">
                {uniqueTags.map((tag) => (
                  <button key={tag} onClick={() => handleToggleTag(tag)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${selectedTags.includes(tag) ? "bg-cyan-500/30 border border-cyan-400 text-cyan-200" : "bg-white/5 border border-white/10 text-gray-300 hover:border-white/30"}`}>
                    {tag}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
