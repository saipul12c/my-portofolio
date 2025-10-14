import { motion } from "framer-motion";
import {
  Camera,
  BookOpen,
  Film,
  PenTool,
  PenSquare,
  Headphones,
  Compass,
  Laptop,
} from "lucide-react";

export default function Hobbies() {
  const hobbies = [
    {
      icon: <Camera size={34} className="text-teal-400" />,
      title: "Fotografi",
      desc: "Menangkap momen penuh makna dan belajar melihat keindahan dalam detail kecil kehidupan.",
      color: "from-teal-400/30 to-sky-500/10",
    },
    {
      icon: <BookOpen size={34} className="text-violet-400" />,
      title: "Membaca Buku Pengembangan Diri",
      desc: "Mendalami wawasan tentang mindset, kebijaksanaan, dan perjalanan menuju versi diri yang lebih baik.",
      color: "from-violet-400/30 to-fuchsia-500/10",
    },
    {
      icon: <Film size={34} className="text-pink-400" />,
      title: "Editing Video Dokumenter Pendidikan",
      desc: "Menyampaikan pesan edukatif secara kreatif melalui visual yang berkesan dan inspiratif.",
      color: "from-pink-400/30 to-cyan-400/10",
    },
    {
      icon: <PenTool size={34} className="text-cyan-300" />,
      title: "Desain Grafis",
      desc: "Menyalurkan imajinasi lewat tipografi, warna, dan komposisi visual yang kuat namun sederhana.",
      color: "from-cyan-300/30 to-emerald-400/10",
    },
    {
      icon: <PenSquare size={34} className="text-rose-300" />,
      title: "Menulis Blog Edukasi",
      desc: "Berbagi insight dan refleksi pembelajaran melalui tulisan yang ringan tapi bermakna.",
      color: "from-rose-300/30 to-orange-300/10",
    },
    {
      icon: <Headphones size={34} className="text-amber-300" />,
      title: "Mendengarkan Musik Lo-fi",
      desc: "Menenangkan pikiran dan menjaga fokus dengan alunan musik yang lembut dan menenangkan.",
      color: "from-amber-300/30 to-orange-300/10",
    },
    {
      icon: <Compass size={34} className="text-emerald-300" />,
      title: "Jelajah Alam & Citywalk",
      desc: "Menemukan inspirasi baru dari perjalanan sederhana, udara segar, dan suasana sekitar.",
      color: "from-emerald-300/30 to-lime-400/10",
    },
    {
      icon: <Laptop size={34} className="text-sky-300" />,
      title: "Eksperimen Web Design Minimalis",
      desc: "Menciptakan pengalaman digital yang bersih, fungsional, dan artistik melalui desain sederhana.",
      color: "from-sky-300/30 to-indigo-400/10",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start px-6 py-24 bg-gradient-to-b from-[#0b0f1c] via-[#101422] to-[#0b0f1c] text-white overflow-hidden">
      {/* === Background Glow === */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-[15%] w-64 h-64 bg-cyan-400/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-[15%] w-72 h-72 bg-purple-400/15 rounded-full blur-[120px]" />
      </div>

      {/* === Header === */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-center max-w-3xl mb-20"
      >
        <motion.h1
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-[length:200%_200%] bg-clip-text text-transparent"
        >
          Aktivitas & Ketertarikan
        </motion.h1>
        <p className="mt-6 text-gray-400 text-lg leading-relaxed">
          Di luar dunia akademik dan teknologi, saya senang menyalurkan ide
          melalui karya visual, tulisan, musik, dan eksplorasi kreatif lainnya —
          tempat saya belajar tentang makna, keseimbangan, dan ekspresi diri.
        </p>
      </motion.div>

      {/* === Hobby Cards === */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">
        {hobbies.map((hobby, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -4 }}
            className={`relative group bg-gradient-to-br ${hobby.color} p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(255,255,255,0.1)] transition-all duration-500`}
          >
            <div className="mb-6">{hobby.icon}</div>
            <h2 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-cyan-300 transition-colors">
              {hobby.title}
            </h2>

            {/* === Deskripsi dengan efek “menyapu kuning” dari awal ke akhir === */}
            <p
              className="relative text-gray-400 text-[15px] leading-relaxed bg-gradient-to-r from-gray-400 to-yellow-300 bg-[length:200%_100%] bg-clip-text text-transparent transition-all duration-[2000ms] group-hover:bg-[position:100%_0%]"
            >
              {hobby.desc}
            </p>

            <style jsx>{`
              .group:hover p {
                background-position: 100% 0%;
              }
            `}</style>

            {/* Floating accent line */}
            <motion.div
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.4 }}
              className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r ${hobby.color} rounded-b-3xl`}
            />
          </motion.div>
        ))}
      </section>

      {/* === Footer === */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0b0f1c] to-transparent" />
    </main>
  );
}
