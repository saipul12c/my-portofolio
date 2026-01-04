import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Zap, Code, Globe, X } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { Link } from "react-router-dom";
import { RelatedItems } from "./RelatedItems";
import { SkillResources } from "./SkillResources";
import { generateColor } from "../utils/colorGenerator";

const DetailTooltipComponent = React.memo(({ bahasa, isProgramming, onClose }) => {
  const renderSection = useCallback((title, icon, content, color = "cyan", isArray = true) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <h4 className={`font-semibold text-${color}-300 flex items-center text-sm sm:text-base`}>
          {icon}
          <span className="ml-2">{title}</span>
        </h4>
        {isArray && Array.isArray(content) ? (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {content.map((item, idx) => {
              const colorClass = generateColor(item);
              return (
                <span 
                  key={idx}
                  className={`${colorClass.bg} ${colorClass.text} ${colorClass.border} text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{content}</p>
        )}
      </motion.div>
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-500/40 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <button 
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-300 hover:text-white text-lg sm:text-xl transition-all duration-200 hover:scale-110 bg-cyan-500/10 p-1.5 sm:p-2 rounded-lg"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex items-center space-x-3 sm:space-x-4 pr-10 sm:pr-12">
            <motion.div 
              className="text-3xl sm:text-4xl p-2 sm:p-3 bg-cyan-500/10 rounded-xl sm:rounded-2xl"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              {bahasa.icon}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-xl sm:text-2xl truncate">{bahasa.nama}</h3>
              <p className="text-gray-300 font-medium text-sm sm:text-base truncate">{bahasa.tingkat}</p>
            </div>
            <motion.span 
              className={`
                px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-bold shadow-lg flex-shrink-0
                ${bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 
                  bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}
              `}
            >
              {bahasa.level}%
            </motion.span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar" style={{willChange: "scroll-position"}}>
          <div className="space-y-4 sm:space-y-6">
            {/* Simplified popup: only show essential & interesting info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300 flex items-center text-sm sm:text-base">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="ml-2">Tingkat Kemahiran</span>
                </h4>
                <ProgressBar level={bahasa.level} />
              </div>

              {bahasa.deskripsi && (
                <div>
                  <h4 className="font-semibold text-gray-300 text-sm sm:text-base flex items-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-2">Deskripsi Singkat</span>
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-1">{String(bahasa.deskripsi).slice(0, 220)}{String(bahasa.deskripsi).length > 220 ? '…' : ''}</p>
                </div>
              )}

              {bahasa.kemampuan && Array.isArray(bahasa.kemampuan) && bahasa.kemampuan.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-300 text-sm sm:text-base flex items-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-2">Kemampuan Utama</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bahasa.kemampuan.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-200 border border-cyan-500/20">{s}</span>
                    ))}
                    {bahasa.kemampuan.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-gray-800 text-gray-300 border border-gray-700">+{bahasa.kemampuan.length - 3} lainnya</span>
                    )}
                  </div>
                </div>
              )}

              {bahasa.pengalaman && (
                <div>
                  <h4 className="font-semibold text-gray-300 text-sm sm:text-base flex items-center">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-2">Ringkasan Pengalaman</span>
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-1">{String(bahasa.pengalaman).slice(0, 180)}{String(bahasa.pengalaman).length > 180 ? '…' : ''}</p>
                </div>
              )}

              <div className="pt-3 border-t border-cyan-500/20 flex gap-2">
                <Link to={`/bahasa/detail/${(bahasa.nama||"").toString().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-')}`} onClick={onClose} className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Lihat Detail</Link>
                <button onClick={onClose} className="flex-1 text-center border border-gray-700 text-gray-300 px-4 py-2 rounded-lg">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export const DetailTooltip = DetailTooltipComponent;
DetailTooltipComponent.displayName = "DetailTooltip";