import React, { memo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const connections = [
  {
    id: 1,
    title: "Lihat Proyek",
    description: "Implementasi nyata dari bahasa dan teknologi yang saya kuasai",
    link: "/projects",
    icon: "🚀",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-300"
  },
  {
    id: 2,
    title: "Daftar Aplikasi",
    description: "Katalog seluruh aplikasi, website interaktif, dan tools inovatif",
    link: "/daftar-aplikasi",
    icon: "✨",
    color: "from-teal-500/20 to-cyan-500/20",
    borderColor: "border-teal-500/30",
    textColor: "text-teal-300"
  },
  {
    id: 3,
    title: "Baca Blog",
    description: "Tutorial, tips, dan insight seputar software dan bahasa pemrograman",
    link: "/blog",
    icon: "📚",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-300"
  },
  {
    id: 4,
    title: "Soft Skills",
    description: "Kemampuan interpersonal yang menunjang kepemimpinan dan kolaborasi",
    link: "/SoftSkills",
    icon: "⭐",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-300"
  },
  {
    id: 5,
    title: "Tentang Saya",
    description: "Pelajari lebih lanjut tentang perjalanan karir dan latar belakang saya",
    link: "/about",
    icon: "👤",
    color: "from-green-500/20 to-teal-500/20",
    borderColor: "border-green-500/30",
    textColor: "text-green-300"
  }
];

export const PageConnections = memo(() => {
  return (
    <div 
      className="mt-12 sm:mt-16 mb-8 sm:mb-12"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 260px" }}
    >
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Jelajahi Lebih Lanjut
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
          Temukan implementasi kemampuan bahasa dan teknologi ini di bagian lain portofolio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {connections.map((item) => (
          <Link 
            key={item.id} 
            to={item.link} 
            className="block h-full group"
          >
            <div className={`h-full bg-gradient-to-br ${item.color} backdrop-blur-md rounded-2xl p-4 sm:p-5 border ${item.borderColor} hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between`}>
              <div>
                <div className="text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
                <h4 className={`text-base sm:text-lg font-bold ${item.textColor} mb-1 group-hover:text-white transition-colors`}>
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors mt-3">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

PageConnections.displayName = "PageConnections";
