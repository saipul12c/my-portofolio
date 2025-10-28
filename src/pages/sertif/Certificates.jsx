"use client";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { X, Search, Sparkles, ShieldCheck, Clock } from "lucide-react";
import data from "../../data/sertif/certificates.json";

const certificates = data.certificates;
const tagColors = data.tagColors;

// === Fuzzy Smart Search ===
const smartFilter = (certs, query, category) => {
  if (!query && category === "All") return certs;
  const q = query.toLowerCase().trim();

  const scoreItem = (cert) => {
    let score = 0;
    const boost = (field, weight = 1) => {
      const text = field.toLowerCase();
      if (text.startsWith(q)) score += 5 * weight;
      else if (text.includes(q)) score += 3 * weight;
      else if (q.split(" ").every((w) => text.includes(w))) score += 2 * weight;
    };

    boost(cert.title, 2);
    boost(cert.issuer);
    cert.tags.forEach((t) => boost(t));
    if (category !== "All" && cert.category !== category) score -= 5;

    return score;
  };

  return certs
    .map((c) => ({ ...c, score: scoreItem(c) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
};

// === Animasi ===
const cardAnim = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0 },
};

export default function Certificates() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionRef = useRef(null);

  const categories = useMemo(
    () => ["All", ...new Set(certificates.map((c) => c.category))],
    []
  );

  const closePopup = useCallback(() => setSelected(null), []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
  }, [selected]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closePopup();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closePopup]);

  // === Smart Filtering ===
  const filteredCertificates = useMemo(
    () => smartFilter(certificates, search, filterCategory),
    [search, filterCategory]
  );

  // === Suggestion Dropdown ===
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const all = certificates.flatMap((c) => [
      { type: "title", value: c.title },
      { type: "issuer", value: c.issuer },
      ...c.tags.map((t) => ({ type: "tag", value: t })),
    ]);
    const unique = Array.from(new Set(all.map((a) => a.value)));
    return unique
      .filter((v) => v.toLowerCase().includes(q))
      .slice(0, 6)
      .map((v) => ({ value: v }));
  }, [search]);

  // === Ghost Autocomplete ===
  const ghostText = useMemo(() => {
    if (!search.trim()) return "";
    const q = search.toLowerCase();
    const match = certificates
      .flatMap((c) => [c.title, c.issuer, ...c.tags])
      .find((v) => v.toLowerCase().startsWith(q));
    if (!match) return "";
    return match.slice(search.length);
  }, [search]);

  // === Keyboard navigation ===
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      setSearch(suggestions[activeIndex].value);
      setActiveIndex(-1);
    }
  };

  // === Highlight pencarian ===
  const highlightMatch = (text, query) => {
    if (!text) return "";
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      "<mark class='bg-cyan-400/30 text-cyan-200'>$1</mark>"
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen bg-[#0a0f1a] text-white py-24 px-6 flex flex-col items-center select-none">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-lg">
            Sertifikat & Penghargaan
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            Koleksi profesional kredibel dan dapat diverifikasi langsung.
          </p>
        </m.div>

        {/* Search + Filter */}
        <div className="relative w-full max-w-3xl mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-300" size={18} />

              {/* Ghost Text */}
              <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
                <span className="text-gray-500/40 select-none">
                  {search}
                  <span className="text-gray-500/20">{ghostText}</span>
                </span>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Cari sertifikat, penerbit, atau tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/10 border border-white/20 px-10 py-3 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition relative z-10 text-transparent caret-cyan-400"
                style={{ textShadow: "0 0 0 #fff" }}
              />

              {/* Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <m.ul
                    ref={suggestionRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-0 right-0 bg-[#101726]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden z-30"
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={`${s.value}-${i}`}
                        onClick={() => setSearch(s.value)}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                          i === activeIndex
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "hover:bg-white/10"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(s.value, search),
                        }}
                      />
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>
            </div>

            <select
              className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl cursor-pointer focus:ring-2 focus:ring-cyan-400 outline-none transition"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Sertifikat */}
        <AnimatePresence>
          {filteredCertificates.length > 0 ? (
            <m.div
              variants={cardAnim}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full"
            >
              {filteredCertificates.map((cert) => (
                <m.article
                  key={cert.id}
                  variants={cardAnim}
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderColor: cert.themeColor || "#22d3ee",
                    boxShadow: `0 0 20px -5px ${cert.themeColor || "#22d3ee"}40`,
                  }}
                  className="bg-white/5 border rounded-3xl shadow-lg overflow-hidden hover:shadow-cyan-500/20 backdrop-blur-xl transition"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-56 object-cover hover:brightness-110 transition cursor-pointer"
                    onClick={() => setSelected(cert)}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-cyan-300">
                      {cert.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {cert.issuer} · {cert.year}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
                      <Clock size={14} className="text-cyan-400" />
                      <span>{cert.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{cert.difficulty}</span>
                    </div>
                    {cert.verified && (
                      <div className="flex items-center text-emerald-400 text-xs mt-1">
                        <ShieldCheck size={14} className="mr-1" /> Tersertifikasi
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap mt-3">
                      {cert.tags.map((tag, i) => (
                        <span
                          key={`${tag}-${cert.id}-${i}`}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            tagColors[(i + cert.id) % tagColors.length]
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </m.article>
              ))}
            </m.div>
          ) : (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-20 flex flex-col items-center"
            >
              <Sparkles className="w-10 h-10 text-cyan-400 mb-2" />
              <p>Tidak ada hasil yang cocok 😢</p>
              <p className="text-sm text-gray-500">
                Coba ketik kata lain atau pilih kategori “All”.
              </p>
            </m.div>
          )}
        </AnimatePresence>

        {/* Modal Detail */}
        <AnimatePresence>
          {selected && (
            <m.div
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
            >
              <m.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  borderColor: selected.themeColor,
                  boxShadow: `0 0 40px -5px ${selected.themeColor}60`,
                }}
                className="bg-[#141c2c] border rounded-3xl overflow-hidden shadow-[0_0_40px_-5px_cyan] max-w-md w-full relative"
              >
                <button
                  onClick={closePopup}
                  className="absolute top-3 right-3 bg-black/40 rounded-full p-1 hover:bg-black/60 transition"
                >
                  <X size={22} />
                </button>

                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-80 object-cover"
                />

                <div className="p-6 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600/50 scrollbar-track-transparent">
                  <h2 className="text-2xl font-bold">{selected.title}</h2>
                  <p className="text-gray-400 text-sm mb-3">
                    {selected.issuer} · {selected.year}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
                    <Clock size={14} className="text-cyan-400" />
                    <span>{selected.duration}</span>
                    <span>•</span>
                    <span className="capitalize">{selected.difficulty}</span>
                    {selected.verified && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-gray-200 leading-relaxed">
                    {selected.description}
                  </p>

                  <div className="flex gap-2 flex-wrap mt-4">
                    {selected.tags.map((tag, i) => (
                      <span
                        key={`${tag}-${selected.id}-${i}`}
                        className={`px-3 py-1 text-xs rounded-full border border-white/10 ${
                          tagColors[(i + selected.id) % tagColors.length]
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={selected.urlCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-5 text-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-xl font-semibold transition"
                  >
                    Lihat Sertifikat
                  </a>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
