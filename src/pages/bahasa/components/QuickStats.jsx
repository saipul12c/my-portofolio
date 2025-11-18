import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const QuickStats = React.memo(({ bahasaSehariHari, bahasaPemrograman }) => {
  // Memoize stats calculation untuk menghindari recalculation
  const stats = useMemo(() => {
    const allBahasa = [...bahasaSehariHari, ...bahasaPemrograman];
    const totalLevel = allBahasa.reduce((acc, b) => acc + b.level, 0);
    
    return [
      { 
        label: "Total Bahasa", 
        value: bahasaSehariHari.length + bahasaPemrograman.length,
        icon: "🌐",
        color: "from-cyan-400 to-blue-500"
      },
      { 
        label: "Kemahiran Rata-rata", 
        value: `${Math.round(totalLevel / allBahasa.length)}%`,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cyan-500/20 text-center"
        >
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
          <div className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}
          </div>
          <div className="text-cyan-300 text-xs sm:text-sm mt-0.5 sm:mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
});