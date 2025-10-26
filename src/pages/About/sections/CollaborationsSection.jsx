import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function CollaborationsSection({ collabs }) {
  // Jika collabs tidak ada atau list bukan array atau kosong, jangan tampilkan apa-apa
  if (!collabs || !Array.isArray(collabs.list) || collabs.list.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mt-24 w-full max-w-5xl text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Users className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
      {/* Jika title tidak tersedia, kosongkan string agar tidak menampilkan "undefined" */}
      <h3 className="text-3xl font-extrabold text-cyan-400 mb-6">
        {collabs.title || ""}
      </h3>

      <div className="flex flex-wrap justify-center gap-4">
        {collabs.list.map((col, i) => (
          <Link
            key={i}
            to={col.link || "#"}
            className="bg-white/10 backdrop-blur-xl border border-cyan-400/20 rounded-full px-5 py-2 text-sm hover:bg-cyan-500/20 transition"
          >
            {col.name || "—"}
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
