import React from 'react';
import PresenceDot from './PresenceDot';

const MessageBubble = ({ msg, member, sameAuthor }) => {
  const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div className={`flex space-x-3 p-2 ${sameAuthor ? 'mt-1' : ''}`}>
      {!sameAuthor && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--dc-cyan)] flex items-center justify-center text-white font-semibold">
            {msg.profiles?.avatar_url ? <img src={msg.profiles.avatar_url} alt={msg.profiles?.username} className="w-full h-full object-cover" /> : (msg.profiles?.username||'U').substring(0,2).toUpperCase()}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {!sameAuthor && (
          <div className="flex items-baseline space-x-2">
            <span className="message-author">{msg.profiles?.username || 'Unknown'}</span>
            <span className="message-time">{time}</span>
          </div>
        )}

        <div className="mt-1 text-gray-300 break-words">
          {msg.content}
        </div>

        {Array.isArray(msg.reactions) && msg.reactions.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            {msg.reactions.map(r => (
              <div key={r.emoji} className="flex items-center gap-1 bg-[var(--dc-surface)] text-sm text-gray-200 px-2 py-1 rounded cursor-pointer">
                <span>{r.emoji}</span>
                <span className="text-xs text-gray-300">{(r.users||[]).length}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
