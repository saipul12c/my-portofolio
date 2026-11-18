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
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto w-full"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + index * 0.1 }}
          className="bg-slate-900/60 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 text-center border border-white/10 shadow-lg hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition-all duration-300"
        >
          <stat.icon className="mx-auto mb-2 text-cyan-400" size={20} />
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-xs text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContactStats;