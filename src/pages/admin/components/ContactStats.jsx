import { memo } from "react";
import { motion } from "framer-motion";
import { Clock, Shield, Zap, Heart } from "lucide-react";

const STATS_DATA = [
  { icon: Clock, label: "Respon Cepat", value: "< 24 Jam" },
  { icon: Shield, label: "Privasi Terjaga", value: "100%" },
  { icon: Zap, label: "Projek Selesai", value: "50+" },
  { icon: Heart, label: "Klien Senang", value: "98%" },
];

const ContactStats = memo(({ statsAnim }) => {
  return (
    <motion.div
      {...statsAnim}
      className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl mx-auto w-full mt-2"
    >
      {STATS_DATA.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center border border-white/10 shadow-md hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition-colors duration-200"
        >
          <stat.icon className="mx-auto mb-1.5 text-cyan-400" size={18} />
          <div className="text-base sm:text-xl font-bold text-white">{stat.value}</div>
          <div className="text-[11px] sm:text-xs text-gray-400">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
});

ContactStats.displayName = "ContactStats";

export default ContactStats;
