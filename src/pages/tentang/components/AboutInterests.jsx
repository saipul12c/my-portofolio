// AboutInterests.jsx
import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Camera,
  BookOpen,
  Film,
  PenTool,
  Cpu,
  Compass,
  Palette,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  Camera,
  BookOpen,
  Film,
  PenTool,
  Cpu,
  Compass,
  Palette,
  Sparkles,
};

function AboutInterests({ interests }) {
  // Use featuredHobbies from interests or fallback list
  const hobbies = useMemo(() => {
    if (interests?.featuredHobbies?.length) {
      return interests.featuredHobbies;
    }
    return [
      {
        id: 1,
        title: "Fotografi & Visual Arts",
        icon: "Camera",
        desc: "Menangkap momen bermakna dan mengabadikan detail keindahan kehidupan melalui lensa.",
        category: "Kreatif",
      },
      {
        id: 2,
        title: "Buku Pengembangan Diri",
        icon: "BookOpen",
        desc: "Mendalami wawasan tentang pola pikir, kebijaksanaan hidup, dan metodologi pembelajaran.",
        category: "Edukasi",
      },
      {
        id: 3,
        title: "Video Dokumenter Edukatif",
        icon: "Film",
        desc: "Mengolah narasi video inspiratif yang memudahkan audiens memahami materi penting.",
        category: "Media",
      },
      {
        id: 4,
        title: "Desain Grafis & UI/UX",
        icon: "PenTool",
        desc: "Menyalurkan ide visual lewat komposisi warna, tata letak, dan tipografi yang harmonis.",
        category: "Kreatif",
      },
      {
        id: 5,
        title: "Eksplorasi AI & Otomasi",
        icon: "Cpu",
        desc: "Memanfaatkan generative AI dan tools otomatisasi untuk akselerasi efisiensi pengajaran.",
        category: "Teknologi",
      },
      {
        id: 6,
        title: "Jelajah Alam & Citywalk",
        icon: "Compass",
        desc: "Menyegarkan pikiran dan menggali inspirasi baru dari alam serta budaya sekitar.",
        category: "Eksplorasi",
      },
    ];
  }, [interests]);

  return (
    <section className="mt-28 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative inline-block mb-3">
          <div className="absolute inset-0 bg-teal-400/20 blur-xl rounded-full" />
          <div className="relative z-10 p-3 bg-[#111c34]/90 rounded-2xl border border-teal-400/30 shadow-lg shadow-teal-950/20">
            <Sparkles className="w-8 h-8 text-teal-300" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">
          {interests?.sectionTitle || "Aktivitas & Ketertarikan Pribadi"}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full my-3" />
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
          {interests?.description ||
            "Di luar dunia akademik dan teknologi, saya senang mengeksplorasi fotografi, membaca buku pengembangan diri, dan mengedit video dokumenter pendidikan untuk menjaga keseimbangan kreativitas dan profesionalitas."}
        </p>
      </div>

      {/* Hobbies Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {hobbies.map((hobby, index) => {
          const Icon = iconMap[hobby.icon] || Sparkles;

          return (
            <motion.div
              key={hobby.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="h-full"
            >
              <Link
                to={hobby?.slug ? `/hobbies/${hobby.slug}` : (interests?.link || "/hobbies")}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-3xl"
              >
                <div className="h-full flex flex-col justify-between bg-[#111c34]/60 hover:bg-[#132242]/90 backdrop-blur-xl border border-blue-900/40 hover:border-teal-400/40 rounded-3xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 group-hover:-translate-y-1">
                  <div>
                    {/* Header: Icon & Category */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {hobby.category || "Hobi"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors mb-2">
                      {hobby.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-3">
                      {hobby.desc}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300 transition-colors">
                    <span>Lihat Aktivitas</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Button to All Hobbies */}
      <div className="mt-10">
        <Link
          to={interests?.link || "/hobbies"}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-teal-500/20 active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          Jelajahi Semua Hobi & Aktivitas
          <ExternalLink className="w-4 h-4 ml-1 text-slate-950" />
        </Link>
      </div>
    </section>
  );
}

export default memo(AboutInterests);
