import React from 'react';

export default function SlashCommands({ onCommand }) {
  return (
    <div className="dc-slash-commands">
      <input placeholder="Type / to run a command" onKeyDown={(e) => {
        if (e.key === 'Enter') onCommand && onCommand(e.target.value);
      }} />
    </div>
  );
}
