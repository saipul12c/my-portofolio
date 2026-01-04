import React from 'react';

export default function WatchHistory({ items = [] }) {
  return (
    <div className="st-watch-history">
      <h4>Watch History</h4>
      <ul>{items.map((it, i) => <li key={i}>{it.title}</li>)}</ul>
    </div>
  );
}
