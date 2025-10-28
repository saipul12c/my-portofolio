import { useState } from "react";
import { BookOpen, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const docsSections = [
  {
    title: "Pendahuluan",
    content: "Di sini kamu akan menemukan panduan dasar penggunaan platform kami. Mulai dari registrasi hingga fitur utama. 🌟",
  },
  {
    title: "Fitur Utama",
    content: "Penjelasan tentang fitur-fitur keren yang bisa kamu pakai setiap hari. 🚀 Dari Komitmen, FAQ, hingga interaksi komunitas.",
  },
  {
    title: "Tips & Trik",
    content: "Beberapa trik dan tips supaya pengalamanmu lebih maksimal. Misal shortcut, cara gabung grup, dan rahasia sukses komunitas. ✨",
  },
  {
    title: "Integrasi",
    content: "Cara menghubungkan platform ini dengan layanan lain. API, tools, atau plugin pihak ketiga. 🔌",
  },
];

export default function DocsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-800 dark:text-gray-100 flex flex-col items-center py-20 px-6">
      
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-12"
      >
        <div className="flex justify-center mb-4">
          <BookOpen className="text-blue-400 animate-pulse" size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Dokumentasi 📚
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Semua yang perlu kamu tahu tentang platform ini. Panduan, tips, dan integrasi dalam satu tempat.
        </p>
      </motion.div>

      <div className="w-full max-w-3xl space-y-4">
        {docsSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/70 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-md border border-blue-100/30 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex justify-between items-center p-4 text-left group"
            >
              <span className="text-lg font-medium text-blue-500 group-hover:text-purple-500 transition-colors">
                {section.title}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronDown size={20} className="text-blue-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4 text-gray-600 dark:text-gray-300"
                >
                  {section.content}
                  <Sparkles size={14} className="inline-block ml-1 text-yellow-400 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center"
      >
        <p>
          Dibuat dengan <span className="text-blue-400">💙</span> dan sedikit <span className="text-purple-400">✨ magic ✨</span> oleh tim yang peduli pengalaman pengguna.
        </p>
      </motion.footer>
    </div>
  );
}
