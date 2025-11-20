import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Component untuk menonjolkan koneksi halaman di bagian umum Bahasa page
 * Menunjukkan navigasi ke halaman terkait seperti Projects, Blog, Soft Skills
 */
export const PageConnections = React.memo(() => {
  const connections = [
    {
      id: 1,
      title: "Lihat Proyek",
      description: "Implementasi nyata dari bahasa dan teknologi yang saya kuasai",
      link: "/projects",
      icon: "🚀",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/50",
      textColor: "text-blue-300",
      hoverColor: "hover:bg-blue-500/30"
    },
    {
      id: 2,
      title: "Baca Blog",
      description: "Tutorial, tips, dan insights tentang teknologi dan bahasa pemrograman",
      link: "/blog",
      icon: "📚",
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/50",
      textColor: "text-amber-300",
      hoverColor: "hover:bg-amber-500/30"
    },
    {
      id: 3,
      title: "Soft Skills",
      description: "Kemampuan non-teknis yang mendukung expertise professional saya",
      link: "/SoftSkills",
      icon: "⭐",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/50",
      textColor: "text-purple-300",
      hoverColor: "hover:bg-purple-500/30"
    },
    {
      id: 4,
      title: "Tentang Saya",
      description: "Pelajari lebih lanjut tentang background dan pengalaman saya",
      link: "/about",
      icon: "👤",
      color: "from-green-500/20 to-teal-500/20",
      borderColor: "border-green-500/50",
      textColor: "text-green-300",
      hoverColor: "hover:bg-green-500/30"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16 sm:mt-20 mb-12 sm:mb-16"
    >
      <div className="text-center mb-8 sm:mb-12">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          Jelajahi Lebih Lanjut
        </h3>
        <p className="text-cyan-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
          Temukan bagaimana kemampuan bahasa dan teknologi saya diaplikasikan dalam berbagai aspek portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {connections.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link to={item.link} className="block h-full">
              <motion.div
                className={`group relative h-full bg-gradient-to-br ${item.color} backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 ${item.borderColor} transition-all duration-300 overflow-hidden`}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div 
                    className="text-3xl sm:text-4xl mb-3 sm:mb-4"
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Title */}
                  <h4 className={`text-lg sm:text-xl font-bold ${item.textColor} mb-2 sm:mb-3 group-hover:text-white transition-colors`}>
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-300 flex-1 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-sm font-semibold text-cyan-400 group-hover:text-white transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover border animation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl border-2 border-transparent bg-gradient-to-r from-cyan-500/50 to-purple-500/50 -m-0.5" style={{pointerEvents: 'none'}}></div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

PageConnections.displayName = "PageConnections";
