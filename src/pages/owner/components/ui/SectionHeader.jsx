import React from "react";

/**
 * SectionHeader component - displays a section title with icon and description
 */
export const SectionHeader = ({ title, description, icon }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600">{description}</p>}
    </div>
    {icon && <div className="text-teal-600">{icon}</div>}
  </div>
);
