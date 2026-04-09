import { motion } from "framer-motion";

export default function SoftSkillsHeader({ title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-5xl mb-10 flex flex-col items-center"
    >
      <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
        {title || "Soft Skills"}
      </h1>
      <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-8 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
    </motion.div>
  );
}