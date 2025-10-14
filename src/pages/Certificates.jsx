import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const certificates = [
  {
    id: 1,
    title: "Front-End Web Development",
    issuer: "Dicoding Indonesia",
    year: "2024",
    image: "https://images.unsplash.com/photo-1581093588401-22d3a4f3a1c3?w=800",
    description:
      "Menyelesaikan pelatihan pengembangan web front-end menggunakan React, JavaScript, dan Tailwind. Sertifikasi ini menekankan praktik terbaik dalam UI/UX modern dan performa aplikasi web.",
    tags: ["React", "JavaScript", "TailwindCSS"],
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    issuer: "Google Indonesia",
    year: "2023",
    image: "https://images.unsplash.com/photo-1604147706283-d7110b38c7f7?w=800",
    description:
      "Pelatihan intensif dalam prinsip desain antarmuka, user flow, dan prototyping menggunakan Figma. Fokus pada desain berbasis pengguna dan usability testing.",
    tags: ["Figma", "Desain Produk", "User Research"],
  },
  {
    id: 3,
    title: "EduTech Innovator Award",
    issuer: "Kemdikbud",
    year: "2025",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800",
    description:
      "Penghargaan nasional untuk kontribusi dalam pengembangan media pembelajaran digital interaktif di bidang pendidikan vokasi dan literasi digital.",
    tags: ["Inovasi", "EdTech", "Penghargaan"],
  },
  {
    id: 4,
    title: "Project Management Professional (PMP)",
    issuer: "PMI Institute",
    year: "2024",
    image: "https://images.unsplash.com/photo-1581091870622-1d4cbf3a52c8?w=800",
    description:
      "Sertifikasi profesional dalam manajemen proyek dengan pendekatan agile dan waterfall. Dapat mengelola tim lintas disiplin dan memastikan keberhasilan proyek end-to-end.",
    tags: ["Manajemen Proyek", "Leadership", "Agile"],
  },
];

export default function Certificates() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-start px-6 py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">Sertifikat</h1>
        <p className="text-gray-300 text-lg">
          Berikut daftar sertifikat dan penghargaan profesional yang telah
          diraih sebagai bentuk dedikasi terhadap pembelajaran dan inovasi.
        </p>
      </motion.div>

      {/* Certificate Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
      >
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            whileHover={{ scale: 1.05, rotate: 0.5 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:shadow-cyan-500/30 backdrop-blur-md"
            onClick={() => setSelected(cert)}
          >
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-1">
                {cert.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {cert.issuer} · {cert.year}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {cert.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-cyan-600/20 text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Popup Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-56 object-cover rounded-xl mb-5"
              />
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                {selected.title}
              </h2>
              <p className="text-gray-400 text-sm mb-1">
                {selected.issuer} — {selected.year}
              </p>
              <p className="text-gray-300 mt-4 leading-relaxed">
                {selected.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {selected.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-cyan-600/30 text-cyan-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
