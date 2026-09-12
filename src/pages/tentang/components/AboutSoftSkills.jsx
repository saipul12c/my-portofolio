// AboutSoftSkills.jsx
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

// Palet warna tetap sama persis
const palette = [
  { bg: "bg-pink-500/30", text: "text-white" },
  { bg: "bg-purple-500/30", text: "text-white" },
  { bg: "bg-blue-500/30", text: "text-white" },
  { bg: "bg-cyan-500/30", text: "text-white" },
  { bg: "bg-green-500/30", text: "text-white" },
  { bg: "bg-emerald-500/30", text: "text-white" },
  { bg: "bg-yellow-500/30", text: "text-white" },
  { bg: "bg-orange-500/30", text: "text-white" },
  { bg: "bg-amber-500/30", text: "text-white" },
  { bg: "bg-rose-500/30", text: "text-white" },
  { bg: "bg-indigo-500/30", text: "text-white" },
  { bg: "bg-teal-500/30", text: "text-white" },
];

const levelColors = {
  Dasar: { bg: "bg-gray-600", text: "text-white" },
  Menengah: { bg: "bg-indigo-600", text: "text-white" },
  Mahir: { bg: "bg-green-600", text: "text-white" },
  Ahli: { bg: "bg-amber-500", text: "text-white" },
};

// Orkestrasi animasi terpadu (1 observer untuk puluhan item alih-alih puluhan observer)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function AboutSoftSkills({ softSkills }) {
  if (!softSkills?.sectionTitle || !softSkills?.skills?.length) return null;

  return (
    <motion.section
      className="mt-24 w-full max-w-5xl text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <Link to={softSkills?.link || "#"} className="block group mb-8">
        <Heart className="w-10 h-10 text-cyan-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
        <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition">
          {softSkills?.sectionTitle}
        </h3>
      </Link>
  
      <motion.div 
        className="flex flex-wrap justify-center gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {softSkills?.skills
          ?.filter((skill) => skill?.name && skill?.level)
          .map((skill, i) => {
            const skillColor = palette[(i * 7 + 3) % palette.length];
            const levelColor = levelColors[skill.level] || {
              bg: "bg-white/20",
              text: "text-white",
            };
            
            return (
              <motion.div
                key={skill?.id || i}
                variants={itemVariants}
                className="will-change-transform"
              >
                <Link to={`/SoftSkills/${skill?.id || ""}`} className="relative group inline-block">
                  <span
                    className={`px-5 py-2 ${skillColor.bg} ${skillColor.text} border border-white/20 rounded-full text-sm font-semibold hover:scale-105 hover:shadow-lg transition-all inline-flex items-center gap-2 backdrop-blur-sm`}
                  >
                    {skill?.name}
                    <span
                      className={`${levelColor.bg} ${levelColor.text} px-3 py-1 text-xs font-bold rounded-full shadow-sm border border-white/20`}
                    >
                      {skill?.level}
                    </span>
                  </span>
            
                  {/* Tooltip hanya muncul kalau ada description */}
                  {skill?.description && (
                    <span className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs rounded-md px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                      {skill?.description}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
      </motion.div>
    </motion.section>
  );
}
