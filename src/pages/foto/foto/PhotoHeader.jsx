import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function PhotoHeader() {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto space-y-4 mb-12 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
        <Camera className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-cyan-400" />
        Galeri Fotografi
      </h1>
      <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
        Visual bukan sekadar gambar — ia adalah bahasa emosi, waktu, dan cahaya.  
        Di sini, saya berbagi perjalanan dan perspektif melalui lensa pribadi 📸
      </p>
    </motion.div>
  );
}