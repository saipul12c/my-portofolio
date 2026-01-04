import React from "react";
import { motion } from "framer-motion";
import { SkillCard } from "./SkillCard";

const LanguageSectionComponent = ({ 
  title, 
  data, 
  icon, 
  isProgramming = false, 
  viewMode,
  setSelectedSkill,
  expandedTags,
  toggleExpandedTags,
  searchTerm,
  filterLevel
}) => {
  if (data.length === 0 && !searchTerm && filterLevel === "all") return null;

  return (
    <section className="space-y-4 sm:space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2 sm:space-x-3"
      >
        <div className="text-2xl sm:text-3xl">{icon}</div>
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h2>
          <p className="text-gray-300 text-sm sm:text-base">
            {data.length} item ditampilkan
          </p>
        </div>
      </motion.div>
      
      <div className={viewMode === "grid" ? 
        "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" : 
        "space-y-2 sm:space-y-3"
      }>
        {data.map((item, index) => {
          const skillId = `${item.nama}-${isProgramming ? 'prog' : 'lang'}`;
          return (
            <SkillCard 
              key={skillId}
              bahasa={item}
              isProgramming={isProgramming}
              delay={index * 50}
              isList={viewMode === "list"}
              setSelectedSkill={setSelectedSkill}
              isExpanded={!!expandedTags[skillId]}
              onToggle={() => toggleExpandedTags(skillId)}
            />
          );
        })}
      </div>

      {data.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <div className="text-gray-300 text-lg">Tidak ada item yang sesuai dengan filter</div>
        </motion.div>
      )}
    </section>
  );
};

export const LanguageSection = React.memo(LanguageSectionComponent);
LanguageSectionComponent.displayName = "LanguageSection";