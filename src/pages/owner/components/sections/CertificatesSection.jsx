import React from "react";
import { Link } from "react-router-dom";
import { Award, ExternalLink, ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * CertificatesSection component - displays recent certificates with dark glassmorphism
 */
export const CertificatesSection = ({ certificates = [] }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Sertifikasi & Lisensi Resmi"
        description="Pengakuan kompetensi pedagogik, keahlian teknologi, dan pencapaian terverifikasi"
        icon={<Award className="w-5 h-5 text-amber-400" />}
        to="/certificates"
        linkText="Semua Sertifikat"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md font-bold text-base"
                  style={{ backgroundColor: cert.themeColor || "#f59e0b" }}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    {cert.year || "2023"}
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                {cert.title}
              </h4>
              <p className="text-xs text-cyan-400 font-medium mb-2">{cert.issuer}</p>
              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-3">
                {cert.description}
              </p>

              {cert.tags && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {cert.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">{cert.duration || "Tersertifikasi"}</span>
              {cert.urlCertificate ? (
                <a
                  href={cert.urlCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Lihat Kredensial</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  to="/certificates"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Verifikasi</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-center">
        <Link
          to="/certificates"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 text-xs sm:text-sm font-semibold border border-slate-700/60 hover:border-amber-500/40 transition-all group"
        >
          <span>Buka Arsip Lengkap Halaman /certificates</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
