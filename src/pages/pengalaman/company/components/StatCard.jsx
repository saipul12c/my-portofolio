import { motion } from "framer-motion";
import { cardVariants } from "../animations/variants";

const colorStyles = {
  blue: {
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  },
  green: {
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  yellow: {
    border: "border-amber-500/20 hover:border-amber-500/50",
    text: "text-amber-400",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  purple: {
    border: "border-purple-500/20 hover:border-purple-500/50",
    text: "text-purple-400",
    iconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  orange: {
    border: "border-orange-500/20 hover:border-orange-500/50",
    text: "text-orange-400",
    iconBg: "bg-orange-500/20 text-orange-400 border-orange-500/30"
  }
};

const StatCard = ({ icon: Icon, value, label, color = "blue", trend }) => {
  const theme = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`bg-white/5 backdrop-blur-xl border ${theme.border} rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-lg relative overflow-hidden group`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${theme.iconBg} border flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xl sm:text-2xl font-bold ${theme.text} drop-shadow-sm truncate`}>
            {value}
          </div>
          <div className="text-xs text-gray-400 truncate">{label}</div>
          {trend && (
            <div className={`text-xs mt-0.5 font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;