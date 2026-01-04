import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { iconMap } from "../../utils/iconMap";

/**
 * HobbiesSection component - displays top hobbies
 */
export const HobbiesSection = ({ hobbies }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Hobi & Minat"
        description="Aktivitas di luar pekerjaan untuk pengembangan diri"
        icon={<Heart className="w-8 h-8 text-rose-500" />}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {hobbies.map(hobby => {
          const IconComponent = iconMap[hobby.icon] || iconMap.Sparkles;
          return (
            <Link key={hobby.id} to={`/hobbies/${hobby.slug || hobby.id}`} 
                 className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                            rounded-xl p-4 text-center hover:border-rose-300 transition-all duration-300 
                            hover:shadow-lg">
              <div className={`inline-flex items-center justify-center w-12 h-12 
                            rounded-full mb-3 ${hobby.iconColor} 
                            bg-gradient-to-br from-white to-slate-100`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-1">
                {hobby.title}
              </h4>
              <div className="text-xs text-slate-500">
                {hobby.category}
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" 
                     style={{ width: `${hobby.stats.completion}%` }}></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
