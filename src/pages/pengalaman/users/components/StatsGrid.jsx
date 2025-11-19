import { motion } from "framer-motion";
import { Users, Star, TrendingUp, Rocket } from "lucide-react";
import { staggerVariants, cardVariants } from "../utils/animationVariants";

const StatsGrid = ({ userInfo }) => {
  const stats = [
    { 
      label: "Total Testimoni", 
      value: userInfo.totalTestimonials, 
      icon: Users, 
      gradient: "from-blue-500 to-cyan-500",
      description: "Proyek terselesaikan",
      accentColor: "blue"
    },
    { 
      label: "Rating Rata-rata", 
      value: userInfo.avgRating, 
      icon: Star, 
      gradient: "from-yellow-500 to-orange-500",
      description: "Kepuasan klien",
      accentColor: "yellow"
    },
    { 
      label: "Tingkat Kesuksesan", 
      value: "98%", 
      icon: TrendingUp, 
      gradient: "from-green-500 to-emerald-500",
      description: "Proyek on-time",
      accentColor: "green"
    },
    { 
      label: "Efisiensi", 
      value: "95%", 
      icon: Rocket, 
      gradient: "from-purple-500 to-pink-500",
      description: "Budget optimization",
      accentColor: "purple"
    }
  ];

  return (
    <motion.div
      variants={staggerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={cardVariants}
          whileHover="hover"
          className={`bg-gradient-to-br ${stat.gradient} p-0.5 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative`}
        >
          {/* Inner Card */}
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-2xl p-4 sm:p-6 h-full relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-8 -right-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-300"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              {/* Top Section */}
              <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 bg-${stat.accentColor}-500/20 rounded-lg sm:rounded-xl border border-${stat.accentColor}-500/30 group-hover:bg-${stat.accentColor}-500/30 transition-all duration-300 flex-shrink-0`}>
                  <stat.icon size={18} className={`sm:w-6 sm:h-6 text-${stat.accentColor}-400`} />
                </div>
                <motion.div 
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-${stat.accentColor}-400 drop-shadow-lg`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
              </div>
              
              {/* Bottom Section */}
              <div className="space-y-1 sm:space-y-2">
                <div className="text-sm sm:text-base font-semibold text-white leading-tight">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 opacity-90 leading-tight">
                  {stat.description}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;