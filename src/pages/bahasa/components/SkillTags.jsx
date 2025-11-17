import React from "react";
import { motion } from "framer-motion";
import { generateColor } from "../utils/colorGenerator";

export const SkillTags = React.memo(({ skills, skillId, expandedTags, toggleExpandedTags }) => {
  const isExpanded = expandedTags[skillId] || false;
  const displaySkills = isExpanded ? skills : (skills || []).slice(0, 4);
  const hiddenCount = (skills || []).length - 4;

  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
      {displaySkills.map((skill, index) => {
        const color = generateColor(skill);
        return (
          <motion.span 
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`${color.bg} ${color.text} ${color.border} text-xs px-2 py-1 rounded-lg border backdrop-blur-sm whitespace-nowrap`}
          >
            {skill}
          </motion.span>
        );
      })}
      {!isExpanded && hiddenCount > 0 && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpandedTags(skillId);
          }}
          className="bg-gray-500/20 text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-500/30 hover:bg-gray-500/30 transition-all duration-200 backdrop-blur-sm"
        >
          +{hiddenCount}
        </motion.button>
      )}
    </div>
  );
});