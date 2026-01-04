import React from "react";
import { Heart } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * SoftSkillsSection component - displays top soft skills
 */
export const SoftSkillsSection = ({ skills }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Soft Skills Utama"
        description="Keterampilan interpersonal dan profesional"
        icon={<Heart className="w-8 h-8 text-rose-500" />}
      />

      <div className="flex flex-wrap gap-3">
        {skills.map(skill => (
          <div key={skill.id}
               className="group px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 
                          border border-teal-100 rounded-xl hover:border-teal-300 
                          transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{skill.name}</span>
              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                {skill.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
