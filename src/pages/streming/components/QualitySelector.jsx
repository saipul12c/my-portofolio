import React from 'react';

export default function QualitySelector({ options = [], onSelect }) {
  return (
    <select className="st-quality-selector" onChange={(e) => onSelect && onSelect(e.target.value)}>
      {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
    </select>
  );
}
