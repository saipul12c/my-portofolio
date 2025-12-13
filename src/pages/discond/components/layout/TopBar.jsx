import React from 'react';

const TopBar = ({ title, left, right, className = '' }) => {
  return (
    <div className={`h-12 border-b border-[rgba(255,255,255,0.06)] bg-[var(--dc-surface-2)] px-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {left}
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
};

export default TopBar;
