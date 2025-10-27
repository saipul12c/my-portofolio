// AboutInterests.jsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutInterests({ interests }) {
  return (
    <motion.section
      className="mt-24 max-w-4xl text-center space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link to={interests.link} className="block group">
        <Sparkles className="w-10 h-10 text-cyan-300 mx-auto animate-pulse mb-3" />
        <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition">
          {interests.sectionTitle}
        </h3>
      </Link>

      <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
        {interests.description}
      </p>
    </motion.section>
  );
}
