import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

const ContactCTA = ({ info }) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 mt-12 shadow-2xl text-center"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
          Tertarik Bekerja Sama dengan {info.name}?
        </h2>
        <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
          Konsultasikan kebutuhan proyek Anda dan bangun solusi digital berkualitas tinggi bersama tim yang berpengalaman.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactClick}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 justify-center text-sm sm:text-base"
          >
            <Phone size={18} />
            Hubungi Sekarang
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactClick}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-sm sm:text-base"
          >
            <Mail size={18} />
            Kirim Pesan
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactCTA;
