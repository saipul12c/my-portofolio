import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

export default function GalleryFilter({ onFilter, allTags = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const uniqueTags = useMemo(() => {
    const tags = new Set(allTags);
    return Array.from(tags).sort();
  }, [allTags]);

  const handleToggleTag = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilter?.({ searchTerm, tags: newTags });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onFilter?.({ searchTerm: term, tags: selectedTags });
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedTags([]);
    onFilter?.({ searchTerm: "", tags: [] });
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari gallery..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 transition"
          />
          {(searchTerm || selectedTags.length > 0) && (
            <button
              onClick={handleClear}
              className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 text-red-300 px-3 py-2 rounded-lg transition flex items-center gap-1"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>

        {/* Tags Filter */}
        {uniqueTags.length > 0 && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition text-sm mb-2"
            >
              <Filter size={16} /> Filter by Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-2"
              >
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedTags.includes(tag)
                        ? "bg-cyan-500/30 border border-cyan-400 text-cyan-200"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
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
