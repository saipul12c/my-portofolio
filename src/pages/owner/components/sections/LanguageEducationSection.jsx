import React from "react";
import { Globe } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { ColorTag } from "../ui/ColorTag";
import { generateColorFromString } from "../../utils/helpers";
import { SLICE_LIMITS } from "../../utils/constants";

/**
 * LanguageEducationSection component - displays languages and education
 */
export const LanguageEducationSection = ({ bahasaData, pendidikanData }) => {
  return (
    <div className="mb-8">
      <SectionHeader 
        title="Bahasa & Pendidikan"
        description="Kemampuan bahasa dan latar belakang pendidikan"
        icon={<Globe className="w-8 h-8" />}
      />

      <div className="mb-4">
        <h4 className="text-md font-semibold text-slate-800 mb-2">Bahasa</h4>
        <div className="flex flex-wrap gap-3">
          {(bahasaData.bahasaSehariHari || []).map((b, i) => (
            <div key={i}>
              <ColorTag label={`${b.nama} • ${b.tingkat}`} color={b.warna} icon={b.icon} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-slate-800 mb-2">Pendidikan (pilihan)</h4>
        <div className="flex flex-wrap gap-3 items-center">
          {(pendidikanData.education || []).slice(0, SLICE_LIMITS.pendidikan).map((e, i) => (
            <div key={i}>
              <ColorTag
                label={`${e.degree} ${e.year ? `• ${e.year}` : ''}`}
                color={generateColorFromString(e.institution)}
                icon={e.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
