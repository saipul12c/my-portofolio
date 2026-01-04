export function getFileIcon(extension) {
  const ext = (extension || '').toLowerCase();
  const icons = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'odt': '📝',
    'txt': '📃',
    'rtf': '📃',
    'xls': '📊',
    'xlsx': '📊',
    'csv': '📈',
    'tsv': '📈',
    'ppt': '📽️',
    'pptx': '📽️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'webp': '🖼️',
    'mp4': '🎞️',
    'mov': '🎞️',
    'mp3': '🎵',
    'wav': '🎵',
    'json': '⚙️',
    'ndjson': '⚙️',
    'md': '📋',
    'html': '🌐',
    'zip': '🗜️',
    '7z': '🗜️',
    'rar': '🗜️'
  };
  return icons[ext] || '📁';
}

import React from 'react';

// React helper component to render accessible file icons (uses emoji fallback)
export function FileIcon({ extension, label, className }) {
  const icon = getFileIcon(extension);
  const text = label || extension || 'file';
  return (
    typeof document !== 'undefined' ?
      (React && React.createElement ? React.createElement('span', { role: 'img', 'aria-label': text, className }, icon) : icon)
    : icon
  );
}
