import { motion } from "framer-motion";
import { slideUpVariants } from "../animations/variants";

const NavigationTabs = ({ activeTab, dispatch }) => {
  return (
    <motion.nav
      variants={slideUpVariants}
      className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide"
      aria-label="Company sections navigation"
    >
      {['Overview', 'Portfolio', 'Timeline', 'Team', 'Analytics', 'Testimoni'].map((tab) => (
        <button
          key={tab}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.toLowerCase() })}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
            activeTab === tab.toLowerCase()
              ? 'bg-emerald-500 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          {tab}
        </button>
      ))}
    </motion.nav>
  );
};

export default NavigationTabs;