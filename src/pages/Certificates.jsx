"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { X, Search } from "lucide-react";

const certificates = [
  {
    id: 1,
    title: "Front-End Web Development",
    issuer: "Dicoding Indonesia",
    year: "2024",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1581093588401-22d3a4f3a1c3?w=800",
    urlCertificate: "https://www.dicoding.com/certificates/URL-CONTOH-1",
    description:
      "Menyelesaikan pelatihan pengembangan web front-end menggunakan React, JavaScript, dan Tailwind.",
    tags: ["React", "JavaScript", "TailwindCSS"],
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    issuer: "Google Indonesia",
    year: "2023",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1604147706283-d7110b38c7f7?w=800",
    urlCertificate: "https://www.google.com/certificates/URL-CONTOH-2",
    description:
      "Pelatihan intensif dalam prinsip desain antarmuka dan prototyping menggunakan Figma.",
    tags: ["Figma", "Desain Produk", "User Research"],
  },
  {
    id: 3,
    title: "EduTech Innovator Award",
    issuer: "Kemdikbud",
    year: "2025",
    category: "Award & Recognition",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800",
    urlCertificate: "https://kemdikbud.go.id/award/URL-CONTOH-3",
    description:
      "Penghargaan nasional untuk kontribusi dalam pengembangan media pembelajaran digital interaktif.",
    tags: ["Inovasi", "EdTech", "Penghargaan"],
  },
  {
    id: 4,
    title: "Project Management Professional (PMP)",
    issuer: "PMI Institute",
    year: "2024",
    category: "Management",
    image: "https://images.unsplash.com/photo-1581091870622-1d4cbf3a52c8?w=800",
    urlCertificate: "https://pmi.org/certificates/URL-CONTOH-4",
    description:
      "Menekankan pendekatan agile dan waterfall dalam manajemen proyek profesional bersertifikat.",
    tags: ["Manajemen Proyek", "Leadership", "Agile"],
  },
];

// ✅ fallback color logic aman
const tagColors = [
  "bg-pink-600/30 text-pink-300",
  "bg-violet-600/30 text-violet-300",
  "bg-emerald-600/30 text-emerald-300",
  "bg-amber-600/30 text-amber-300",
  "bg-sky-600/30 text-sky-300",
];

const cardAnim = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0 },
};

export default function Certificates() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...new Set(certificates.map((c) => c.category))];

  // ✅ Callback supaya event listener tidak leak
  const closePopup = useCallback(() => setSelected(null), []);

  // ✅ Prevent scroll saat popup
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
  }, [selected]);

  // ✅ ESC close popup with cleanup
  useEffect(() => {
    const escClose = (e) => e.key === "Escape" && closePopup();
    window.addEventListener("keydown", escClose);
    return () => window.removeEventListener("keydown", escClose);
  }, [closePopup]);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "All" || cert.category === filterCategory)
  );

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white py-24 px-6 flex flex-col items-center select-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg">
          Sertifikat & Penghargaan
        </h1>
        <p className="text-gray-300 mt-3 max-w-2xl">
          Koleksi profesional kredibel dan dapat diverifikasi langsung.
        </p>
      </motion.div>

      {/* ✅ Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 w-full max-w-3xl mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Cari sertifikat..."
            aria-label="Search certificates"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 px-10 py-3 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        <select
          aria-label="Filter by category"
          className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl cursor-pointer focus:ring-2 focus:ring-cyan-400 outline-none"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={cat + i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ GRID */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.12 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl"
      >
        {filteredCertificates.map((cert) => (
          <motion.article
            key={cert.id}
            variants={cardAnim}
            whileHover={{ scale: 1.07 }}
            className="bg-white/5 border border-white/10 rounded-3xl shadow-lg overflow-hidden hover:shadow-cyan-500/20 backdrop-blur-xl transition"
          >
            <a
              href={cert.urlCertificate}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${cert.title} certificate`}
            >
              <img
                src={cert.image}
                alt={cert.title}
                loading="lazy"
                onError={(e) => (e.target.src = "https://via.placeholder.com/350x200?text=No+Image")}
                className="w-full h-56 object-cover cursor-pointer hover:brightness-110 transition"
              />
            </a>

            <div className="p-6 cursor-pointer" onClick={() => setSelected(cert)}>
              <h3 className="text-xl font-bold text-cyan-300">{cert.title}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {cert.issuer} · {cert.year}
              </p>

              <div className="flex gap-2 flex-wrap mt-3">
                {cert.tags.map((tag, i) => (
                  <span
                    key={`${tag}-${cert.id}-${i}`}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${tagColors[(i + cert.id) % tagColors.length]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* ✅ MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141c2c] rounded-3xl overflow-hidden shadow-[0_0_40px_-5px_cyan] max-w-md w-full relative"
            >
              <button
                onClick={closePopup}
                aria-label="Close popup"
                className="absolute top-3 right-3 bg-black/40 rounded-full p-1 hover:bg-black/60"
              >
                <X size={22} />
              </button>

              <a href={selected.urlCertificate} target="_blank" rel="noopener noreferrer">
                <img
                  src={selected.image}
                  alt={selected.title}
                  loading="lazy"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/350x200?text=No+Image")}
                  className="w-full h-80 object-cover cursor-pointer hover:brightness-110 transition"
                />
              </a>

              <div className="p-6 max-h-72 overflow-y-auto">
                <h2 className="text-2xl font-bold">{selected.title}</h2>
                <p className="text-gray-400 text-sm">{selected.issuer} · {selected.year}</p>

                <p className="text-gray-200 mt-4 leading-relaxed">
                  {selected.description}
                </p>

                <div className="flex gap-2 flex-wrap mt-4">
                  {selected.tags.map((tag, i) => (
                    <span
                      key={`${tag}-${selected.id}-${i}`}
                      className={`px-3 py-1 text-xs rounded-full ${tagColors[(i + selected.id) % tagColors.length]} border border-white/10`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
