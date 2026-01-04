import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, MapPin, Heart } from "lucide-react";

export default function PhotoStats({ photos }) {
  const stats = {
    total: photos.length,
    categories: [...new Set(photos.map(p => p.category).filter(Boolean))].length,
    locations: [...new Set(photos.map(p => p.location).filter(Boolean))].length,
    featured: photos.filter(p => p.featured).length,
  };

  const statItems = [
    { icon: ImageIcon, label: "Total Foto", value: stats.total, color: "cyan" },
    { icon: Camera, label: "Kategori", value: stats.categories, color: "purple" },
    { icon: MapPin, label: "Lokasi", value: stats.locations, color: "blue" },
    { icon: Heart, label: "Featured", value: stats.featured, color: "pink" },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-400/30 text-cyan-300",
          purple: "from-purple-500/20 to-purple-600/10 border-purple-400/30 text-purple-300",
          blue: "from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-300",
          pink: "from-pink-500/20 to-pink-600/10 border-pink-400/30 text-pink-300",
        };

        return (
          <motion.div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} border backdrop-blur-sm p-4 text-center`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <motion.div
              className="text-2xl sm:text-3xl font-bold mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-xs text-gray-300 opacity-80">{stat.label}</div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
