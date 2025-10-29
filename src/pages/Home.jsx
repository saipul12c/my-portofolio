import { motion } from "framer-motion";
import { Camera, Code2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Maintenance from "./errors/Maintenance"; // 🧩 impor halaman Maintenance

export default function Home() {
  const isMaintenance = true; // ubah ke false jika sudah normal
  // const isMaintenance = true;

  if (isMaintenance) {
    return <Maintenance />; // 🚧 tampilkan halaman Maintenance
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* HERO SECTION */}
      <motion.section
        className="text-center max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center gap-2 items-center"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
          Muhammad Syaiful Mukmin
        </motion.h1>

        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Saya seorang <span className="text-cyan-400 font-semibold">calon pendidik</span> 
          yang juga mencintai <span className="text-purple-400 font-semibold">dunia teknologi & fotografi</span>.  
          Menggabungkan seni visual dengan pembelajaran digital untuk menciptakan karya yang bermakna 📸✨
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <Link
            to="/photography"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-transform hover:scale-105"
          >
            Lihat Fotografi <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/projects"
            className="bg-white/10 hover:bg-white/20 border border-cyan-400 text-cyan-300 px-6 py-3 rounded-xl font-semibold transition-transform hover:scale-105"
          >
            Lihat Proyek
          </Link>
        </div>
      </motion.section>

      {/* MINI SHOWCASE */}
      <motion.div
        className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {[
          {
            icon: <Camera className="w-10 h-10 text-cyan-400 mb-4" />,
            title: "Fotografi",
            color: "cyan-400",
            text: "Menangkap momen berharga dengan sentuhan artistik dan makna emosional.",
          },
          {
            icon: <Code2 className="w-10 h-10 text-purple-400 mb-4" />,
            title: "Teknologi",
            color: "purple-400",
            text: "Mengembangkan media pembelajaran interaktif dengan React & Tailwind.",
          },
          {
            icon: <Sparkles className="w-10 h-10 text-blue-400 mb-4" />,
            title: "Kreativitas",
            color: "blue-400",
            text: "Menggabungkan seni, edukasi, dan teknologi dalam satu visi yang inspiratif.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:border-${item.color} transition-all`}
          >
            {item.icon}
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* FOOTER CTA */}
      <motion.div
        className="mt-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-400 mb-6">
          Tertarik untuk berkolaborasi atau sekadar berdiskusi?
        </p>
        <Link
          to="/contact"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          Hubungi Saya
        </Link>
      </motion.div>
    </main>
  );
}
