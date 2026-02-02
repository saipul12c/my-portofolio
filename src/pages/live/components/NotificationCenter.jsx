import React, { useState, useEffect } from 'react';
import { Bell, X, MessageCircle, User } from 'lucide-react';

export const MentionNotifications = ({ mentions = [], onDismiss }) => {
  const [notifications, setNotifications] = useState(mentions);

  useEffect(() => {
    setNotifications(mentions);
  }, [mentions]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((mention, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 animate-slide-in"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  <span className="text-blue-600">{mention.fromUser}</span> menyebut Anda
                </p>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {mention.messagePreview}
                </p>
                <p className="text-xs text-gray-500 mt-1">{mention.time}</p>
              </div>
            </div>
            <button
              onClick={() => onDismiss?.(idx)}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const NotificationCenter = ({ unreadCount = 0, onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export const PersonalTagsManager = ({ tags = [], onAddTag, onRemoveTag }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag?.(newTag);
      setNewTag('');
      setShowForm(false);
    }
  };

  return (
    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
      <h4 className="font-bold text-purple-900 mb-3">Personal Tags</h4>
      
      <div className="space-y-2 mb-4">
        {tags.map((tag, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-purple-200">
            <span className="text-sm text-purple-900">
              <span className="font-medium">#{tag.name}</span> - {tag.userName}
            </span>
            <button
              onClick={() => onRemoveTag?.(idx)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-3 py-2 text-sm border border-purple-300 text-purple-700 rounded hover:bg-purple-100 transition-colors"
        >
          + Tambah Tag Personal
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="e.g., #bestfriend"
            className="w-full px-3 py-2 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewTag('');
              }}
              className="flex-1 px-3 py-2 text-sm border border-purple-300 text-purple-700 rounded hover:bg-purple-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
