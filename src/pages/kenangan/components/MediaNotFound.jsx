import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Reusable NotFound component for consistent error pages
 * @param {Object} props
 * @param {string} props.type - Type of media (Media, Foto, Video, etc.)
 * @param {string} props.backLink - Link to go back
 * @param {string} props.message - Optional custom message
 */
export default function MediaNotFound({ 
  type = 'Media', 
  backLink = '/gallery',
  message 
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[var(--color-gray-900)] via-[#111827] to-[#020617]">
      <motion.div 
        className="max-w-xl w-full bg-[#0f1724] p-6 sm:p-8 rounded-2xl text-center border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto mb-4" />
        </motion.div>
        
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">
          {type} Tidak Ditemukan
        </h2>
        
        <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
          {message || `${type} yang Anda cari tidak tersedia atau telah dihapus.`}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to={backLink}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 rounded-lg transition-all duration-300 text-sm font-medium"
          >
            ← Kembali ke Gallery
          </Link>
          
          <Link 
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-all duration-300 text-sm font-medium"
          >
            <Home size={18} />
            Halaman Utama
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
