import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Animated Logo or Icon */}
      <motion.div
        className="flex flex-col items-center space-y-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />

        <motion.h1
          className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          Memuat Halaman Tentang...
        </motion.h1>

        <motion.p
          className="text-gray-400 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Mohon tunggu sebentar ✨
        </motion.p>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.8 + 0.3,
            }}
            animate={{
              y: [null, -50],
              opacity: [0.4, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
