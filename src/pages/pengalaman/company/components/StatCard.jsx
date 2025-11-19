import { motion } from "framer-motion";
import { cardVariants } from "../animations/variants";

const StatCard = ({ icon: Icon, value, label, color = "blue", trend }) => {
  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400"
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color.split('-')[0]}-500/20`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-gray-400">{label}</div>
          {trend && (
            <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;