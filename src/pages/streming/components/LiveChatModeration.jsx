import React from 'react';

export default function LiveChatModeration({ rules = [], onModerate }) {
  return (
    <div className="st-live-chat-moderation">
      <h4>Live Chat Moderation</h4>
      <button onClick={() => onModerate && onModerate()}>Run moderation</button>
    </div>
  );
}
