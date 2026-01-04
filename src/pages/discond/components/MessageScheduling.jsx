import React from 'react';

export default function MessageScheduling({ onSchedule }) {
  return (
    <div className="dc-message-scheduling">
      <button onClick={() => onSchedule && onSchedule({ at: Date.now() + 60000 })}>Schedule in 1m</button>
    </div>
  );
}
