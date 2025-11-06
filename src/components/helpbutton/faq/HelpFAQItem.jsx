import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import faqsData from "./data/faqs.json"; // <== pastikan path sesuai struktur folder kamu

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);

  // Load data dari JSON
  useEffect(() => {
    setFaqs(faqsData);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-800 dark:text-gray-100 flex flex-col items-center py-20 px-6">
      {/* Header Section */}
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
          Jawaban dari pertanyaan paling sering muncul tentang{" "}
          <span className="text-cyan-500 font-semibold">
            Muhammad Syaiful Mukmin
          </span>
          . Kalau belum nemu jawabannya, boleh kontak langsung ya! ✨
        </p>
      </motion.div>

      {/* FAQ List */}
      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
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

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center"
      >
        <p>
          Dibuat dengan <span className="text-cyan-400">💙</span> oleh{" "}
          <strong>Muhammad Syaiful Mukmin</strong> — calon pendidik kreatif.
        </p>
      </motion.footer>
    </div>
  );
}
