import React from 'react';

export default function Chapters({ chapters = [] }) {
  return (
    <div className="st-chapters">
      <h4>Chapters</h4>
      <ul>{chapters.map((c, i) => <li key={i}>{c.start}s - {c.title}</li>)}</ul>
    </div>
  );
}
