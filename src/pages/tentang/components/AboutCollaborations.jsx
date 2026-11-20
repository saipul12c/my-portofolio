// AboutCollaborations.jsx
import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ExternalLink, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

function AboutCollaborations({ collabs }) {
  const [isHovered, setIsHovered] = useState(false);

  const partners = useMemo(() => {
    return collabs?.partners || [];
  }, [collabs]);

  // State untuk menyimpan 3 slot partner aktif
  const [displayedPartners, setDisplayedPartners] = useState(() => {
    return partners.slice(0, 3);
  });

  const activeSlotRef = useRef(0);
  const nextIndexRef = useRef(3);

  useEffect(() => {
    setDisplayedPartners(partners.slice(0, 3));
    activeSlotRef.current = 0;
    nextIndexRef.current = 3 % Math.max(1, partners.length);
  }, [partners]);

  // Rotasi: Hanya 1 kartu yang berganti setiap 3 detik secara bergiliran (slot 0 -> 1 -> 2 -> 0...)
  useEffect(() => {
    if (partners.length <= 3 || isHovered) return;

    const interval = setInterval(() => {
      setDisplayedPartners((prev) => {
        if (!prev || prev.length === 0) return partners.slice(0, 3);

        const slotToUpdate = activeSlotRef.current % prev.length;
        const nextPartner = partners[nextIndexRef.current % partners.length];

        nextIndexRef.current = (nextIndexRef.current + 1) % partners.length;
        activeSlotRef.current = (activeSlotRef.current + 1) % prev.length;

        const updated = [...prev];
        updated[slotToUpdate] = nextPartner;
        return updated;
      });
    }, 3000); // ⏱️ Tepat setiap 3 detik sekali

    return () => clearInterval(interval);
  }, [partners, isHovered]);

  return (
    <section className="mt-28 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative inline-block mb-3">
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
          <div className="relative z-10 p-3 bg-[#111c34]/90 rounded-2xl border border-cyan-400/30 shadow-lg shadow-cyan-950/20">
            <Users className="w-8 h-8 text-cyan-300" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
          {collabs?.sectionTitle || "Pernah Bekerja Sama Dengan"}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full my-3" />
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Mitra strategis, institusi pendidikan, dan kolaborator yang telah mempercayakan pengembangannya
        </p>
      </div>

      {/* Grid: 3 Kartu berganti satu per satu setiap 3 detik */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left items-stretch min-h-[250px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayedPartners.map((partner, slotIndex) => {
          if (!partner) return null;

          return (
            <div key={`partner-slot-${slotIndex}`} className="h-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-full"
                >
                  <Link
                    to={partner?.id ? `/testimoni/${partner.id}` : (collabs?.link || "/testimoni")}
                    className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-3xl"
                  >
                    <div className="h-full flex flex-col justify-between bg-[#111c34]/60 hover:bg-[#132242]/90 backdrop-blur-xl border border-blue-900/40 hover:border-cyan-400/40 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 group-hover:-translate-y-1">
                      <div>
                        {/* Rating & Badge Header */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-amber-300 text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{partner?.rating || "5.0"}</span>
                          </div>

                          <span className="text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                            Mitra Kerja
                          </span>
                        </div>

                        {/* Partner Title */}
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1">
                          {partner?.name}
                        </h3>
                        {partner?.company && partner?.company !== partner?.name && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                            {partner.company}
                          </p>
                        )}

                        {/* Project Tag */}
                        {partner?.project && (
                          <div className="mb-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 font-medium flex items-start gap-1.5">
                            <span className="shrink-0 text-xs">💼</span>
                            <span className="leading-snug">
                              {partner.project}
                            </span>
                          </div>
                        )}

                        {/* Description Quote */}
                        <div className="relative text-sm text-slate-300 font-normal leading-relaxed mb-4">
                          <Quote className="w-4 h-4 text-cyan-400/30 inline-block mr-1 rotate-180 align-baseline" />
                          {partner?.desc}
                        </div>
                      </div>

                      {/* Bottom CTA */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <span className="group-hover:underline underline-offset-4">
                          Lihat Ulasan Lengkap
                        </span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-10">
        <Link
          to={collabs?.link || "/testimoni"}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-95 text-slate-950 font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <Users className="w-5 h-5" />
          Lihat Semua Portofolio Kolaborasi
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}

export default memo(AboutCollaborations);
