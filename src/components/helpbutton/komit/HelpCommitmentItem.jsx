import { useEffect, useState } from "react";
import { Heart, Sparkles, HandHeart, Users, Globe, Lightbulb, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import commitmentsData from "./data/commitments.json";

const iconMap = {
  HandHeart: HandHeart,
  Users: Users,
  Globe: Globe,
  Lightbulb: Lightbulb,
  Star: Star
};

const colorMap = {
  primary: "from-pink-500 to-rose-500",
  secondary: "from-blue-500 to-cyan-500", 
  success: "from-emerald-500 to-green-500",
  warning: "from-amber-500 to-orange-500",
  info: "from-indigo-500 to-purple-500"
};

export default function HelpCommitmentItem() {
  const [commitments, setCommitments] = useState([]);

  useEffect(() => {
    setCommitments(commitmentsData.commitments || []);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-16 px-4 relative overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-12 relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl">
            <Heart className="text-white" size={32} />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-300" size={16} />
          </div>
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {commitmentsData.section_title || "Komitmen Kami"}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {commitmentsData.section_subtitle || "Lebih dari sekadar kata-kata, ini adalah fondasi yang membentuk setiap langkah perjalanan kami"}
        </p>
      </motion.div>

      {/* Commitment Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {commitments.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Sparkles;
          const gradient = colorMap[item.color_scheme] || "from-pink-500 to-purple-500";
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-md`}>
                  <IconComponent size={24} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  #{String(item.id).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {item.title}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
                  {item.short_desc}
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {item.desc}
                </p>

                {/* Key Points */}
                {item.key_points && (
                  <div className="space-y-2 pt-2">
                    {item.key_points.slice(0, 3).map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start gap-2">
                        <CheckCircle2 
                          className={`flex-shrink-0 mt-0.5 ${gradient.replace('from-', 'text-').split(' ')[0]}`} 
                          size={16} 
                        />
                        <span className="text-gray-600 dark:text-gray-400 text-xs">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="pt-4">
                  <motion.a
                    href={`/commitment/${item.id}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 w-full justify-center`}
                  >
                    Lihat Detail
                    <ArrowRight size={14} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}