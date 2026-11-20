import React, { useMemo } from "react";

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
        <div className="flex justify-between text-xs sm:text-sm text-gray-300 mb-1.5">
          <span>Kemahiran</span>
          <span className="font-bold">{level}%</span>
        </div>
      )}
      <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, level))}%` }}
        />
      </div>
    </div>
  );
};

export const ProgressBar = React.memo(ProgressBarComponent);
ProgressBarComponent.displayName = "ProgressBar";
