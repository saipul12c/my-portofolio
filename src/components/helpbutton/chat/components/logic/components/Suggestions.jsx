import { motion, AnimatePresence } from "framer-motion";

export function Suggestions({ suggestions = [], setInput, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  const handleClick = (suggestion) => {
    if (onSelect) onSelect(suggestion);
    else if (setInput) setInput(suggestion);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <div className="text-xs text-gray-500 text-center" role="heading" aria-level="3">
          💡 Coba tanyakan:
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion || index}
              type="button"
              onClick={() => handleClick(suggestion)}
              className="saipul-suggestion-btn text-xs px-3 py-2 rounded-md transition-all duration-200 border border-gray-300 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[45%] truncate"
              title={suggestion}
              aria-label={`Pilih saran: ${suggestion}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}