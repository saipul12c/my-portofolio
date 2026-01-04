import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { SkillTags } from "./SkillTags";
import { Link } from "react-router-dom";

const SkillCardComponent = ({ 
  bahasa, 
  isProgramming = false, 
  delay = 0, 
  isList = false,
  setSelectedSkill,
  isExpanded = false,
  onToggle
}) => {
  const skillId = useMemo(() => `${bahasa.nama}-${isProgramming ? 'prog' : 'lang'}`, [bahasa.nama, isProgramming]);

  const slug = useMemo(() => {
    return (bahasa.nama || "").toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  }, [bahasa.nama]);

  const handleClick = useCallback(() => {
    if (typeof setSelectedSkill === 'function') {
      setSelectedSkill({ ...bahasa, isProgramming });
    }
  }, [setSelectedSkill, bahasa, isProgramming]);

  const CardContent = () => (
    <>
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <motion.div 
            className="text-2xl sm:text-3xl p-2 sm:p-3 bg-cyan-500/10 rounded-xl sm:rounded-2xl group-hover:bg-cyan-500/20 transition-colors duration-300 flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            {bahasa.icon}
          </motion.div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-lg sm:text-xl leading-tight truncate">{bahasa.nama}</h3>
            <p className="text-gray-300 font-medium mt-0.5 sm:mt-1 text-sm truncate">{bahasa.tingkat}</p>
          </div>
        </div>
        
        <motion.span 
          className={`
            px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex-shrink-0 ml-2
            ${bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 
              bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 
              bahasa.level >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 
              'bg-gradient-to-r from-orange-500 to-red-500 text-white'}
          `}
          whileHover={{ scale: 1.05 }}
        >
          {bahasa.level}%
        </motion.span>
      </div>

      <ProgressBar level={bahasa.level} showLabel={false} />

      <SkillTags 
        skills={bahasa.kemampuan} 
        skillId={skillId}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      <motion.div 
        className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center space-x-2">
          <Link to={`/bahasa/detail/${slug}`} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center space-x-1 hover:opacity-95">
            <span className="hidden sm:inline">Detail</span>
            <span>→</span>
          </Link>
        </div>
      </motion.div>
    </>
  );

  const ListContent = () => (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
        <motion.div 
          className="text-2xl p-2 bg-cyan-500/10 rounded-xl flex-shrink-0"
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          {bahasa.icon}
        </motion.div>
        
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-1">
            <h3 className="font-bold text-white text-lg truncate">{bahasa.nama}</h3>
            <span className="text-gray-300 text-sm font-medium whitespace-nowrap">{bahasa.tingkat}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-full sm:max-w-xs">
              <ProgressBar level={bahasa.level} showLabel={false} />
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-bold self-start sm:self-auto
              ${bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 
                bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 
                'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}
            `}>
              {bahasa.level}%
            </span>
          </div>

          <SkillTags 
            skills={bahasa.kemampuan} 
            skillId={skillId}
            isExpanded={isExpanded}
            onToggle={onToggle}
          />
        </div>
      </div>

      <motion.div 
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2 sm:ml-4 flex-shrink-0"
        whileHover={{ scale: 1.05 }}
      >
        <Link to={`/bahasa/detail/${slug}`} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full inline-flex items-center justify-center">
          <span className="hidden sm:inline">Detail</span>
          <span className="sm:hidden">→</span>
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div
      className={`
        group relative bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 
        rounded-2xl sm:rounded-3xl border border-cyan-500/20 cursor-pointer overflow-hidden
        hover:border-cyan-500/40 transition-all duration-300
        ${isList ? "p-4 sm:p-6" : "p-4 sm:p-6"}
      `}
      onClick={handleClick}
      style={{ animationDelay: `${delay}ms`, willChange: "transform" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {isList ? <ListContent /> : <CardContent />}
      </div>
    </div>
  );
};

const areEqual = (prev, next) => {
  return (
    prev.bahasa?.nama === next.bahasa?.nama &&
    prev.bahasa?.level === next.bahasa?.level &&
    prev.isList === next.isList &&
    prev.isProgramming === next.isProgramming &&
    prev.isExpanded === next.isExpanded
  );
};

export const SkillCard = React.memo(SkillCardComponent, areEqual);