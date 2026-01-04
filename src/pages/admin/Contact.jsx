import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { Zap } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Maintenance from "../errors/Maintenance";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import ContactStats from "./components/ContactStats";
import SocialLinks from "./components/SocialLinks";
import BackgroundEffects from "./components/BackgroundEffects";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { SPARKLES_ICON } from "./utils/constants";

export default function Contact() {
  const isMaintenance = false;

  const titleAnim = useScrollReveal(0);
  const descAnim = useScrollReveal(0.3);
  const statsAnim = useScrollReveal(0.5);
  const formAnim = useScrollReveal(0.4);
  const contactAnim = useScrollReveal(0.6);

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-20 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 transition-all duration-500 relative overflow-hidden">
      
      <BackgroundEffects />
      
      <ToastContainer 
        theme="colored" 
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {/* 🌟 Enhanced Header Section */}
      <div className="text-center mb-16 max-w-6xl relative z-10">
        <motion.div
          {...titleAnim}
          className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg"
        >
          {SPARKLES_ICON}
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Mari Berkolaborasi Bersama
          </span>
          {SPARKLES_ICON}
        </motion.div>

        <motion.h1
          {...titleAnim}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hubungi Saya
          </span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="ml-4 inline-block"
          >
            💬
          </motion.span>
        </motion.h1>

        <motion.p
          {...descAnim}
          className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-4xl mx-auto"
        >
          Mari wujudkan ide brilian Anda menjadi kenyataan — 
          <span className="block mt-3 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Setiap kolaborasi dimulai dengan satu pesan ✨
          </span>
        </motion.p>

        <ContactStats statsAnim={statsAnim} />
      </div>

      {/* 📮 Enhanced Container Form & Data */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start relative z-10">
        <div className="w-full">
          <ContactList />
        </div>
        <div className="w-full">
          <ContactForm formAnim={formAnim} />
        </div>
      </div>

      <SocialLinks contactAnim={contactAnim} />

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:shadow-3xl transition-all duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Zap size={24} />
      </motion.button>
    </main>
  );
}