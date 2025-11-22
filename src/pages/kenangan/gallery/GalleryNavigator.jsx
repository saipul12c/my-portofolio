import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Image, Users, Zap } from "lucide-react";

export default function GalleryNavigator() {
  const relatedPages = [
    {
      title: "📸 Fotografi",
      description: "Jelajahi koleksi fotografi profesional dengan detail teknis lengkap",
      icon: Image,
      link: "/photography",
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "📖 Blog",
      description: "Baca cerita & tips di balik setiap tangkapan gambar & momen",
      icon: Zap,
      link: "/blog",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "👥 Testimoni",
      description: "Lihat pengalaman & cerita dari berbagai pengguna & komunitas",
      icon: Users,
      link: "/testimoni",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <motion.section
      className="w-full max-w-7xl mx-auto mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold mb-8 text-white flex items-center gap-2">
        <Zap className="w-6 h-6 text-yellow-400" /> Jelajahi Lebih Lanjut
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.link} to={page.link}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${page.color} p-px group cursor-pointer`}
              >
                {/* Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="relative bg-[#0f172a] rounded-[15px] p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${page.color} bg-opacity-20`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-lg group-hover:text-cyan-300 transition">
                        {page.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {page.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 mt-4 text-cyan-400 group-hover:gap-3 transition-all">
                    <span className="text-sm font-medium">Lihat Lebih</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
