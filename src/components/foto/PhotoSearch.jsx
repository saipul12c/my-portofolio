import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function PhotoSearch({ onSearch, allPhotos = [] }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Ambil daftar unik title + category dari semua foto
  const suggestions = allPhotos
    .flatMap((p) => [p.title, p.category])
    .filter((item, index, self) => item && self.indexOf(item) === index)
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6); // batasi maksimal 6 saran

  // 🧠 Saat user mengetik
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    onSearch(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ⬅️ Auto-scroll ke atas
  };

  // 🖱️ Saat user klik suggestion
  const handleSelect = (value) => {
    setQuery(value);
    setShowSuggestions(false);
    onSearch(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ⬅️ Auto-scroll juga
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    onSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" }); // ⬅️ dan reset ke atas
  };

  return (
    <motion.div
      className="relative w-full max-w-md mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Input */}
      <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Cari foto berdasarkan judul atau kategori..."
        value={query}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // biar bisa klik suggestion
        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition-all"
      />

      {/* Tombol clear */}
      {query && (
        <motion.button
          onClick={clearSearch}
          whileHover={{ scale: 1.1 }}
          className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
        >
          <X size={16} />
        </motion.button>
      )}

      {/* Dropdown suggestion */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            className="absolute mt-2 w-full bg-[#0f172a]/95 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {suggestions.map((item, i) => (
              <motion.li
                key={i}
                onClick={() => handleSelect(item)}
                whileHover={{
                  backgroundColor: 'rgba(34,211,238,0.15)',
                  x: 4,
                  transition: { duration: 0.2 },
                }}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white cursor-pointer flex items-center gap-2"
              >
                <Search size={14} className="text-cyan-400" /> {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
