import { motion } from "framer-motion";
import { BarChart3, Rocket, Calendar, Users, TrendingUp, Heart } from "lucide-react";
import { slideUpVariants } from "../animations/variants";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Rocket },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "testimoni", label: "Testimoni", icon: Heart }
];

const NavigationTabs = ({ activeTab, dispatch }) => {
  return (
    <motion.nav
      variants={slideUpVariants}
      className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide border-b border-white/10"
      aria-label="Company sections navigation"
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
            }`}
          >
            <IconComponent size={16} className={isActive ? "text-white" : "text-cyan-400"} />
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
};

export default NavigationTabs;