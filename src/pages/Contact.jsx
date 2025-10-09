import { motion } from "framer-motion";
import Maintenance from "./errors/Maintenance"; // 🚧 Tambah import

export default function Contact() {
  // 🚧 Mode Maintenance toggle
  const isMaintenance = false; // ubah ke true jika lagi perbaikan

  if (isMaintenance) {
    return <Maintenance />; // tampilkan halaman 503
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-6 sm:px-10 md:px-20 py-16 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      {/* Judul Halaman */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-purple-600 dark:text-purple-400 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Hubungi Syaiful Mukmin 📬
      </motion.h1>

      {/* Deskripsi */}
      <motion.p
        className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Jika kamu ingin berdiskusi, berkolaborasi, atau sekadar menyapa —
        kirimkan pesan lewat form di bawah ini ✨
      </motion.p>

      {/* Formulir Kontak */}
      <motion.form
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-4 transition-transform transform hover:scale-[1.01]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <input
          type="text"
          placeholder="Nama kamu"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-700 dark:text-gray-200 bg-transparent focus:ring-2 focus:ring-purple-400 outline-none transition"
        />
        <input
          type="email"
          placeholder="Email kamu"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-700 dark:text-gray-200 bg-transparent focus:ring-2 focus:ring-purple-400 outline-none transition"
        />
        <textarea
          placeholder="Pesan kamu..."
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 h-28 text-gray-700 dark:text-gray-200 bg-transparent focus:ring-2 focus:ring-purple-400 outline-none transition resize-none"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 active:scale-95"
        >
          Kirim Pesan 🚀
        </button>
      </motion.form>

      {/* Kontak Alternatif */}
      <motion.div
        className="mt-12 text-gray-700 dark:text-gray-300 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Atau hubungi saya melalui:</p>
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <a
            href="mailto:syaiful@example.com"
            className="hover:text-purple-500 transition-colors"
          >
            📧 Email
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors"
          >
            💻 GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors"
          >
            🔗 LinkedIn
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-16 text-gray-500 dark:text-gray-400 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} Syaiful Mukmin • Terima kasih sudah berkunjung 💜
      </motion.footer>
    </main>
  );
}
