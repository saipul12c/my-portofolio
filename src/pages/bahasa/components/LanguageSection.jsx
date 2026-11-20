import React, { memo } from "react";
import { SkillCard } from "./SkillCard";

const LanguageSectionComponent = ({
  title,
  data,
  icon,
  isProgramming = false,
  viewMode,
  expandedTags,
  toggleExpandedTags,
  searchTerm,
  filterLevel
}) => {
  if (data.length === 0 && !searchTerm && filterLevel === "all") return null;

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center space-x-2.5">
        <div className="text-2xl sm:text-3xl">{icon}</div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {data.length} item ditampilkan
          </p>
        </div>
      </div>

      <div className={viewMode === "grid" ?
        "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" :
        "space-y-2.5 sm:space-y-3"
      }>
        {data.map((item) => {
          const skillId = `${item.nama}-${isProgramming ? 'prog' : 'lang'}`;
          return (
            <SkillCard
              key={skillId}
              bahasa={item}
              isProgramming={isProgramming}
              isList={viewMode === "list"}
              isExpanded={!!expandedTags[skillId]}
              onToggle={() => toggleExpandedTags(skillId)}
            />
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm">
          Tidak ada item yang sesuai dengan filter
        </div>
      )}
    </section>
  );
};

export const LanguageSection = memo(LanguageSectionComponent);
LanguageSectionComponent.displayName = "LanguageSection";
