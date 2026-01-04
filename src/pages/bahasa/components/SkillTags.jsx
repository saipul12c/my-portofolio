import React, { useMemo, useCallback } from "react";
import { generateColor } from "../utils/colorGenerator";

const SkillTagsComponent = ({ skills, skillId, isExpanded = false, onToggle }) => {
  const expanded = !!isExpanded;

  const { displaySkills, hiddenCount } = useMemo(() => {
    const display = expanded ? skills : (skills || []).slice(0, 4);
    const hidden = Math.max(0, (skills || []).length - 4);
    return { displaySkills: display, hiddenCount: hidden };
  }, [skills, expanded]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    onToggle && onToggle();
  }, [onToggle]);

  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
      {displaySkills.map((skill, index) => {
        const color = generateColor(skill);
        return (
          <span 
            key={index}
            className={`${color.bg} ${color.text} ${color.border} text-xs px-2 py-1 rounded-lg border whitespace-nowrap`}
          >
            {skill}
          </span>
        );
      })}
      {!expanded && hiddenCount > 0 && (
        <button
          onClick={handleToggle}
          className="bg-gray-500/20 text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-500/30 hover:bg-gray-500/30 transition-all duration-200"
        >
          +{hiddenCount}
        </button>
      )}
    </div>
  );
};

export const SkillTags = React.memo(SkillTagsComponent);
SkillTagsComponent.displayName = "SkillTags";