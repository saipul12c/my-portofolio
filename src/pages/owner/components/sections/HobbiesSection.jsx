import React from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { iconMap } from "../../utils/iconMap";

/**
 * HobbiesSection component - displays top hobbies and personal interests
 */
export const HobbiesSection = ({ hobbies = [] }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Hobi & Ketertarikan Pribadi"
        description="Eksplorasi kreativitas di luar dunia formal untuk menjaga keseimbangan hidup"
        icon={<Heart className="w-5 h-5 text-rose-400" />}
        to="/hobbies"
        linkText="Semua Hobi"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {hobbies.map((hobby) => {
          const IconComponent = iconMap[hobby.icon] || iconMap.Sparkles || Sparkles;
          return (
            <Link
              key={hobby.id}
              to={`/hobbies/${hobby.slug || hobby.id}`}
              className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-rose-500/40 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/5 flex flex-col items-center justify-between"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                <IconComponent className="w-5 h-5" />
              </div>

              <div>
                <h5 className="font-bold text-white text-xs sm:text-sm group-hover:text-rose-300 transition-colors line-clamp-1 mb-0.5">
                  {hobby.title}
                </h5>
                <span className="text-[10px] text-slate-400 block mb-2">
                  {hobby.category || "Personal"}
                </span>
              </div>

              {hobby.stats?.completion && (
                <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-1 rounded-full"
                    style={{ width: `${hobby.stats.completion}%` }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
