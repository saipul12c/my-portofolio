import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

const ContactCTA = ({ info }) => {
  const handleContactClick = () => {
    console.log('Contact CTA clicked');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Tertarik Bekerja Sama dengan {info.name}?
        </h2>
        <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
          Hubungi perusahaan ini langsung untuk konsultasi proyek Anda. Dapatkan solusi terbaik dengan tim profesional yang berpengalaman.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactClick}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center"
          >
            <Phone size={20} />
            Hubungi Sekarang
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
          >
            <Mail size={20} />
            Kirim Email
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactCTA;