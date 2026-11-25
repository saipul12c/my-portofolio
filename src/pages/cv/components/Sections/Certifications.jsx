import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, ArrowRight, Play, ExternalLink, CheckCircle2 } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';
import fallbackCertificatesData from '../../../../data/sertif/certificates.json';

const VISIBLE_COUNT = 2;
const ROTATE_INTERVAL = 2000; // 2 detik sekali

const Certifications = ({ certificates = [] }) => {
  const allCerts = useMemo(() => (
    certificates && certificates.length > 0
      ? certificates
      : (fallbackCertificatesData.certificates || [])
  ), [certificates]);

  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Interval rotasi dinamis setiap 2 detik
  useEffect(() => {
    if (!allCerts || allCerts.length <= VISIBLE_COUNT || isPaused) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allCerts.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [allCerts, isPaused]);

  // Ambil window 2 sertifikat yang sedang aktif
  const visibleCertificates = useMemo(() => {
    if (!allCerts || allCerts.length === 0) return [];
    if (allCerts.length <= VISIBLE_COUNT) return allCerts;

    const items = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const idx = (startIndex + i) % allCerts.length;
      items.push(allCerts[idx]);
    }
    return items;
  }, [allCerts, startIndex]);

  return (
    <SectionWrapper>
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Certifications
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allCerts.length > VISIBLE_COUNT && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                title={isPaused ? "Lanjutkan rotasi otomatis" : "Jeda rotasi otomatis"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-300">Paused</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Live 2s</span>
                  </>
                )}
              </button>
            )}

            <Link 
              to="/certificates"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1 transition-colors group"
            >
              View All 
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Dynamic Certifications List */}
        <div className="space-y-3.5 relative overflow-hidden min-h-[220px]">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleCertificates.map((cert) => (
              <motion.div
                key={cert.id || cert.title}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="group p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                        {cert.title}
                      </h3>
                      {cert.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex-shrink-0 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 text-xs font-medium truncate mb-2">
                      {cert.issuer}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">{cert.year}</span>
                        {cert.category && (
                          <span className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                            {cert.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {cert.difficulty && cert.difficulty !== "N/A" && (
                          <span className="text-[10px] font-medium text-blue-300 bg-blue-950/60 border border-blue-500/20 px-2 py-0.5 rounded-full">
                            {cert.difficulty}
                          </span>
                        )}
                        {cert.urlCertificate && (
                          <a
                            href={cert.urlCertificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-cyan-400 transition-colors p-1"
                            title="Buka sertifikat"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer info rotasi */}
        {allCerts.length > VISIBLE_COUNT && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Berganti tiap 2 detik ({((startIndex) % allCerts.length) + 1}/{allCerts.length})
            </span>
            <span className="text-gray-500 text-[10px]">
              {isPaused ? "Klik untuk lanjut" : "Hover untuk jeda"}
            </span>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Certifications;