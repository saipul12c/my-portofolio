import React from "react";
import { Link } from "react-router-dom";
import { Zap, Heart, ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * SoftSkillsSection component - displays top soft skills with links to detail and /SoftSkills
 */
export const SoftSkillsSection = ({ skills = [] }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Keahlian & Soft Skills Utama"
        description="Karakteristik interpersonal, kepemimpinan, dan komunikasi profesional"
        icon={<Zap className="w-5 h-5 text-amber-400" />}
        to="/SoftSkills"
        linkText="Lihat Seluruh Soft Skills"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {skills.map((skill) => (
          <Link
            key={skill.id}
            to={`/SoftSkills/${skill.id}`}
            className="group p-3.5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
                {skill.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {skill.level || `${skill.experience || 90}%`}
              </span>
            </div>
            <div className="w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-500 group-hover:from-cyan-400 group-hover:to-blue-500"
                style={{ width: `${Math.min(100, Math.max(20, skill.experience || 85))}%` }}
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end">
        <Link
          to="/SoftSkills"
          className="text-xs text-slate-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium transition-colors"
        >
          <span>Eksplorasi seluruh soft skills & matriks kompetensi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
