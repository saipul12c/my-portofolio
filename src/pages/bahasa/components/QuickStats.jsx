import React, { useMemo, memo } from "react";

const QuickStatsComponent = ({ bahasaSehariHari, bahasaPemrograman }) => {
  const stats = useMemo(() => {
    const allBahasa = [...bahasaSehariHari, ...bahasaPemrograman];
    const totalLevel = allBahasa.reduce((acc, b) => acc + b.level, 0);
    const avg = allBahasa.length > 0 ? Math.round(totalLevel / allBahasa.length) : 0;
    
    return [
      { 
        label: "Total Bahasa", 
        value: allBahasa.length,
        icon: "🌐",
        color: "from-cyan-400 to-blue-500"
      },
      { 
        label: "Kemahiran Rata-rata", 
        value: `${avg}%`,
        icon: "📊",
        color: "from-green-400 to-cyan-500"
      },
      { 
        label: "Teknologi", 
        value: bahasaPemrograman.length,
        icon: "💻",
        color: "from-purple-400 to-pink-500"
      },
      { 
        label: "Bahasa Komunikasi", 
        value: bahasaSehariHari.length,
        icon: "🗣️",
        color: "from-orange-400 to-red-500"
      }
    ];
  }, [bahasaSehariHari, bahasaPemrograman]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cyan-500/20 text-center hover:border-cyan-500/40 hover:-translate-y-0.5 transition-transform duration-200"
        >
          <div className="text-xl sm:text-2xl mb-1">{stat.icon}</div>
          <div className={`text-base sm:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}
          </div>
          <div className="text-gray-400 text-[11px] sm:text-xs mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export const QuickStats = memo(QuickStatsComponent);
QuickStatsComponent.displayName = "QuickStats";
