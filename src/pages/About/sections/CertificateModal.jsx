import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CertificateModal({ selectedCert, setSelectedCert, certificates }) {
  if (!selectedCert) return null;

  return (
    <AnimatePresence>
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
          <button onClick={() => setSelectedCert(null)} className="absolute top-4 right-4 text-white hover:text-pink-300">
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <img src={selectedCert.organization.logo} alt={selectedCert.organization.name} className="w-12 h-12 rounded-full shadow-lg" />
          </div>

          <h4 className="text-2xl font-extrabold mb-1 text-pink-200">{selectedCert.name}</h4>
          <p className="text-gray-200 font-semibold mb-1">{selectedCert.organization.name}</p>
          <p className="text-gray-300 text-sm mb-2">{new Date(selectedCert.dateIssued).toLocaleDateString()}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="inline-block text-black text-xs font-semibold px-4 py-1 rounded-full"
              style={{ backgroundColor: selectedCert.ui.badgeColor }}
            >
              {selectedCert.level}
            </span>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
              selectedCert.status === "active"
                ? "bg-green-500/60 text-black"
                : "bg-gray-500/60 text-white"
            }`}>
              {selectedCert.status === "active" ? "Aktif" : "Expired"}
            </span>
            <span className="inline-block bg-purple-600/40 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {selectedCert.category}
            </span>
          </div>

          <p className="text-white/90 mb-4">{selectedCert.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {selectedCert.tags.concat(selectedCert.skills || []).map((item, idx) => (
              <span
                key={idx}
                className="inline-block text-black text-xs font-bold px-3 py-1 rounded-full bg-pink-400/80"
              >
                #{item}
              </span>
            ))}
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
    </AnimatePresence>
  );
}
