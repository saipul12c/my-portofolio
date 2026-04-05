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
    <main className="min-h-screen flex flex-col items-center justify-start px-3 sm:px-4 md:px-6 lg:px-8 xl:px-20 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 transition-all duration-500 relative overflow-hidden">
      
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
      <div className="text-center mb-8 sm:mb-12 lg:mb-16 max-w-6xl relative z-10 w-full px-2 sm:px-0">
        <motion.div
          {...titleAnim}
          className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 shadow-lg"
        >
          {SPARKLES_ICON}
          <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">
            Mari Berkolaborasi Bersama
          </span>
          {SPARKLES_ICON}
        </motion.div>

        <motion.h1
          {...titleAnim}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hubungi Saya
          </span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="ml-2 sm:ml-4 inline-block"
          >
            💬
          </motion.span>
        </motion.h1>

        <motion.p
          {...descAnim}
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-4xl mx-auto"
        >
          Mari wujudkan ide brilian Anda menjadi kenyataan — 
          <span className="block mt-2 sm:mt-3 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Setiap kolaborasi dimulai dengan satu pesan ✨
          </span>
        </motion.p>

        <ContactStats statsAnim={statsAnim} />
      </div>

      {/* 📮 Enhanced Container Form & Data */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start relative z-10 px-0">
        <div className="w-full order-2 lg:order-1">
          <ContactList />
        </div>
        <div className="w-full order-1 lg:order-2">
          <ContactForm formAnim={formAnim} />
        </div>
      </div>

      <SocialLinks contactAnim={contactAnim} />
    </main>
  );
}