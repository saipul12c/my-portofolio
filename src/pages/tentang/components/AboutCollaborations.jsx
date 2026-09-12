// AboutCollaborations.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCollaborations({ collabs }) {
  const [isHovered, setIsHovered] = useState(false);
  const partners = collabs?.partners || [];

  // State untuk menyimpan 3 kartu aktif
  const [displayedPartners, setDisplayedPartners] = useState(() => {
    return partners.slice(0, 3);
  });

  const activeSlotRef = useRef(0);
  const nextIndexRef = useRef(3);

  // Inisialisasi awal saat data partners selesai dimuat
  useEffect(() => {
    if (partners.length > 0 && displayedPartners.length === 0) {
      setDisplayedPartners(partners.slice(0, 3));
      nextIndexRef.current = 3 % partners.length;
      activeSlotRef.current = 0;
    }
  }, [partners, displayedPartners.length]);

  // Rotasi: Hanya 1 kartu yang berganti setiap 2 detik secara bergiliran (slot 0 -> 1 -> 2 -> 0...)
  useEffect(() => {
    if (partners.length <= 3 || isHovered) return;

    const interval = setInterval(() => {
      setDisplayedPartners((prev) => {
        if (prev.length === 0) return partners.slice(0, 3);

        const slotToUpdate = activeSlotRef.current;
        const nextPartner = partners[nextIndexRef.current % partners.length];

        // Majukan giliran partner dan slot berikutnya
        nextIndexRef.current = (nextIndexRef.current + 1) % partners.length;
        activeSlotRef.current = (activeSlotRef.current + 1) % 3;

        const updated = [...prev];
        updated[slotToUpdate] = nextPartner;
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [partners, isHovered]);

  const hoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 20px 40px rgba(0, 255, 255, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="mt-24 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Header Section */}
      <motion.div
        className="flex flex-col items-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={headerVariants}
      >
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
          <Users className="w-12 h-12 text-cyan-300 relative z-10 p-2 bg-gray-900/80 rounded-2xl border border-cyan-400/30" />
        </div>
        
        <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          {collabs?.sectionTitle || "Pernah Bekerja Sama Dengan"}
        </h3>
        
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mb-2"></div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Partner terpercaya yang telah membangun kesuksesan bersama kami
        </p>
      </motion.div>

      {/* Grid Layout: 3 kartu di mana hanya 1 kartu yang berganti setiap 2 detik */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[250px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayedPartners.map((partner, slotIndex) => (
          <div key={slotIndex} className="h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={partner?.id || `slot-${slotIndex}`}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover="hover"
                className="h-full"
              >
                <Link
                  to={partner?.id ? `/testimoni/${partner.id}` : (collabs?.link || "/testimoni")}
                  className="group block h-full focus:outline-none"
                >
                  <motion.div
                    className="h-full flex flex-col justify-between bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 relative overflow-hidden"
                    variants={hoverVariants}
                  >
                    {/* Background Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-bl-2xl transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-300"></div>
                    
                    {/* Top content */}
                    <div>
                      {/* Partner Header */}
                      <div className="flex items-start justify-between mb-3 relative z-10 text-left">
                        <div className="flex-1 pr-2">
                          <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1">
                            {partner?.name}
                          </h4>
                          {partner?.company && partner?.company !== partner?.name && (
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                              {partner.company}
                            </p>
                          )}
                        </div>
                        
                        {/* External Link Icon */}
                        <ExternalLink className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" />
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 leading-relaxed mb-6 relative z-10 line-clamp-3 text-sm text-left font-light">
                        {partner?.desc}
                      </p>
                    </div>

                    {/* Bottom Enhanced CTA */}
                    <div className="flex items-center justify-between relative z-10 pt-2 border-t border-white/5">
                      <span className="text-cyan-300 text-sm font-semibold group-hover:underline underline-offset-4 flex items-center gap-2">
                        Lihat Testimoni
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </span>
                      
                      {/* Partnership Badge */}
                      <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-400/30 font-medium">
                        Partner
                      </span>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400/0 to-blue-400/0 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-500 opacity-0 group-hover:opacity-100 -m-0.5 pointer-events-none"></div>
                  </motion.div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to={collabs?.link || "/testimoni"}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
        >
          <Users className="w-5 h-5" />
          Lihat Semua Kolaborasi
          <ExternalLink className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}