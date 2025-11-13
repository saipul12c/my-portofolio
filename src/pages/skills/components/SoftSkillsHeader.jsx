// SoftSkillsHeader.jsx
import { motion } from "framer-motion";

export default function SoftSkillsHeader({ title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-3xl mb-12"
    >
      <h1 className="text-4xl font-extrabold text-cyan-400 mb-3 drop-shadow-lg">
        {title || "Soft Skills"}
      </h1>
      <p className="text-gray-300 leading-relaxed">
        Temukan berbagai kemampuan non-teknis dan profesional yang
        memperkuat kerja sama, kreativitas, dan kepemimpinan.
      </p>
    </motion.div>
  );
}