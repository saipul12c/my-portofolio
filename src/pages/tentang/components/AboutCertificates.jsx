// AboutCertificates.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Tambahkan ini

export default function AboutCertificates({ certificates }) {
  const [selectedCert, setSelectedCert] = useState(null);

  const navigateCert = (dir) => {
    if (!selectedCert) return;
    const idx = certificates.certificates.findIndex((c) => c.id === selectedCert.id);
    const nextIdx = (idx + dir + certificates.certificates.length) % certificates.certificates.length;
    setSelectedCert(certificates.certificates[nextIdx]);
  };

  return (
    <section>
      <motion.section
        className="mt-24 w-full max-w-6xl text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Judul Section yang Dapat Diklik */}
        <div className="block group mb-12 cursor-pointer">
          <Award className="w-12 h-12 text-pink-400 mx-auto mb-3 animate-pulse" />

          {/* ✅ Bungkus dengan Link */}
          <Link
            to="/certificates"
            className="inline-block"
          >
            <h3 className="text-3xl sm:text-4xl font-extrabold text-pink-400 group-hover:text-pink-300 transition duration-300 hover:underline">
              {certificates.sectionTitle}
            </h3>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {certificates.certificates.map((cert, i) => {
            // Palet warna tags/skills dengan text yang sesuai
            const tagColors = [
              { bg: "bg-white/90", text: "text-black" },
              { bg: "bg-blue-400", text: "text-black" },
              { bg: "bg-yellow-400", text: "text-black" },
            ];
            const getRandomTagColor = () => tagColors[Math.floor(Math.random() * tagColors.length)];

            // Palet warna level badge
            const levelColors = {
              Pemula: "bg-green-400 text-black",
              Menengah: "bg-yellow-400 text-black",
              Lanjutan: "bg-red-400 text-white",
            };

            return (
              <div
                key={i}
                onClick={() => setSelectedCert(cert)}
                className="relative bg-gradient-to-tr from-pink-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 hover:scale-105 hover:shadow-xl transition-transform cursor-pointer group"
              >
                <div className="flex items-center justify-center mb-3">
                  <img src={cert.organization.logo} alt={cert.organization.name} className="w-10 h-10 rounded-full" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{cert.name}</h4>
                <p className="text-gray-300 text-sm mb-2">{cert.organization.name}</p>

                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${levelColors[cert.level] || "bg-gray-400 text-black"}`}
                >
                  {cert.level}
                </span>

                <p className="text-gray-200 text-sm mt-2 line-clamp-3">{cert.description}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {cert.tags.map((tag, idx) => {
                    const color = getRandomTagColor();
                    return (
                      <span
                        key={idx}
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                      >
                        #{tag}
                      </span>
                    );
                  })}
                  {cert.skills?.map((skill, idx) => {
                    const color = getRandomTagColor();
                    return (
                      <span
                        key={idx + cert.tags.length}
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>

                <span className="text-pink-300 text-xs mt-3 inline-block group-hover:underline">
                  Lihat Detail →
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

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

              {certificates.length > 1 && (
                <>
                  <button
                    onClick={() => navigateCert(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-300"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={() => navigateCert(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-300"
                  >
                    &#8594;
                  </button>
                </>
              )}

              <div className="flex items-center justify-center mb-4">
                <img
                  src={selectedCert.organization.logo}
                  alt={selectedCert.organization.name}
                  className="w-12 h-12 rounded-full shadow-lg"
                />
              </div>

              <h4 className="text-2xl font-extrabold mb-1 text-pink-200">{selectedCert.name}</h4>
              <p className="text-gray-200 font-semibold mb-1">{selectedCert.organization.name}</p>
              <p className="text-gray-300 text-sm mb-2">
                {new Date(selectedCert.dateIssued).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className="inline-block text-black text-xs font-semibold px-4 py-1 rounded-full"
                  style={{ backgroundColor: selectedCert.ui.badgeColor }}
                >
                  {selectedCert.level}
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
                {(() => {
                  const tagColors = [
                    "bg-pink-400/80",
                    "bg-purple-400/80",
                    "bg-green-400/80",
                    "bg-blue-400/80",
                    "bg-yellow-400/80",
                    "bg-orange-400/80",
                  ];
                  const getRandomColor = () =>
                    tagColors[Math.floor(Math.random() * tagColors.length)];
                  return (
                    <>
                      {selectedCert.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`inline-block text-black text-xs font-bold px-3 py-1 rounded-full ${getRandomColor()}`}
                        >
                          #{tag}
                        </span>
                      ))}
                      {selectedCert.skills.map((skill, idx) => (
                        <span
                          key={idx + selectedCert.tags.length}
                          className={`inline-block text-black text-xs font-bold px-3 py-1 rounded-full ${getRandomColor()}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </>
                  );
                })()}
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCert.certificateLinks.certificate && (
                  <a
                    href={selectedCert.certificateLinks.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-pink-400 text-black font-bold px-5 py-2 rounded-full hover:bg-pink-500 transition duration-300 shadow-md"
                  >
                    Buka Sertifikat
                  </a>
                )}
                {selectedCert.certificateLinks.portfolio && (
                  <a
                    href={selectedCert.certificateLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-indigo-400 text-black font-bold px-5 py-2 rounded-full hover:bg-indigo-500 transition duration-300 shadow-md"
                  >
                    Portfolio
                  </a>
                )}
                {selectedCert.certificateLinks.video && (
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
