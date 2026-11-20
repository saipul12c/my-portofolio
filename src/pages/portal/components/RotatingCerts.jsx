import React, { useState, useEffect, memo } from 'react';
import { MdOpenInNew } from 'react-icons/md';

const RotatingCerts = memo(({ certificates = [], openCertModal, maxDisplay = 6, isMobile = false }) => {
  const [displayedCerts, setDisplayedCerts] = useState([]);

  useEffect(() => {
    if (certificates.length > 0) {
      setDisplayedCerts(certificates.slice(0, maxDisplay));
    }
  }, [certificates, maxDisplay]);

  useEffect(() => {
    if (certificates.length <= maxDisplay) return;

    const interval = setInterval(() => {
      setDisplayedCerts((prev) => {
        const next = [...prev];
        const indexToReplace = Math.floor(Math.random() * Math.min(next.length, maxDisplay));
        const displayedIds = new Set(prev.map((c) => c.id));
        const available = certificates.filter((c) => !displayedIds.has(c.id));

        if (available.length > 0) {
          next[indexToReplace] = available[Math.floor(Math.random() * available.length)];
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [certificates, maxDisplay]);

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {displayedCerts.map((cert) => (
          <div
            key={cert.id}
            onClick={() => openCertModal?.(cert)}
            className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 flex justify-between items-center active:scale-95 transition-all group cursor-pointer"
          >
            <div className="flex flex-col pr-2 min-w-0">
              <span className="text-white text-xs font-bold group-hover:text-cyan-400 transition-colors line-clamp-1 truncate">
                {cert.title}
              </span>
              <span className="text-[9px] text-gray-500 truncate">{cert.issuer}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">
                {cert.year}
              </span>
              <MdOpenInNew className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayedCerts.map((cert) => (
        <div
          key={cert.id}
          onClick={() => openCertModal?.(cert)}
          className="text-xs flex items-center justify-between hover:bg-gray-800/50 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-700 active:scale-95 group"
        >
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-gray-300 font-medium group-hover:text-white transition-colors truncate">
              {cert.title}
            </span>
            <span className="text-[10px] text-gray-500 truncate">{cert.issuer}</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
              cert.themeColor ? '' : 'bg-blue-500/10 text-blue-400'
            }`}
            style={cert.themeColor ? { backgroundColor: `${cert.themeColor}20`, color: cert.themeColor } : {}}
          >
            {cert.year}
          </span>
        </div>
      ))}
    </div>
  );
});

RotatingCerts.displayName = 'RotatingCerts';
export default RotatingCerts;
