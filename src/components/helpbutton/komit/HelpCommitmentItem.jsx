import { useEffect, useState } from "react";
import { Heart, Sparkles, HandHeart, Users, Globe, Lightbulb, Star } from "lucide-react";
import { motion } from "framer-motion";
import commitmentsData from "./data/commitments.json"; 

const iconMap = {
  HandHeart: <HandHeart className="text-pink-400" size={28} />,
  Users: <Users className="text-pink-400" size={28} />,
  Globe: <Globe className="text-pink-400" size={28} />,
  Lightbulb: <Lightbulb className="text-pink-400" size={28} />,
  Star: <Star className="text-pink-400" size={28} />
};

export default function HelpCommitmentItem() {
  const [commitments, setCommitments] = useState([]);

  useEffect(() => {
    setCommitments(commitmentsData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-800 dark:text-gray-100 flex flex-col items-center py-20 px-6 relative overflow-hidden">

      {/* Background sparkles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.2),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.2),transparent_60%)]"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl z-10"
      >
        <div className="flex justify-center mb-4">
          <Heart className="text-pink-500 animate-pulse" size={42} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Komitmen Kami 💖
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Kami percaya setiap tindakan kecil punya dampak besar.  
          Ini bukan sekadar janji, tapi gaya hidup kami dalam menciptakan kebaikan, inspirasi, dan inovasi.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl z-10">
        {commitments.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="p-6 rounded-2xl bg-white/70 dark:bg-gray-800/50 shadow-lg backdrop-blur-md border border-pink-100/30 hover:shadow-pink-400/40 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="mb-4 flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {iconMap[item.icon] || <Sparkles className="text-pink-400" size={28} />}
              </motion.div>
              <Sparkles
                className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                size={16}
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-pink-500 group-hover:text-purple-500 transition-colors">
              {item.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center z-10"
      >
        <p>
          Dibuat dengan <span className="text-pink-500">❤️</span> dan sedikit <span className="text-purple-400">✨ magic ✨</span> oleh tim yang percaya pada perubahan positif.
        </p>
      </motion.footer>
    </div>
  );
}
