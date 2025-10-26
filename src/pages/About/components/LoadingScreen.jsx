import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
      <motion.div
        className="flex space-x-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, repeat: Infinity } },
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-cyan-400 rounded-full"
            variants={{
              hidden: { y: 0, opacity: 0.3 },
              visible: { y: -15, opacity: 1 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>

      <p className="mt-6 text-lg sm:text-xl text-gray-300 animate-pulse">
        Memuat konten...
      </p>
    </div>
  );
}
