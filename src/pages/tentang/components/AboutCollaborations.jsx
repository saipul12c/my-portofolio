// AboutCollaborations.jsx
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCollaborations({ collabs }) {
  return (
    <motion.section
      className="mt-24 w-full max-w-5xl text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Users className="w-10 h-10 text-cyan-300 mx-auto mb-4" />
      <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6">
        {collabs.sectionTitle}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
        {collabs.partners.map((partner, i) => (
          <Link
            key={i}
            to={collabs.link}
            className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:border-cyan-400 rounded-2xl p-6 transition-all hover:scale-[1.03] shadow-md"
          >
            <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition">
              {partner.name}
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {partner.desc}
            </p>
            <p className="mt-3 text-cyan-300 text-xs font-medium group-hover:underline">
              Lihat Testimoni →
            </p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
