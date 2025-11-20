import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Zap, Code, Globe, X } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { RelatedItems } from "./RelatedItems";
import { SkillResources } from "./SkillResources";
import { generateColor } from "../utils/colorGenerator";
import { useRelatedProjects } from "../hooks/useRelatedProjects";
import { useRelatedSkills } from "../hooks/useRelatedSkills";
import { useRelatedBlogPosts } from "../hooks/useRelatedBlogPosts";

export const DetailTooltip = React.memo(({ bahasa, isProgramming, onClose }) => {
  // Fetch related content
  const relatedProjects = useRelatedProjects(bahasa.nama);
  const relatedSkills = useRelatedSkills(bahasa.nama, isProgramming);
  const relatedBlogPosts = useRelatedBlogPosts(bahasa.nama);
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
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-cyan-300 hover:text-white text-lg sm:text-xl transition-all duration-200 hover:scale-110 bg-cyan-500/10 p-1.5 sm:p-2 rounded-lg"
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
              <p className="text-cyan-300 font-medium text-sm sm:text-base truncate">{bahasa.tingkat}</p>
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
            {/* Progress */}
            <div className="space-y-3">
              <h4 className="font-semibold text-cyan-300 flex items-center text-sm sm:text-base">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="ml-2">Tingkat Kemahiran</span>
              </h4>
              <ProgressBar level={bahasa.level} />
            </div>

            {/* Description */}
            {bahasa.deskripsi && renderSection("Deskripsi", <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.deskripsi, "cyan", false)}

            {/* Skills */}
            {bahasa.kemampuan && renderSection("Kemampuan", <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.kemampuan, "cyan")}

            {/* Programming-specific sections */}
            {isProgramming && (
              <>
                {bahasa.framework && renderSection("Framework & Tools", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.framework, "blue")}
                {bahasa.libraries && renderSection("Libraries", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.libraries, "purple")}
                {bahasa.ecosystem && renderSection("Ecosystem", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.ecosystem, "green")}
                {bahasa.tools && renderSection("Tools", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.tools, "orange")}
                {bahasa.variasi && renderSection("Database Variants", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.variasi, "teal")}
              </>
            )}

            {/* Experience */}
            {bahasa.pengalaman && renderSection("Pengalaman", <Globe className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.pengalaman, "cyan", false)}

            {/* Additional Details */}
            {bahasa.detailTambahan && Object.entries(bahasa.detailTambahan).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <h4 className="font-semibold text-cyan-300 text-sm sm:text-base capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{value}</p>
              </motion.div>
            ))}

            {/* Certification */}
            {bahasa.sertifikasi && (
              typeof bahasa.sertifikasi === 'object' ? 
              renderSection("Sertifikasi", <Target className="w-4 h-4 sm:w-5 sm:h-5" />, `${bahasa.sertifikasi.nama}: ${bahasa.sertifikasi.score} (${bahasa.sertifikasi.equivalent})`, "cyan", false) :
              renderSection("Sertifikasi", <Target className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.sertifikasi, "cyan", false)
            )}

            {/* Learning Goals */}
            {bahasa.target && renderSection("Target Belajar", <Target className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.target, "cyan", false)}

            {/* Related Items Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4 sm:pt-6 border-t border-cyan-500/20"
            >
              <SkillResources skillName={bahasa.nama} isProgramming={isProgramming} />
              <RelatedItems 
                projects={relatedProjects}
                blogPosts={relatedBlogPosts}
                skills={relatedSkills}
                skillName={bahasa.nama}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});