import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function PhotoPhilosophy() {
  return (
    <motion.section
      className="mt-24 max-w-4xl text-center space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Sparkles className="w-10 h-10 text-cyan-300 mx-auto animate-pulse" />
      <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400">
        Filosofi di Balik Lensa
      </h3>
      <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
        Setiap foto adalah bentuk komunikasi — tanpa kata, namun penuh makna.  
        Saya percaya bahwa cahaya bukan sekadar alat teknis, tapi bahasa spiritual  
        yang menuntun pandangan dan emosi penikmatnya.
      </p>
    </motion.section>
  );
}
