import React from "react";
import { motion } from "framer-motion";
import { Target, Users, Calendar, TrendingUp, BookOpen, HeartHandshake } from "lucide-react";

const iconMap = {
  Target: Target,
  Users: Users,
  Calendar: Calendar,
  TrendingUp: TrendingUp,
  BookOpen: BookOpen,
  HeartHandshake: HeartHandshake,
};

export default function KKNStats({ stats = [] }) {
  return (
    <section id="stats" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
          Capaian Kuantitatif
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Dampak Nyata Pengabdian
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Ikhtisar angka capaian program kerja yang terlaksana berkat sinergi mahasiswa, pemuda, dan warga desa.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {stats.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Target;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-5 sm:p-6 text-center transition-all duration-300 shadow-xl ${item.shadow}`}
            >
              {/* Glow accent */}
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${item.color} rounded-full blur-2xl opacity-20 pointer-events-none`}
              />

              <div
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg`}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              <div className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight">
                {item.value}
              </div>

              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                {item.label}
              </div>

              <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                {item.subtext}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
