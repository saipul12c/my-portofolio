import React from 'react';

export default function MessageReactions({ messageId, onReact }) {
  return (
    <div className="dc-message-reactions">
      <button onClick={() => onReact && onReact('👍', messageId)}>👍</button>
      <button onClick={() => onReact && onReact('❤️', messageId)}>❤️</button>
      <button onClick={() => onReact && onReact('🔥', messageId)}>🔥</button>
    </div>
  );
}
