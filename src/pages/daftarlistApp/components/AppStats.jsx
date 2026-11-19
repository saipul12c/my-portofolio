import React from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, FolderGit2, Star, CheckCircle2 } from "lucide-react";

export default function AppStats({ apps }) {
  const totalApps = apps.length;
  const activeApps = apps.filter((a) => a.status === "Aktif").length;
  const toolsCount = apps.filter((a) => a.category === "tools").length;
  const avgRating = (
    apps.reduce((acc, curr) => acc + (curr.rating || 4.8), 0) / (apps.length || 1)
  ).toFixed(1);

  const stats = [
    {
      label: "Total Aplikasi",
      value: totalApps,
      icon: Layers,
      gradient: "from-blue-500/20 to-cyan-500/10",
      border: "border-cyan-500/30",
      textColor: "text-cyan-400",
      description: "Aplikasi, Tools & Proyek"
    },
    {
      label: "Tools Interaktif",
      value: toolsCount,
      icon: Sparkles,
      gradient: "from-purple-500/20 to-pink-500/10",
      border: "border-purple-500/30",
      textColor: "text-purple-400",
      description: "Zodiak, Qodam, Game, dll."
    },
    {
      label: "Status Siap Pakai",
      value: `${activeApps} Aktif`,
      icon: CheckCircle2,
      gradient: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      textColor: "text-emerald-400",
      description: "Dapat langsung dicoba online"
    },
    {
      label: "Kepuasan / Rating",
      value: `${avgRating} ★`,
      icon: Star,
      gradient: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
      textColor: "text-amber-400",
      description: "Rata-rata ulasan pengguna"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-8">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border ${stat.border} p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-black/20 group hover:border-cyan-400/50 transition-all duration-300`}
          >
            {/* Top decorative glow */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div>
              <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.textColor}`}>
                {stat.value}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1 line-clamp-1">
                {stat.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
