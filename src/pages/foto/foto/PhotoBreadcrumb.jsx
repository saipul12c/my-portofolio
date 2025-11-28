import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function PhotoBreadcrumb() {
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: "Home", route: "/", icon: Home },
    { label: "Photography", route: "/photography", active: true },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 pt-2 pb-4 text-xs sm:text-sm"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            className="flex items-center gap-1 sm:gap-2"
            whileHover={{ x: 2 }}
          >
            {item.active ? (
              <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
                {Icon && <Icon size={14} className="text-cyan-300 flex-shrink-0" />}
                <span className="text-cyan-300 font-medium">{item.label}</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate(item.route)}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-all"
                >
                  {Icon && <Icon size={14} className="flex-shrink-0" />}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight size={12} className="text-gray-600 flex-shrink-0" />
                )}
              </>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}