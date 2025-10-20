import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function PhotoHeader() {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto space-y-6 mb-16"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
        <Camera className="w-10 h-10 text-cyan-400" />
        Galeri Fotografi
      </h1>
      <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
        Visual bukan sekadar gambar — ia adalah bahasa emosi, waktu, dan cahaya.  
        Di sini, saya berbagi perjalanan dan perspektif melalui lensa pribadi 📸
      </p>
    </motion.div>
  );
}
