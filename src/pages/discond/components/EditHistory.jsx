import React from 'react';

export default function EditHistory({ messageId, edits = [] }) {
  return (
    <div className="dc-edit-history">
      <h4>Edit history</h4>
      <ul>
        {edits.map((e, i) => <li key={i}>{new Date(e.ts).toLocaleString()}: {e.content}</li>)}
      </ul>
    </div>
  );
}
