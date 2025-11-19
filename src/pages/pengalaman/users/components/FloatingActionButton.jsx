import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FloatingActionButton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1 }}
    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50"
  >
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group active:scale-95"
      aria-label="Scroll to top"
    >
      <Sparkles size={20} className="sm:w-6 sm:h-6 group-hover:rotate-180 transition-transform duration-500" />
    </motion.button>
  </motion.div>
);

export default FloatingActionButton;