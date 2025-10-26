import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SoftSkillsSection({ softSkills }) {
  // 🧩 Lindungi dari undefined/null/kosong agar tidak error
  if (
    !softSkills ||
    !Array.isArray(softSkills.list) ||
    softSkills.list.length === 0
  ) {
    return null; // bisa diganti <></> atau <p>Loading...</p> jika ingin placeholder
  }

  return (
    <motion.section
      className="mt-24 w-full max-w-6xl text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-3 animate-spin-slow" />
      <h3 className="text-3xl font-extrabold text-yellow-300 mb-6">
        {softSkills.title || ""}
      </h3>

      <div className="flex flex-wrap justify-center gap-3">
        {softSkills.list.map((skill, i) => (
          <span
            key={i}
            className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-sm text-yellow-200 hover:bg-yellow-400/20 transition"
          >
            {skill || ""}
          </span>
        ))}
      </div>
    </motion.section>
  );
}
