import React from 'react';

export default function Poll({ poll, onVote }) {
  return (
    <div className="dc-poll">
      <h4>{poll?.question}</h4>
      <div className="dc-poll-options">
        {(poll?.options || []).map((o, i) => (
          <button key={i} onClick={() => onVote && onVote(i)}>{o.text} ({o.votes})</button>
        ))}
      </div>
    </div>
  );
}
