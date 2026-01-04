import React from 'react';

export default function ClipCreator({ videoId, onCreate }) {
  return (
    <div className="st-clip-creator">
      <button onClick={() => onCreate && onCreate({ videoId, start: 0, end: 15 })}>Create 15s clip</button>
    </div>
  );
}
