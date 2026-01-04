import React from "react";
import { SLICE_LIMITS } from "../../utils/constants";

/**
 * CommitmentsSection component - displays values and commitments
 */
export const CommitmentsSection = ({ commitments }) => {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-slate-900 mb-3">Nilai & Komitmen</h4>
      <div className="flex flex-wrap gap-3">
        {commitments.slice(0, SLICE_LIMITS.commitments).map(c => (
          <div key={c.id} className="px-4 py-3 bg-white border border-slate-200 rounded-lg min-w-[220px]">
            <div className="font-semibold text-slate-900 mb-1">{c.title}</div>
            <div className="text-sm text-slate-700">{c.short_desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
