import React from 'react';

const IconButton = ({ children, title, onClick, className = '' }) => (
  <button title={title} onClick={onClick} className={`p-2 rounded hover:bg-[var(--dc-surface)] ${className}`}>
    {children}
  </button>
);

export default IconButton;
