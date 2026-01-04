import React from 'react';

export default function PictureInPicture({ onToggle }) {
  return (
    <div className="st-pip">
      <button onClick={() => onToggle && onToggle()}>Toggle PiP</button>
    </div>
  );
}
