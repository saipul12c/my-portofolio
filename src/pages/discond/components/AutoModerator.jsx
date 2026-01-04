import React from 'react';

export default function AutoModerator({ rules = [], onApply }) {
  return (
    <div className="dc-auto-moderator">
      <h4>Auto Moderator</h4>
      <ul>{rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
      <button onClick={() => onApply && onApply()}>Apply Rules</button>
    </div>
  );
}
