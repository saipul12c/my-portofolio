import React, { useMemo, useCallback } from "react";
import { generateColor } from "../utils/colorGenerator";

const SkillTagsComponent = ({ skills, isExpanded = false, onToggle }) => {
  const expanded = !!isExpanded;

  const { displaySkills, hiddenCount } = useMemo(() => {
    const list = skills || [];
    const display = expanded ? list : list.slice(0, 4);
    const hidden = Math.max(0, list.length - 4);
    return { displaySkills: display, hiddenCount: hidden };
  }, [skills, expanded]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    onToggle && onToggle();
  }, [onToggle]);

  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5 sm:mt-3">
      {displaySkills.map((skill) => {
        const color = generateColor(skill);
        return (
          <span 
            key={skill}
            className={`${color.bg} ${color.text} ${color.border} text-[11px] sm:text-xs px-2 py-0.5 rounded-md border whitespace-nowrap`}
          >
            {skill}
          </span>
        );
      })}
      {!expanded && hiddenCount > 0 && (
        <button
          onClick={handleToggle}
          className="bg-gray-500/20 text-gray-300 text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md border border-gray-500/30 hover:bg-gray-500/30 transition-colors duration-150 active:scale-95"
          aria-label={`Lihat ${hiddenCount} skill lainnya`}
        >
          +{hiddenCount}
        </button>
      )}
    </div>
  );
};

export const SkillTags = React.memo(SkillTagsComponent);
SkillTagsComponent.displayName = "SkillTags";
