import { motion } from "framer-motion";
import { BarChart3, Eye, Heart, MessageCircle, Users } from "lucide-react";
import { useMemo } from "react";

export default function GalleryStats({ mediaList = [] }) {
  const stats = useMemo(() => {
    const total = mediaList.length;
    const totalViews = mediaList.reduce(
      (sum, item) => sum + (item.engagement?.views || 0),
      0
    );
    const totalLikes = mediaList.reduce(
      (sum, item) => sum + (item.engagement?.likes || 0),
      0
    );
    const totalComments = mediaList.reduce(
      (sum, item) => sum + (item.engagement?.comments || 0),
      0
    );

    const creators = new Set(
      mediaList.map((item) => item.creator?.username).filter(Boolean)
    ).size;

    return {
      total,
      totalViews,
      totalLikes,
      totalComments,
      creators,
      avgEngagement:
        total > 0 ? Math.round((totalViews + totalLikes) / total) : 0,
    };
  }, [mediaList]);

  const statCards = [
    {
      label: "Total Media",
      value: stats.total,
      icon: BarChart3,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "from-red-500 to-pink-500",
    },
    {
      label: "Komenter",
      value: stats.totalComments.toLocaleString(),
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Kreator",
      value: stats.creators,
      icon: Users,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <motion.section
      className="w-full max-w-7xl mx-auto mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-yellow-400" /> Statistik Gallery
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              whileHover={{ scale: 1.05, y: -3 }}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-px group`}
            >
              {/* Inner card */}
              <div className="relative bg-[#0f172a] rounded-[10px] p-4 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white/100 transition" />
                  <span className="text-xs text-white/40 font-medium">
                    {card.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {typeof card.value === "number" && card.value > 1000
                      ? (card.value / 1000).toFixed(1)
                      : card.value}
                  </span>
                  {typeof card.value === "number" && card.value > 1000 && (
                    <span className="text-xs text-white/60">K</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Description */}
      <motion.div
        className="text-center text-gray-400 text-sm mt-6 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>📊 Statistik diperbarui berdasarkan data hasil pencarian & filter</p>
        {stats.total > 0 && (
          <p className="text-xs text-gray-500">
            Total {stats.total} konten ditemukan • Rata-rata engagement {stats.avgEngagement.toLocaleString()} per konten
          </p>
        )}
      </motion.div>
    </motion.section>
  );
}
