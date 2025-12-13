import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';

export default function MembersList({ onClose }) {
  const { members } = useChat();
  const navigate = useNavigate();

  if (!members || members.length === 0) return <div className="p-3 text-gray-300">Tidak ada anggota yang terlihat.</div>;

  return (
    <div className="space-y-2">
      {members.map(m => (
        <div key={m.id} className="flex items-center justify-between bg-[#111216] p-2 rounded">
          <div>
            <div className="text-white font-medium">{m.username}</div>
            <div className="text-xs text-gray-400">{m.presence || 'offline'}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { navigate(`/discord/profile/${m.id}`); if (onClose) onClose(); }} className="px-2 py-1 bg-cyan-600 text-white rounded text-sm">Profil</button>
          </div>
        </div>
      ))}
    </div>
  );
}
