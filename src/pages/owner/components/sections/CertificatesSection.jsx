import React from "react";
import { Award } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * CertificatesSection component - displays recent certificates
 */
export const CertificatesSection = ({ certificates }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Sertifikat & Prestasi"
        description="Pengakuan kompetensi dan pencapaian profesional"
        icon={<Award className="w-8 h-8 text-amber-500" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map(cert => (
          <a key={cert.id} 
             href={cert.urlCertificate}
             target="_blank"
             rel="noopener noreferrer"
             className="group block">
            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                          rounded-xl p-5 hover:border-amber-300 transition-all duration-300 
                          hover:shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center 
                              text-white flex-shrink-0"
                     style={{ backgroundColor: cert.themeColor }}>
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-amber-700 
                               transition-colors mb-1">
                    {cert.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-2">{cert.issuer}</p>
                  <div className="flex flex-wrap gap-2">
                    {cert.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} 
                            className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">{cert.year}</div>
                  <div className="text-xs text-slate-500">{cert.duration}</div>
                </div>
              </div>
              <p className="text-slate-600 text-sm line-clamp-2">
                {cert.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
