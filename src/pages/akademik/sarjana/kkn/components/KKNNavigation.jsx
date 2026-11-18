import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, FileCheck, Award, BookOpen, ArrowRight } from "lucide-react";

const milestones = [
  {
    title: "Program S1 PGMI",
    desc: "Perjalanan perkuliahan dasar & kurikulum keguruan",
    route: "/S1-PGMI",
    icon: BookOpen,
    accent: "from-blue-500 to-indigo-600",
    badge: "Tahap 1"
  },
  {
    title: "Seminar Proposal",
    desc: "Uji kelayakan metodologi & proposal penelitian",
    route: "/sempro-skripsi",
    icon: FileCheck,
    accent: "from-cyan-500 to-blue-600",
    badge: "Tahap 3"
  },
  {
    title: "Sidang Skripsi",
    desc: "Ujian munaqasyah & pertanggungjawaban karya ilmiah",
    route: "/sidang-skripsi",
    icon: Award,
    accent: "from-purple-500 to-pink-600",
    badge: "Tahap 4"
  },
  {
    title: "Wisuda Sarjana",
    desc: "Puncak perayaan kelulusan & penyematan gelar akademik",
    route: "/wisuda",
    icon: GraduationCap,
    accent: "from-amber-500 to-yellow-600",
    badge: "Puncak"
  }
];

export default function KKNNavigation() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
          Jalur Akademik Terintegrasi
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Eksplorasi Tahapan Sarjana Lainnya
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mt-2">
          Jelajahi setiap tonggak perjalanan akademik S1 mulai dari perkuliahan, KKN, sempro, sidang, hingga wisuda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {milestones.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.route}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={item.route}
                className="block h-full rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-6 flex flex-col justify-between group transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Lihat Halaman</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
