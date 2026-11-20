// AboutCertificates.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  X,
  Calendar,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const levelColors = {
  Pemula: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Beginner: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Menengah: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Intermediate: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Lanjutan: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Advanced: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

function AboutCertificates({ certificates }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isHovered, setIsHovered] = useState(false);

  const certList = useMemo(() => {
    return certificates?.certificates || [];
  }, [certificates]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(["Semua"]);
    certList.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats);
  }, [certList]);

  // Filtered certificates
  const filteredCerts = useMemo(() => {
    if (selectedCategory === "Semua") return certList;
    return certList.filter((c) => c.category === selectedCategory);
  }, [certList, selectedCategory]);

  // State untuk 3 slot kartu aktif
  const [displayedCerts, setDisplayedCerts] = useState(() => {
    return filteredCerts.slice(0, 3);
  });

  const activeSlotRef = useRef(0);
  const nextIndexRef = useRef(3);

  // Sinkronkan saat filter kategori berubah
  useEffect(() => {
    setDisplayedCerts(filteredCerts.slice(0, 3));
    activeSlotRef.current = 0;
    nextIndexRef.current = 3 % Math.max(1, filteredCerts.length);
  }, [filteredCerts]);

  // Rotasi: 1 kartu berganti setiap 3 detik secara bergiliran (slot 0 -> 1 -> 2 -> 0...)
  useEffect(() => {
    if (filteredCerts.length <= 3 || isHovered) return;

    const interval = setInterval(() => {
      setDisplayedCerts((prev) => {
        if (!prev || prev.length === 0) return filteredCerts.slice(0, 3);

        const slotToUpdate = activeSlotRef.current % prev.length;
        const nextCert = filteredCerts[nextIndexRef.current % filteredCerts.length];

        nextIndexRef.current = (nextIndexRef.current + 1) % filteredCerts.length;
        activeSlotRef.current = (activeSlotRef.current + 1) % prev.length;

        const updated = [...prev];
        updated[slotToUpdate] = nextCert;
        return updated;
      });
    }, 3000); // ⏱️ Tepat setiap 3 detik sekali

    return () => clearInterval(interval);
  }, [filteredCerts, isHovered]);

  // Modal navigation
  useEffect(() => {
    if (!selectedCert) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      } else if (e.key === "ArrowLeft") {
        const idx = certList.findIndex((c) => c.id === selectedCert.id);
        if (idx !== -1) {
          const prevIdx = (idx - 1 + certList.length) % certList.length;
          setSelectedCert(certList[prevIdx]);
        }
      } else if (e.key === "ArrowRight") {
        const idx = certList.findIndex((c) => c.id === selectedCert.id);
        if (idx !== -1) {
          const nextIdx = (idx + 1) % certList.length;
          setSelectedCert(certList[nextIdx]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCert, certList]);

  return (
    <section className="mt-28 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative inline-block mb-3">
          <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full" />
          <div className="relative z-10 p-3 bg-[#111c34]/90 rounded-2xl border border-pink-500/30 shadow-lg shadow-pink-950/20">
            <Award className="w-8 h-8 text-pink-400" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">
          {certificates?.sectionTitle || "Sertifikat & Penghargaan"}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full my-3" />
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Dokumentasi sertifikasi kompetensi, pelatihan resmi, dan pencapaian profesional
        </p>

        {/* Category Filter Chips */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/25"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid: 3 Kartu berganti satu per satu setiap 3 detik */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left items-stretch min-h-[300px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayedCerts.map((cert, slotIndex) => {
          if (!cert) return null;
          const levelBadgeStyle =
            levelColors[cert?.level] ||
            levelColors[cert?.difficulty] ||
            "bg-slate-800 text-slate-300 border-slate-700";

          return (
            <div key={`cert-slot-${slotIndex}`} className="h-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  onClick={() => setSelectedCert(cert)}
                  className="group relative flex flex-col justify-between h-full bg-[#111c34]/60 hover:bg-[#132242]/90 backdrop-blur-xl border border-blue-900/40 hover:border-pink-500/40 rounded-3xl p-6 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300"
                >
                  <div>
                    {/* Top Organization Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          {cert?.organization?.logo || cert?.image ? (
                            <img
                              src={cert?.organization?.logo || cert?.image}
                              alt={cert?.organization?.name || cert?.issuer}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Award className="w-6 h-6 text-pink-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 line-clamp-1">
                            {cert?.organization?.name || cert?.issuer}
                          </p>
                          <span
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${levelBadgeStyle}`}
                          >
                            {cert?.level || cert?.difficulty || "Sertifikasi"}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                        {cert?.year || (cert?.dateIssued ? cert.dateIssued.split("-")[0] : "2024")}
                      </span>
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 mb-2">
                      {cert?.name || cert?.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4 font-normal">
                      {cert?.description}
                    </p>

                    {/* Skills / Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(cert?.tags || cert?.skills || []).slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-pink-400 group-hover:text-pink-300 transition-colors">
                    <span className="flex items-center gap-1">Lihat Detail Kredensial</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-10">
        <Link
          to={certificates?.link || "/certificates"}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-pink-500/20 active:scale-95"
        >
          <Award className="w-5 h-5" />
          Lihat Semua ({certList.length}) Sertifikat
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d1629] border border-pink-500/30 rounded-3xl p-6 sm:p-8 text-left text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  {selectedCert.organization?.logo || selectedCert.image ? (
                    <img
                      src={selectedCert.organization?.logo || selectedCert.image}
                      alt={selectedCert.organization?.name || selectedCert.issuer}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Award className="w-8 h-8 text-pink-400" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                    {selectedCert.category || "Sertifikat Resmi"}
                  </span>
                  <h3 id="cert-modal-title" className="text-xl font-extrabold text-white leading-tight">
                    {selectedCert.name || selectedCert.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedCert.organization?.name || selectedCert.issuer}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {selectedCert.level || selectedCert.difficulty || "Kompetensi"}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                </span>
                {selectedCert.year && (
                  <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {selectedCert.year}
                  </span>
                )}
              </div>

              <div className="bg-[#091122]/80 p-4 rounded-2xl border border-white/10 mb-5 text-sm text-slate-300 leading-relaxed font-normal">
                {selectedCert.description}
              </div>

              {(selectedCert.tags || selectedCert.skills) && (
                <div className="mb-6">
                  <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">
                    Keahlian Terkait
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...(selectedCert.tags || []), ...(selectedCert.skills || [])].map(
                      (skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10">
                {(selectedCert.certificateLinks?.certificate || selectedCert.urlCertificate) && (
                  <a
                    href={selectedCert.certificateLinks?.certificate || selectedCert.urlCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm transition-all shadow-md"
                  >
                    Buka Sertifikat Asli
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default memo(AboutCertificates);
