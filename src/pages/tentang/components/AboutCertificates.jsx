// AboutCertificates.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom"; 

// Palet warna tags/skills dengan text yang sesuai
const tagColors = [
  { bg: "bg-white/90", text: "text-black" },
  { bg: "bg-blue-400", text: "text-black" },
  { bg: "bg-yellow-400", text: "text-black" },
];

const modalTagColors = [
  "bg-pink-400/80",
  "bg-purple-400/80",
  "bg-green-400/80",
  "bg-blue-400/80",
  "bg-yellow-400/80",
  "bg-orange-400/80",
];

// Palet warna level badge
const levelColors = {
  Pemula: "bg-green-400 text-black",
  Menengah: "bg-yellow-400 text-black",
  Lanjutan: "bg-red-400 text-white",
};

export default function AboutCertificates({ certificates }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const certList = certificates?.certificates || [];

  // State untuk menyimpan maksimal 3 kartu aktif
  const [displayedCerts, setDisplayedCerts] = useState(() => {
    return certList.slice(0, 3);
  });

  const activeSlotRef = useRef(0);
  const nextIndexRef = useRef(3);

  // Inisialisasi awal saat data certificates selesai dimuat
  useEffect(() => {
    if (certList.length > 0 && displayedCerts.length === 0) {
      setDisplayedCerts(certList.slice(0, 3));
      nextIndexRef.current = 3 % certList.length;
      activeSlotRef.current = 0;
    }
  }, [certList, displayedCerts.length]);

  // Rotasi: Hanya 1 kartu yang berganti setiap 2 detik secara bergiliran (slot 0 -> 1 -> 2 -> 0...)
  useEffect(() => {
    if (certList.length <= 3 || isHovered) return;

    const interval = setInterval(() => {
      setDisplayedCerts((prev) => {
        if (prev.length === 0) return certList.slice(0, 3);

        const slotToUpdate = activeSlotRef.current;
        const nextCert = certList[nextIndexRef.current % certList.length];

        // Majukan giliran cert dan slot berikutnya
        nextIndexRef.current = (nextIndexRef.current + 1) % certList.length;
        activeSlotRef.current = (activeSlotRef.current + 1) % 3;

        const updated = [...prev];
        updated[slotToUpdate] = nextCert;
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [certList, isHovered]);

  const navigateCert = (dir) => {
    if (!selectedCert || certList.length === 0) return;
    const idx = certList.findIndex((c) => c.id === selectedCert.id);
    const nextIdx = (idx + dir + certList.length) % certList.length;
    setSelectedCert(certList[nextIdx]);
  };

  const hoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 20px 40px rgba(236, 72, 153, 0.2)",
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
      {/* Header Section dengan Animasi sama seperti AboutCollaborations */}
      <motion.div
        className="flex flex-col items-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={headerVariants}
      >
        <Link to="/certificates" className="group block focus:outline-none">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-pink-400/20 blur-xl rounded-full"></div>
            <Award className="w-12 h-12 text-pink-400 relative z-10 p-2 bg-gray-900/80 rounded-2xl border border-pink-400/30 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-pink-400 group-hover:text-pink-300 transition duration-300">
            {certificates?.sectionTitle || "Sertifikat & Penghargaan"}
          </h3>
        </Link>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full my-3"></div>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Dokumentasi pencapaian, sertifikasi kompetensi, dan penghargaan profesional
        </p>
      </motion.div>

      {/* Grid Layout: Maksimal 3 kartu di mana 1 kartu berganti setiap 2 detik secara bergiliran */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[300px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayedCerts.map((cert, slotIndex) => (
          <div key={slotIndex} className="h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={cert?.id || `slot-${slotIndex}`}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover="hover"
                className="h-full"
              >
                <motion.div
                  onClick={() => setSelectedCert(cert)}
                  className="h-full flex flex-col justify-between relative bg-gradient-to-tr from-pink-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer group"
                  variants={hoverVariants}
                >
                  <div>
                    <div className="flex items-center justify-center mb-3">
                      <img
                        src={cert?.organization?.logo || cert?.image}
                        alt={cert?.organization?.name || cert?.issuer}
                        className="w-10 h-10 rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">{cert?.name || cert?.title}</h4>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-1">{cert?.organization?.name || cert?.issuer}</p>

                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${levelColors[cert?.level] || levelColors[cert?.difficulty] || "bg-gray-400 text-black"}`}
                    >
                      {cert?.level || cert?.difficulty}
                    </span>

                    <p className="text-gray-200 text-sm mt-2 line-clamp-3">{cert?.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {cert?.tags?.slice(0, 3).map((tag, idx) => {
                        const color = tagColors[(idx + slotIndex) % tagColors.length];
                        return (
                          <span
                            key={idx}
                            className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                          >
                            #{tag}
                          </span>
                        );
                      })}
                      {cert?.skills?.slice(0, 2).map((skill, idx) => {
                        const color = tagColors[(idx + (cert?.tags?.length || 0) + slotIndex) % tagColors.length];
                        return (
                          <span
                            key={idx + (cert?.tags?.length || 0)}
                            className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between">
                    <span className="text-pink-300 text-xs font-semibold group-hover:underline flex items-center gap-1">
                      Lihat Detail
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </span>
                    <span className="text-xs bg-pink-400/20 text-pink-300 px-2.5 py-0.5 rounded-full border border-pink-400/30">
                      {cert?.year || (cert?.dateIssued ? cert.dateIssued.split("-")[0] : "Sertifikat")}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer CTA Button */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to={certificates?.link || "/certificates"}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
        >
          <Award className="w-5 h-5" />
          Lihat Semua Sertifikat
          <ExternalLink className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Modal / Pop-Up dengan Navigasi */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={selectedCert.id}
              className="bg-gradient-to-br from-pink-700 via-purple-700 to-indigo-700 rounded-3xl p-6 max-w-lg w-full text-white relative shadow-2xl ring-1 ring-pink-500/30 overflow-y-auto max-h-[90vh]"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 text-white hover:text-pink-300"
              >
                <X className="w-6 h-6" />
              </button>

              {certList.length > 1 && (
                <>
                  <button
                    onClick={() => navigateCert(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-300 p-2 text-xl"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={() => navigateCert(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-300 p-2 text-xl"
                  >
                    &#8594;
                  </button>
                </>
              )}

              <div className="flex items-center justify-center mb-4">
                <img
                  src={selectedCert.organization?.logo || selectedCert.image}
                  alt={selectedCert.organization?.name || selectedCert.issuer}
                  className="w-12 h-12 rounded-full shadow-lg object-cover"
                  loading="lazy"
                />
              </div>

              <h4 className="text-2xl font-extrabold mb-1 text-pink-200">{selectedCert.name || selectedCert.title}</h4>
              <p className="text-gray-200 font-semibold mb-1">{selectedCert.organization?.name || selectedCert.issuer}</p>
              <p className="text-gray-300 text-sm mb-2">
                {selectedCert.dateIssued ? new Date(selectedCert.dateIssued).toLocaleDateString() : selectedCert.year}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className="inline-block text-black text-xs font-semibold px-4 py-1 rounded-full"
                  style={{ backgroundColor: selectedCert.ui?.badgeColor || selectedCert.themeColor || "#F59E0B" }}
                >
                  {selectedCert.level || selectedCert.difficulty}
                </span>
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedCert.status === "active"
                      ? "bg-green-500/60 text-black"
                      : "bg-gray-500/60 text-white"
                  }`}
                >
                  {selectedCert.status === "active" ? "Aktif" : "Expired"}
                </span>
                <span className="inline-block bg-purple-600/40 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedCert.category}
                </span>
              </div>

              <p className="text-white/90 mb-4">{selectedCert.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCert.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`inline-block text-black text-xs font-bold px-3 py-1 rounded-full ${modalTagColors[idx % modalTagColors.length]}`}
                  >
                    #{tag}
                  </span>
                ))}
                {selectedCert.skills?.map((skill, idx) => (
                  <span
                    key={idx + (selectedCert.tags?.length || 0)}
                    className={`inline-block text-black text-xs font-bold px-3 py-1 rounded-full ${modalTagColors[(idx + (selectedCert.tags?.length || 0)) % modalTagColors.length]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {(selectedCert.certificateLinks?.certificate || selectedCert.urlCertificate) && (
                  <a
                    href={selectedCert.certificateLinks?.certificate || selectedCert.urlCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-pink-400 text-black font-bold px-5 py-2 rounded-full hover:bg-pink-500 transition duration-300 shadow-md"
                  >
                    Buka Sertifikat
                  </a>
                )}
                {selectedCert.certificateLinks?.portfolio && (
                  <a
                    href={selectedCert.certificateLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-indigo-400 text-black font-bold px-5 py-2 rounded-full hover:bg-indigo-500 transition duration-300 shadow-md"
                  >
                    Portfolio
                  </a>
                )}
                {selectedCert.certificateLinks?.video && (
                  <a
                    href={selectedCert.certificateLinks.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-green-400 text-black font-bold px-5 py-2 rounded-full hover:bg-green-500 transition duration-300 shadow-md"
                  >
                    Video
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
