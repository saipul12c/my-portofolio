import { motion } from "framer-motion";

export default function Certificates() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">Sertifikat</h1>
        <p className="text-gray-300">
          Halaman ini menampilkan daftar lengkap sertifikat dan penghargaan yang telah diperoleh.
        </p>
      </motion.div>
    </main>
  );
}
