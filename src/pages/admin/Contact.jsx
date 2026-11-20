import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
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

  const headerAnim = useScrollReveal(0);
  const statsAnim = useScrollReveal(0.1);
  const formAnim = useScrollReveal(0.15);
  const contactAnim = useScrollReveal(0.2);

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 py-6 sm:py-10 bg-[#0f172a] text-white relative overflow-hidden">
      
      {/* Lightweight GPU-friendly background */}
      <BackgroundEffects />
      
      <ToastContainer 
        theme="dark" 
        position="bottom-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-10 lg:mb-12 max-w-5xl relative z-10 w-full px-2 sm:px-0">
        <motion.div {...headerAnim}>
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 shadow-sm">
            {SPARKLES_ICON}
            <span className="text-xs sm:text-sm font-medium text-cyan-400">
              Mari Berkolaborasi Bersama
            </span>
            {SPARKLES_ICON}
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hubungi Saya
            </span>
            <span className="ml-2 inline-block transform hover:scale-110 transition-transform cursor-default">
              💬
            </span>
          </h1>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6 max-w-2xl mx-auto">
            Mari wujudkan ide brilian Anda menjadi kenyataan — 
            <span className="block mt-1 font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Setiap kolaborasi dimulai dengan satu pesan ✨
            </span>
          </p>
        </motion.div>

        <ContactStats statsAnim={statsAnim} />
      </div>

      {/* Container Form & Data */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start relative z-10">
        <div className="w-full order-2 lg:order-1">
          <ContactList />
        </div>
        <div className="w-full order-1 lg:order-2">
          <ContactForm formAnim={formAnim} />
        </div>
      </div>

      {/* Social Links */}
      <SocialLinks contactAnim={contactAnim} />
    </main>
  );
}
