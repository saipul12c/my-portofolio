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
      className="flex overflow-x-auto gap-1.5 sm:gap-2 mb-6 sm:mb-8 pb-2 scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0"
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
          }`}
        >
          <tab.icon size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">{tab.label}</span>
          <span className="xs:hidden text-xs">{tab.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default NavigationTabs;