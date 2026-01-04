import { motion } from "framer-motion";
import { Clock, Shield, Zap, Heart } from "lucide-react";

const ContactStats = ({ statsAnim }) => {
  const stats = [
    { icon: Clock, label: "Respon Cepat", value: "< 24 Jam" },
    { icon: Shield, label: "Privasi Terjaga", value: "100%" },
    { icon: Zap, label: "Projek Selesai", value: "50+" },
    { icon: Heart, label: "Klien Senang", value: "98%" },
  ];

  return (
    <motion.div
      {...statsAnim}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + index * 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <stat.icon className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContactStats;