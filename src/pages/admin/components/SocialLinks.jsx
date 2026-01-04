import { motion } from "framer-motion";
import { Sparkles, Mail, Github, Linkedin, Instagram, Phone } from "lucide-react";
import { SOCIAL_LINKS } from "../utils/constants";

const SocialLinks = ({ contactAnim }) => {
  return (
    <motion.div
      {...contactAnim}
      className="mt-20 text-gray-700 dark:text-gray-300 text-center max-w-6xl relative z-10"
    >
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg"
        >
          <Sparkles className="text-blue-500" size={24} />
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Terhubung Dengan Saya
          </h3>
          <Sparkles className="text-blue-500" size={24} />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Temukan saya di platform lain untuk kolaborasi yang lebih seru dan update terbaru
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {SOCIAL_LINKS.map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-5 text-center group hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-white/20 shadow-lg`}
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              {item.icon}
            </div>
            <div className="font-bold text-gray-800 dark:text-white mb-1">{item.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialLinks;