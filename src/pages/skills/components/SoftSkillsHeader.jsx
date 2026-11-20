import React, { memo } from "react";
import { motion } from "framer-motion";

const SoftSkillsHeader = memo(({ title = "Nilai Profesional & Soft Skills" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mb-8 flex flex-col items-center select-none text-center"
    >
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
        {title}
      </h1>
      <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-3 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
      <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
        Koleksi kompetensi interpersonal, etos kerja, dan kecakapan profesional untuk kolaborasi yang berdampak.
      </p>
    </motion.div>
  );
});

SoftSkillsHeader.displayName = "SoftSkillsHeader";
export default SoftSkillsHeader;
