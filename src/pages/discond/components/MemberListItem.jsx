import React from 'react';
import PresenceDot from './PresenceDot';

const MemberListItem = ({ member, onClick }) => {
  const initials = (member.username || member.name || 'U').substring(0, 2).toUpperCase();
  return (
    <div onClick={() => onClick && onClick(member)} className="flex items-center gap-3 px-2 py-1 rounded hover:bg-[var(--dc-surface)] cursor-pointer select-none">
      <div className="relative w-8 h-8 flex-shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: member.color || 'var(--dc-surface)' }}>{initials}</div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 flex items-center justify-center bg-[var(--dc-bg)] rounded-full">
          <PresenceDot presence={member.presence} size={10} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className={`truncate text-sm ${member.status === 'online' ? 'text-white' : 'text-gray-300'}`}>{member.username || member.name}</div>
        <div className="text-xs text-gray-400 truncate">{member.status ? member.status.toUpperCase() : ''}</div>
      </div>
    </div>
  );
};

export default MemberListItem;
