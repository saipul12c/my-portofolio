import React from "react";
import { VISION_MISSION } from "../../utils/constants";

/**
 * VisionMissionSection component - displays vision and mission
 */
export const VisionMissionSection = () => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl p-6 border border-teal-100">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Visi & Misi</h3>
      <p className="text-slate-700 leading-relaxed mb-4">
        {VISION_MISSION.vision} {VISION_MISSION.mission}
      </p>
      <div className="flex flex-wrap gap-3">
        {VISION_MISSION.values.map((value, index) => (
          <span key={index} className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
