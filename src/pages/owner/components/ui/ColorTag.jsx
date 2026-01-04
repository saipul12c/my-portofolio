import React from "react";
import { pickTextColor } from "../../utils/helpers";

/**
 * ColorTag component - displays a colored tag with optional icon
 */
export const ColorTag = ({ label, color, icon }) => (
  <span
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
    style={{ background: color || '#e2e8f0', color: pickTextColor(color) }}
  >
    {icon ? <span className="text-sm">{icon}</span> : null}
    <span>{label}</span>
  </span>
);
