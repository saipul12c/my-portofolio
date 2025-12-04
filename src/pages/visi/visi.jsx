import { motion } from "framer-motion";
import {
  Target,
  Lightbulb,
  Rocket,
  Sparkles,
  Heart,
  Star,
  Compass,
} from "lucide-react";

export default function VisiMisi() {
  const particles = Array.from({ length: 30 });

  const minatBakat = [
    {
      emoji: "💻",
      title: "Web Development",
      desc: "Membangun pengalaman digital yang interaktif & berjiwa.",
    },
    {
      emoji: "📸",
      title: "Photography",
      desc: "Menangkap momen jadi karya visual yang bercerita.",
    },
    {
      emoji: "🎨",
      title: "UI/UX Design",
      desc: "Menggabungkan estetika dengan logika pengguna.",
    },
    {
      emoji: "🧠",
      title: "Creative Strategy",
      desc: "Menemukan ide segar dan mengubahnya jadi dampak nyata.",
    },
    {
      emoji: "🎬",
      title: "Content Creation",
      desc: "Membuat konten yang relate & meaningful untuk Gen Z.",
    },
    {
      emoji: "🚀",
      title: "Personal Growth",
      desc: "Terus upgrade mindset, skill, dan empati tiap hari.",
    },
  ];

  const timeline = [
    {
      year: "2021",
      text: "Awal langkah kecil — mulai belajar desain dan pemrograman web secara otodidak.",
      icon: "🎓",
    },
    {
      year: "2022",
      text: "Mulai membangun proyek freelance, berkolaborasi dengan teman sevisi.",
      icon: "💡",
    },
    {
      year: "2023",
      text: "Mengenal dunia UI/UX dan membuat portofolio digital pertama.",
      icon: "🖌️",
    },
    {
      year: "2024",
      text: "Terlibat dalam komunitas kreatif, berbagi pengetahuan & menginspirasi orang lain.",
      icon: "🤝",
    },
    {
      year: "2025",
      text: "Fokus mengembangkan platform digital untuk kolaborasi dan ekspresi Gen Z.",
      icon: "🚀",
    },
  ];

  return (
    <section className="relative min-h-screen bg-[var(--color-gray-900)] text-gray-100 flex flex-col items-center px-6 py-20 overflow-hidden">
      {/* 🌌 Background Particle & Gradient */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {particles.map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-fuchsia-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-yellow-300/10 blur-3xl rounded-full animate-ping" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-[#1e1b4b]/30 to-[var(--color-gray-900)] opacity-70" />
      </div>

      {/* ✨ Header */}
      <motion.div
        className="text-center max-w-3xl mb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
          Visi, Misi & Minat ✨
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Di balik setiap{" "}
          <motion.span
            className="relative px-1 font-semibold text-white"
            whileHover={{ scale: 1.1 }}
          >
            <span className="absolute inset-0 bg-yellow-300/30 rounded-md" />
            ide besar
          </motion.span>{" "}
          dan{" "}
          <motion.span
            className="relative px-1 font-semibold text-white"
            whileHover={{ scale: 1.1 }}
          >
            <span className="absolute inset-0 bg-pink-400/30 rounded-md" />
            ambisi kreatif
          </motion.span>
          , selalu ada arah dan tujuan yang jelas 💫
        </p>
      </motion.div>

      {/* 🌟 VISI & MISI */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* VISI */}
        <motion.div
          className="relative bg-white/5 backdrop-blur-xl border border-blue-900/40 rounded-3xl p-10 shadow-lg hover:shadow-yellow-400/20 transition-all before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:to-white/10 before:opacity-20 before:rounded-3xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Target className="w-8 h-8 text-yellow-300" />
            <h2 className="text-3xl font-bold text-yellow-300">Visi</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            Menjadi pendidik dan kreator media edukatif yang{" "}
            <span className="text-yellow-300 font-semibold">
              adaptif terhadap kemajuan teknologi dan inovasi digital
            </span>
            , sekaligus{" "}
            <span className="text-yellow-300 font-semibold">
              menginspirasi melalui pembelajaran kreatif, interaktif, dan berdampak
            </span>
            . Berkomitmen menciptakan solusi edukasi yang{" "}
            <span className="text-yellow-300 font-semibold">
              inklusif, berkelanjutan, dan memberikan manfaat positif bagi individu maupun masyarakat luas
            </span>
            .
          </p>
        </motion.div>

        {/* MISI */}
        <motion.div
          className="relative bg-white/5 backdrop-blur-xl border border-blue-900/40 rounded-3xl p-10 shadow-lg hover:shadow-pink-400/20 transition-all before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:to-white/10 before:opacity-20 before:rounded-3xl"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Lightbulb className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl font-bold text-pink-400">Misi</h2>
          </div>
          <ul className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed list-disc list-inside">
            <li>Menciptakan solusi digital yang relevan & bermanfaat.</li>
            <li>Membangun ruang kolaboratif dan edukatif untuk kreator muda.</li>
            <li>Terus belajar, bereksperimen, dan berinovasi tanpa batas 🚀.</li>
            <li>Berkontribusi positif melalui teknologi dan empati.</li>
          </ul>
        </motion.div>
      </div>

      {/* 💫 MINAT & BAKAT */}
      <motion.div
        className="mt-20 max-w-6xl w-full bg-white/5 backdrop-blur-xl border border-blue-900/40 rounded-3xl p-10 shadow-lg transition-all"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-cyan-300" />
          <h2 className="text-3xl font-bold text-cyan-300">Minat & Bakat</h2>
        </div>

        <p className="text-gray-400 text-lg text-center mb-10">
          Aku percaya setiap orang punya{" "}
          <span className="relative px-1">
            <span className="absolute inset-0 bg-yellow-300/25 rounded-md" />
            <span className="relative text-white font-semibold">
              spark unik
            </span>
          </span>{" "}
          yang bikin mereka beda ⚡ ini adalah hal-hal yang paling bikin aku
          hidup:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {minatBakat.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.07,
                rotate: [0, 2, -2, 0],
                transition: { duration: 0.4 },
              }}
              className="relative p-6 bg-white/5 rounded-2xl border border-cyan-900/30 hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/10 hover:to-pink-400/10 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.2),_transparent_70%)]" />
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🌱 FILOSOFI KREATIF */}
      <motion.div
        className="mt-24 max-w-5xl text-center bg-white/5 backdrop-blur-xl border border-cyan-900/40 rounded-3xl p-12 shadow-xl hover:shadow-cyan-500/10 transition-all"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-yellow-300 to-pink-400 bg-clip-text text-transparent mb-6">
          Filosofi Kreatif 🌱
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          Kreativitas bagiku bukan sekadar hasil, tapi perjalanan spiritual —{" "}
          <span className="text-cyan-300 font-medium">
            proses memahami diri lewat karya
          </span>
          . Setiap kesalahan adalah eksperimen, setiap ide adalah benih.{" "}
          <span className="text-yellow-300 font-semibold">
            Keberanian untuk gagal
          </span>{" "}
          adalah bahan bakar dari setiap inovasi yang lahir. Di sinilah seni,
          logika, dan empati bersatu menjadi identitas 🌿.
        </p>
      </motion.div>

      {/* 🕰️ TIMELINE */}
      <motion.section
        className="mt-32 w-full max-w-5xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <h3 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
          Timeline Perjalanan ⏳
        </h3>

        <div className="relative border-l-[3px] border-yellow-400/30 pl-10 space-y-14">
          {/* Garis vertical animasi cahaya */}
          <div className="absolute left-[-2px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-yellow-400 via-yellow-300/20 to-transparent animate-pulse" />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 90 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Titik & ikon */}
              <div className="absolute -left-7 top-1 w-10 h-10 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] flex items-center justify-center text-black font-bold group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
          
              {/* Kartu konten */}
              <div className="bg-zinc-900/40 backdrop-blur-sm border border-yellow-300/10 rounded-2xl p-5 transition-all duration-300 hover:bg-zinc-800/60 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)]">
                <h4 className="text-2xl font-semibold text-yellow-300 mb-2 tracking-wide">
                  {item.year}
                </h4>
                <p className="text-gray-300 leading-relaxed text-base">
                  {item.text}
                </p>
              </div>
          
              {/* Efek garis bercahaya ke kartu */}
              <div className="absolute -left-[3px] top-6 w-8 h-[2px] bg-gradient-to-r from-yellow-400/70 via-yellow-300/30 to-transparent" />
            </motion.div>
          ))}
        </div>
      </motion.section>
        
      {/* 🔮 LANGKAH SELANJUTNYA */}
      <motion.section
        className="mt-32 relative max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
      >
        {/* Background partikel animasi */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <div className="absolute w-[300px] h-[300px] bg-purple-500/20 rounded-full animate-slow-spin blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-[400px] h-[400px] bg-cyan-400/10 rounded-full animate-spin-slow blur-2xl -bottom-32 -right-32"></div>
          <div className="absolute w-full h-full bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-slate-900/80"></div>
        </div>
        
        {/* Card utama */}
        <motion.div
          className="relative p-14 rounded-3xl border border-purple-500/20 shadow-[0_0_60px_rgba(139,92,246,0.2)] hover:shadow-[0_0_100px_rgba(139,92,246,0.35)] backdrop-blur-sm transition-all duration-500"
          whileHover={{ y: -5, scale: 1.02 }}
        >
          {/* Judul */}
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse-text">
            Langkah Selanjutnya 🔮
          </h3>
        
          {/* Konten */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed tracking-wide">
            Aku ingin melangkah menuju fase baru:{" "}
            <span className="text-yellow-300 font-semibold">
              membangun ekosistem kreatif berbasis teknologi
            </span>{" "}
            — tempat ide, kolaborasi, dan pembelajaran bersatu jadi ruang berkembangnya kreativitas muda.
            <br />
            <span className="text-cyan-300 font-medium mt-4 inline-block">
              Misi berikutnya: memberi makna digital yang manusiawi 🌌
            </span>
          </p>
        
          {/* Tombol CTA futuristik */}
          <motion.a
            href="/contact"
            className="mt-10 inline-block px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-black font-semibold shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -3, 0], transition: { repeat: Infinity, duration: 2 } }}
          >
            Bergabung Sekarang
          </motion.a>
        </motion.div>
      </motion.section>

      {/* 💎 CORE VALUES */}
      <motion.div
        className="mt-28 text-center max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        viewport={{ once: true }}
      >
        <div className="flex justify-center mb-6">
          <Rocket className="w-10 h-10 text-yellow-300 animate-bounce" />
        </div>
        <h3 className="text-3xl font-bold text-yellow-300 mb-8">Core Values 💫</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3 animate-pulse" />,
              title: "Empathy",
              desc: "Memahami sebelum mencipta. Setiap karya berangkat dari rasa peduli pada manusia.",
            },
            {
              icon: <Star className="w-8 h-8 text-yellow-300 mx-auto mb-3 animate-pulse" />,
              title: "Creativity",
              desc: "Berani berpikir berbeda, mengekspresikan ide dengan keaslian & jiwa.",
            },
            {
              icon: <Compass className="w-8 h-8 text-cyan-300 mx-auto mb-3 animate-pulse" />,
              title: "Growth",
              desc: "Setiap hari adalah kesempatan untuk berkembang, belajar, dan berevolusi.",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06, rotate: 1 }}
              className="relative p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-900/40 hover:border-yellow-300/40 hover:shadow-lg transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-transparent rounded-2xl opacity-20" />
              {value.icon}
              <h4 className="text-xl font-semibold mb-2 text-white">{value.title}</h4>
              <p className="text-gray-400 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 💬 QUOTE */}
      <motion.blockquote
        className="mt-20 text-center text-gray-300 italic text-lg border-l-4 border-yellow-300/60 pl-6 max-w-3xl mx-auto bg-gradient-to-r from-yellow-300/5 to-pink-400/5 rounded-xl p-6 shadow-inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        “Creativity is intelligence having fun.” —{" "}
        <span className="text-yellow-300 font-semibold">Albert Einstein</span>
      </motion.blockquote>
    </section>
  );
}
