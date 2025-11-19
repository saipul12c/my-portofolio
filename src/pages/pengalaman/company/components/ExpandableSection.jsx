import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { containerVariants } from "../animations/variants";

const ExpandableSection = ({ 
  title, 
  count, 
  icon: Icon, 
  color = "blue", 
  isExpanded, 
  onToggle, 
  children 
}) => {
  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-400",
    purple: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40 text-purple-400",
    green: "bg-green-500/10 border-green-500/20 hover:border-green-500/40 text-green-400",
    orange: "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40 text-orange-400"
  };

  return (
    <motion.div variants={containerVariants} className="mb-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${colorClasses[color]} rounded-xl transition-all duration-200`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span className="font-semibold text-white">{title} ({count})</span>
        </div>
        <ChevronRight
          size={20}
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </motion.button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpandableSection;