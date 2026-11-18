import React from 'react';

const IconButton = ({ children, title, onClick, className = '' }) => (
  <button title={title} onClick={onClick} className={`p-2 rounded hover:bg-[#40444b] ${className}`}>
    {children}
  </button>
);

export default IconButton;
