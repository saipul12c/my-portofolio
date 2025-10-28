import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import testimonialsData from "../../data/testimoni/testimonials.json";

export default function Testimoni() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  const itemsPerPage = 6;

  // Debounce searchQuery -> debouncedQuery (200ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, minRating, selectedTag]);

  // Click outside to close suggestions
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !suggestionRef.current?.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const tags = useMemo(() => {
    const t = new Set();
    testimonialsData.forEach((item) =>
      item.tags?.forEach((tag) => t.add(tag))
    );
    return ["all", ...t];
  }, []);

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 1) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} menit lalu`;
      }
      return `${diffHours} jam lalu`;
    }
    if (diffDays <= 7) {
      return `${Math.floor(diffDays)} hari lalu`;
    }
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const processedTestimonials = useMemo(() => {
    return testimonialsData
      .map((t) => ({
        ...t,
        text: t.text ?? "",
        name: t.name ?? "Anonymous",
        role: t.role ?? "",
        project: t.project ?? "",
        company: t.company ?? "",
        tags: t.tags ?? [],
        formattedDate: formatTanggal(t.date),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Simple similarity scoring for fuzzy-ish search (lightweight)
  const similarity = (a, b) => {
    if (!a || !b) return 0;
    const aa = a.toLowerCase();
    const bb = b.toLowerCase();
    const maxLen = Math.max(aa.length, bb.length);
    if (maxLen === 0) return 0;
    let same = 0;
    for (let i = 0; i < aa.length; i++) {
      if (bb.includes(aa[i])) same++;
    }
    return same / maxLen;
  };

  // SUGGESTIONS (based on debouncedQuery)
  const suggestions = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];

    return processedTestimonials
      .map((t) => {
        const fields = [
          t.name,
          t.role,
          t.project,
          t.company,
          ...(t.tags || []),
        ].map((f) => (f ? String(f).toLowerCase() : ""));

        const similarities = fields.map((f) => similarity(q, f));
        const maxSim = Math.max(...similarities);
        return { ...t, relevance: maxSim };
      })
      .filter((t) => t.relevance > 0.22) // threshold for "close enough"
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);
  }, [debouncedQuery, processedTestimonials]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter" && searchQuery.trim()) {
        // If no suggestions shown but Enter pressed, keep query as is
        setDebouncedQuery(searchQuery.trim());
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      let chosen;
      if (focusedIndex >= 0) {
        chosen = suggestions[focusedIndex];
      } else {
        chosen = suggestions[0];
      }
      if (chosen) {
        setSearchQuery(chosen.name);
        setDebouncedQuery(chosen.name);
        setShowSuggestions(false);
        setFocusedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Highlight helper: highlight all occurrences (case-insensitive)
  const highlightMatch = (text = "") => {
    const q = debouncedQuery || searchQuery;
    if (!q) return text;
    const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
    const regex = new RegExp(`(${safeQ})`, "gi");
    const parts = String(text).split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-cyan-400 font-semibold">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  // FILTERED results (searching name/role/project/company/tags)
  const filtered = useMemo(() => {
    const q = (debouncedQuery || "").toLowerCase();
    return processedTestimonials.filter((t) => {
      // If no query, match everything (then rating/tag filters still apply)
      const matchText =
        !q ||
        [
          t.name,
          t.role,
          t.project,
          t.company,
          ...(t.tags || []),
          t.text,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const ratingOK = t.rating >= minRating;
      const tagOK = selectedTag === "all" || t.tags?.includes(selectedTag);

      return matchText && ratingOK && tagOK;
    });
  }, [processedTestimonials, debouncedQuery, minRating, selectedTag]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const avgRating = useMemo(() => {
    const total = testimonialsData.reduce((acc, t) => acc + (t.rating || 0), 0);
    return (total / testimonialsData.length).toFixed(2);
  }, []);

  const Stars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return (
      <div className="flex justify-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={17} className="text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && (
          <Star size={17} className="text-yellow-400 fill-none stroke-yellow-400" />
        )}
      </div>
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  const Card = ({ t, index }) => (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05, y: -6 }}
      onClick={() => setSelected(t)}
      className="relative bg-white/8 border border-white/10 backdrop-blur-xl 
      rounded-3xl p-6 sm:p-8 shadow-lg cursor-pointer"
    >
      <Quote className="absolute top-6 right-8 text-cyan-400 w-5 h-5" />
      <div className="flex flex-col items-center text-center space-y-3">
        <img
          src={t.image}
          alt={t.name}
          className="w-20 h-20 rounded-full border-2 border-cyan-400 object-cover"
        />
        <h3 className="font-semibold text-white text-lg">{highlightMatch(t.name)}</h3>
        <p className="text-cyan-300 text-xs">{highlightMatch(t.role)}</p>
        <p className="text-gray-400 text-xs">{t.formattedDate}</p>
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
          {highlightMatch(t.text)}
        </p>
        <Stars rating={t.rating} />
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 sm:px-10 py-12 sm:py-24">
      {/* HEADER */}
      <motion.div
        className="text-center max-w-3xl space-y-4 sm:space-y-6 mb-8 sm:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Testimoni & Kolaborasi
        </h1>
        <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Setiap langkah adalah perjuangan, setiap karya adalah kontribusi.
          Dalam setiap kolaborasi, saya mengedepankan integritas, keberanian
          untuk berinovasi, serta kepemimpinan yang memberi dampak.
        </p>
        <div className="flex justify-center gap-2 mt-2 items-center">
          <Star size={18} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-semibold">
            Rata-rata: {avgRating} / 5
          </span>
        </div>
      </motion.div>

      {/* SEARCH + FILTER WRAPPER */}
      <div className="w-full max-w-4xl mx-auto
                      space-y-3 sm:space-y-6
                      mb-8 sm:mb-12">
        {/* SEARCH */}
        <div
          className="relative"
          ref={inputRef}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" />
          <input
            type="text"
            placeholder="Cari nama, peran, atau proyek..."
            value={searchQuery}
            onFocus={() => {
              setShowSuggestions(true);
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
              setFocusedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#1e293b]/85 border border-cyan-400/30 rounded-full py-3 pl-12 pr-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
          />

          {/* SUGGESTIONS */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                ref={suggestionRef}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-14 w-full bg-[#1e293b]/95 border border-cyan-400/20 rounded-xl shadow-xl overflow-hidden z-40 max-h-60 overflow-y-auto"
              >
                {suggestions.map((s, i) => (
                  <li
                    key={s.id}
                    onMouseEnter={() => setFocusedIndex(i)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                    onClick={() => {
                      setSearchQuery(s.name);
                      setDebouncedQuery(s.name);
                      setShowSuggestions(false);
                    }}
                    className={`px-4 py-3 cursor-pointer text-sm flex flex-col
                      ${i === focusedIndex ? "bg-cyan-500/30" : "hover:bg-white/10"}`}
                  >
                    <span className="font-medium">{highlightMatch(s.name)}</span>
                    <span className="text-cyan-300 text-xs">{highlightMatch(s.role)}</span>
                    {s.company && (
                      <span className="text-gray-400 text-[11px]">
                        {highlightMatch(s.company)}
                      </span>
                    )}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* FILTER (responsive spacing: compact on small screens, more breathing on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b]/85 border border-cyan-400/30 rounded-full">
            <Filter size={16} className="text-cyan-300" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-transparent text-gray-100 w-full outline-none cursor-pointer"
            >
              <option className="bg-[#0f172a]" value="0">Semua Rating</option>
              <option className="bg-[#0f172a]" value="4">Minimal 4 ⭐</option>
              <option className="bg-[#0f172a]" value="4.5">Minimal 4.5 ⭐</option>
              <option className="bg-[#0f172a]" value="5">Hanya 5 ⭐</option>
            </select>
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-[#1e293b]/85 border border-cyan-400/30 rounded-full px-4 py-2 text-gray-100 outline-none cursor-pointer focus:ring-2 focus:ring-cyan-400"
          >
            {tags.map((tag) => (
              <option key={tag} value={tag} className="bg-[#0f172a] text-white">
                {tag.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-0 max-w-6xl w-full"
      >
        {paginated.map((t, i) => (
          <Card key={t.id} index={i} t={t} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-gray-400 mt-6">Tidak ada hasil ditemukan...</p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 mt-8 sm:mt-12">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-3 bg-cyan-500/30 rounded-full disabled:opacity-20"
          >
            <ChevronLeft />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full border text-sm
                  ${currentPage === i + 1 ? "bg-cyan-500 border-cyan-400" : "border-white/20"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-3 bg-cyan-500/30 rounded-full disabled:opacity-20"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative bg-[#1e293b] p-6 sm:p-10 rounded-3xl border border-white/10 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-5 text-gray-400"
                onClick={() => setSelected(null)}
              >
                <X size={28} />
              </button>

              <div className="text-center space-y-2 mb-4">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-28 h-28 rounded-full border border-cyan-400 mx-auto object-cover"
                />
                <h3 className="text-2xl font-semibold">{highlightMatch(selected.name)}</h3>
                <p className="text-cyan-300">{highlightMatch(selected.role)}</p>
                <p className="text-gray-400 text-sm">{highlightMatch(selected.company)}</p>
                <p className="text-gray-400 text-sm">{selected.location}</p>
                <p className="text-gray-300 text-xs">{selected.formattedDate}</p>
                <Stars rating={selected.rating} />
              </div>

              <p className="italic text-gray-300 border-l-4 border-cyan-400/40 pl-4 mb-4">
                “{highlightMatch(selected.text)}”
              </p>

              {selected.highlight && (
                <p className="text-cyan-400 font-semibold text-center mb-6">
                  ✨ {selected.highlight}
                </p>
              )}

              {selected.link && (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-cyan-500 py-3 rounded-full hover:bg-cyan-600 font-medium"
                >
                  🔗 Kunjungi Proyek
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
