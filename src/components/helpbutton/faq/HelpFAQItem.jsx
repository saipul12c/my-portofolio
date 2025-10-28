import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Apa itu platform ini?",
    answer:
      "Ini adalah platform tempat kita berbagi pengetahuan, inspirasi, dan dukungan untuk mencapai tujuan bersama. 💖✨",
  },
  {
    question: "Bagaimana cara bergabung?",
    answer:
      "Klik tombol 'Gabung' di halaman utama, isi data singkat, dan mulai ikut komunitas kami. Mudah banget! 🚀",
  },
  {
    question: "Apakah gratis?",
    answer:
      "Ya! Semua fitur dasar bisa digunakan gratis. Ada beberapa fitur premium yang opsional, tapi bebas pilih kok 😉.",
  },
  {
    question: "Siapa yang bisa mengakses konten?",
    answer:
      "Siapapun bisa mengakses konten umum. Konten khusus anggota hanya untuk member terdaftar.",
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Kami menjaga privasi dengan serius. Data pribadi tidak akan dibagikan tanpa izin. 🔒",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-800 dark:text-gray-100 flex flex-col items-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
          FAQ 💬
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Temukan jawaban dari pertanyaan umum seputar platform kami. Kalau belum ketemu, bisa kontak tim support ya! ✨
        </p>
      </motion.div>

      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/70 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-md border border-cyan-100/30 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 text-left group"
            >
              <span className="text-lg font-medium text-cyan-500 group-hover:text-blue-500 transition-colors">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronDown size={20} className="text-cyan-400" />
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
                  {faq.answer}
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
          Dibuat dengan <span className="text-cyan-400">💙</span> oleh tim yang peduli pengalaman pengguna.
        </p>
      </motion.footer>
    </div>
  );
}
