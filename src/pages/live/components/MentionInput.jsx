import React, { useState, useRef } from 'react';
import { useMentions } from '../hooks/useMentions';
import { AtSign, X } from 'lucide-react';

export const MentionInput = ({ value, onChange, onMention }) => {
  const { searchUsers, mentionedUsers } = useMentions();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  // Handle input change dan deteksi @
  const handleInputChange = async (e) => {
    const text = e.target.value;
    onChange(text);

    // Cek jika ada @ di input
    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = text.substring(lastAtIndex + 1);
      
      // Jika character setelah @ adalah space atau belum ada kata, show suggestions
      if (afterAt.trim() === '' || /^[a-zA-Z0-9_]*$/.test(afterAt)) {
        setSearchQuery(afterAt.trim());
        await searchUsers(afterAt.trim());
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle select user untuk mention
  const handleSelectUser = (user) => {
    const lastAtIndex = value.lastIndexOf('@');
    const beforeAt = value.substring(0, lastAtIndex);
    const newValue = beforeAt + `@${user.nama} `;
    
    onChange(newValue);
    setShowSuggestions(false);
    setSearchQuery('');
    
    if (onMention) {
      onMention(user);
    }

    // Focus kembali ke input
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 mb-2">
        <AtSign className="w-4 h-4 text-blue-600" />
        <label className="text-sm font-medium text-gray-700">
          Mention seseorang dengan @ atau tulis secara normal
        </label>
      </div>

      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder="Tulis pesan... gunakan @nama untuk mention"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="4"
      />

      {/* Mention Suggestions Dropdown */}
      {showSuggestions && mentionedUsers.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {mentionedUsers.map((user) => (
            <button
              key={user.id || user.email}
              onClick={() => handleSelectUser(user)}
              className="w-full px-4 py-2 text-left hover:bg-blue-100 transition-colors flex items-center gap-2 border-b border-gray-100 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                {user.nama?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user.nama}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && mentionedUsers.length === 0 && searchQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3">
          <p className="text-sm text-gray-500 text-center">Tidak ada user ditemukan</p>
        </div>
      )}
    </div>
  );
};

export const PersonalTagDisplay = ({ userName, tag }) => {
  return (
    <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
      <span>{tag}</span>
      <span className="text-xs text-purple-600">untuk {userName}</span>
    </div>
  );
};
