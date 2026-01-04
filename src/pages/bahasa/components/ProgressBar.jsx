import React, { useMemo } from "react";
import { motion } from "framer-motion";

const ProgressBarComponent = ({ level, showLabel = true }) => {
  const colorClass = useMemo(() => {
    if (level >= 90) return "from-emerald-500 to-green-500";
    if (level >= 80) return "from-cyan-500 to-blue-500";
    if (level >= 70) return "from-amber-500 to-orange-500";
    if (level >= 60) return "from-orange-500 to-red-500";
    return "from-gray-500 to-gray-700";
  }, [level]);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Kemahiran</span>
          <span className="font-bold">{level}%</span>
        </div>
      )}
      <div className="w-full bg-gray-700/30 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
        <motion.div 
          className={`h-2.5 rounded-full bg-gradient-to-r ${colorClass} shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          style={{ willChange: "width" }}
        />
      </div>
    </div>
  );
};

export const ProgressBar = React.memo(ProgressBarComponent);
ProgressBar.displayName = "ProgressBar";