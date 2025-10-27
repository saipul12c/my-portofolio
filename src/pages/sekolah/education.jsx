import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useRef } from "react";

export default function Education() {
  const educationData = [
    {
      degree: "S1 Pendidikan Guru Sekolah Dasar",
      institution: "Universitas Pendidikan Indonesia",
      year: "2017 - 2021",
      description:
        "Fokus pada pembelajaran tematik interdisipliner serta pengembangan karakter siswa melalui pendekatan holistik dan kolaboratif.",
    },
    {
      degree: "SMA Negeri 1 Bandung",
      institution: "Ilmu Pengetahuan Sosial",
      year: "2014 - 2017",
      description:
        "Berpartisipasi aktif dalam organisasi, debat, dan kegiatan sosial yang mengasah empati, kepemimpinan, serta komunikasi publik.",
    },
  ];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main
      ref={ref}
      className="relative min-h-screen bg-[#0b1120] text-white flex flex-col items-center px-6 py-24 overflow-hidden"
    >
      {/* === Scroll Progress Bar (dengan shimmer animasi) === */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[5px] origin-left z-50 bg-[linear-gradient(90deg,#06b6d4,#a855f7,#ec4899)] animate-[shimmer_3s_infinite_linear]"
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-[shimmer_3s_infinite_linear] {
          background-size: 200% 200%;
        }
      `}</style>

      {/* === Background Glow === */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5rem] left-[-5rem] w-[30rem] h-[30rem] bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-5rem] right-[-5rem] w-[30rem] h-[30rem] bg-fuchsia-500/20 blur-[120px]" />
      </div>

      {/* === Header === */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-24"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          Riwayat Pendidikan
        </h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          Perjalanan akademik yang membentuk cara berpikir, nilai, dan visi
          menuju masa depan penuh inovasi.
        </p>
      </motion.div>

      {/* === Timeline === */}
      <section className="relative max-w-5xl w-full flex flex-col items-center">
        {/* Garis tengah */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 rounded-full hidden sm:block opacity-70" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] bg-gradient-to-b from-cyan-200 via-fuchsia-400 to-transparent hidden sm:block shadow-[0_0_15px_rgba(56,189,248,0.6)]"
        />

        <div className="flex flex-col gap-24 w-full mt-10">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative sm:w-[46%] px-10 py-8 rounded-3xl backdrop-blur-md transition-all duration-500 hover:scale-[1.03] ${
                index % 2 === 0
                  ? "self-start sm:mr-auto bg-gradient-to-br from-[#172554]/80 to-[#1e293b]/70 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                  : "self-end sm:ml-auto bg-gradient-to-bl from-[#1e1b4b]/80 to-[#1e293b]/70 hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]"
              }`}
            >
              {/* Icon Bubble */}
              <div
                className={`absolute sm:top-1/2 sm:-translate-y-1/2 top-[-1.5rem] ${
                  index % 2 === 0 ? "sm:-right-8" : "sm:-left-8"
                } flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg`}
              >
                <GraduationCap size={22} className="text-white" />
              </div>

              <h2 className="text-2xl font-semibold text-cyan-300 mb-1">
                {edu.degree}
              </h2>
              <h3 className="text-lg text-gray-200">{edu.institution}</h3>
              <p className="text-sm text-gray-400 mb-3 italic">{edu.year}</p>
              <p className="text-gray-300 leading-relaxed">{edu.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === Footer Glow === */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0b1120] to-transparent pointer-events-none" />
    </main>
  );
}
