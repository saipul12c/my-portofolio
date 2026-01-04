import React from 'react';

export default function AttachmentPreview({ url, type }) {
  if (!url) return null;
  return (
    <div className="dc-attachment-preview">
      {type && type.startsWith('image') ? <img src={url} alt="attachment" /> : <a href={url} target="_blank" rel="noreferrer">Open attachment</a>}
    </div>
  );
}
