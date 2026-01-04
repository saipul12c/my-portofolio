import React from 'react';

export default function SubtitlesToggle({ enabled, onToggle }) {
  return (
    <button className="st-subtitles-toggle" onClick={() => onToggle && onToggle(!enabled)}>
      {enabled ? 'Disable Subtitles' : 'Enable Subtitles'}
    </button>
  );
}
