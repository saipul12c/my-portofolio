import React, { memo } from "react";
import { ProgressBar } from "./ProgressBar";
import { SkillTags } from "./SkillTags";
import { Link, useNavigate } from "react-router-dom";

const SkillCardComponent = ({
  bahasa,
  isList = false,
  isExpanded = false,
  onToggle
}) => {
  const navigate = useNavigate();
  const slug = bahasa._slug;

  const levelBadgeClass = 
    bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' :
    bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' :
    bahasa.level >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
    'bg-gradient-to-r from-orange-500 to-red-500 text-white';

  if (isList) {
    return (
      <div
        className="group relative bg-[#1e293b]/70 hover:bg-[#1e293b]/90 rounded-2xl border border-cyan-500/20 cursor-pointer overflow-hidden hover:border-cyan-500/40 transition-colors duration-200 p-3.5 sm:p-5"
        onClick={() => navigate(`/bahasa/detail/${slug}`)}
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 110px" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="text-2xl p-2 bg-cyan-500/10 rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              {bahasa.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1.5 gap-0.5">
                <h3 className="font-bold text-white text-base sm:text-lg truncate group-hover:text-cyan-300 transition-colors">
                  {bahasa.nama}
                </h3>
                <span className="text-gray-400 text-xs sm:text-sm font-medium whitespace-nowrap">{bahasa.tingkat}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 max-w-full sm:max-w-xs">
                  <ProgressBar level={bahasa.level} showLabel={false} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold self-start sm:self-auto ${levelBadgeClass}`}>
                  {bahasa.level}%
                </span>
              </div>

              <SkillTags
                skills={bahasa.kemampuan}
                isExpanded={isExpanded}
                onToggle={onToggle}
              />
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 sm:ml-4 flex-shrink-0">
            <Link 
              to={`/bahasa/detail/${slug}`} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full inline-flex items-center justify-center hover:opacity-95"
            >
              <span className="hidden sm:inline">Detail</span>
              <span className="sm:hidden">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-[#1e293b]/70 hover:bg-[#1e293b]/90 rounded-2xl border border-cyan-500/20 cursor-pointer overflow-hidden hover:border-cyan-500/40 transition-colors duration-200 p-4 sm:p-5 flex flex-col justify-between"
      onClick={() => navigate(`/bahasa/detail/${slug}`)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 170px" }}
    >
      <div>
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl p-2 sm:p-2.5 bg-cyan-500/10 rounded-xl group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all duration-200 flex-shrink-0">
              {bahasa.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-base sm:text-lg leading-tight truncate group-hover:text-cyan-300 transition-colors">
                {bahasa.nama}
              </h3>
              <p className="text-gray-400 font-medium mt-0.5 text-xs sm:text-sm truncate">{bahasa.tingkat}</p>
            </div>
          </div>

          <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md flex-shrink-0 ml-2 ${levelBadgeClass}`}>
            {bahasa.level}%
          </span>
        </div>

        <ProgressBar level={bahasa.level} showLabel={false} />

        <SkillTags
          skills={bahasa.kemampuan}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      </div>

      <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link 
          to={`/bahasa/detail/${slug}`} 
          onClick={(e) => e.stopPropagation()} 
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 hover:opacity-95"
        >
          <span>Detail</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

const areEqual = (prev, next) => {
  return (
    prev.bahasa?.nama === next.bahasa?.nama &&
    prev.bahasa?.level === next.bahasa?.level &&
    prev.isList === next.isList &&
    prev.isExpanded === next.isExpanded
  );
};

export const SkillCard = memo(SkillCardComponent, areEqual);
SkillCardComponent.displayName = "SkillCard";
