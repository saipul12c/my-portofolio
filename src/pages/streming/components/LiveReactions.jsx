import React from 'react';

export default function LiveReactions({ onReact }) {
  return (
    <div className="st-live-reactions">
      <button onClick={() => onReact && onReact('👏')}>👏</button>
      <button onClick={() => onReact && onReact('❤️')}>❤️</button>
    </div>
  );
}
