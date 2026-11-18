import { motion } from "framer-motion";
import { BarChart3, Heart, Rocket, Code, TrendingUp } from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "testimonials", label: "Testimoni", icon: Heart },
    { id: "projects", label: "Proyek", icon: Rocket },
    { id: "technologies", label: "Tech", icon: Code },
    { id: "performance", label: "Performa", icon: TrendingUp }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide border-b border-white/10"
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
              isActive
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
            }`}
          >
            <IconComponent size={16} className={isActive ? "text-white" : "text-cyan-400"} />
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default NavigationTabs;