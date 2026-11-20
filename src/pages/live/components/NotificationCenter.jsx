import React, { useState, useEffect } from 'react';
import { Bell, X, MessageCircle, User } from 'lucide-react';

export const MentionNotifications = ({ mentions = [], onDismiss }) => {
  const [notifications, setNotifications] = useState(mentions);

  useEffect(() => {
    setNotifications(mentions);
  }, [mentions]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-3 sm:top-4 right-3 sm:right-4 left-3 sm:left-auto z-50 space-y-2 max-w-md">
      {notifications.map((mention, idx) => (
        <div
          key={idx}
          className="bg-[var(--theme-surface)] rounded-2xl shadow-2xl border border-[var(--theme-border)] border-l-4 border-l-cyan-500 p-3.5 sm:p-4 backdrop-blur-xl animate-slide-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-[var(--theme-text)]">
                  <span className="text-cyan-400 font-black">@{mention.fromUser}</span> menyebut Anda
                </p>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1 truncate italic">
                  "{mention.messagePreview}"
                </p>
                <p className="text-[10px] text-[var(--theme-text-muted)] opacity-60 mt-1">{mention.time}</p>
              </div>
            </div>
            <button
              onClick={() => onDismiss?.(idx)}
              className="p-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] rounded-lg hover:bg-[var(--theme-surface-hover)] transition-colors shrink-0"
              title="Tutup"
            >
              <X className="w-4 h-4" />
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
      className="relative p-1.5 sm:p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)] rounded-xl transition-colors"
      title="Pusat Notifikasi"
    >
      <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] sm:text-xs rounded-full flex items-center justify-center font-black shadow-md shadow-red-500/30 animate-pulse">
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
