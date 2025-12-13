import React from 'react';

const EmptyState = ({ title = 'Kosong', message = 'Belum ada konten di sini.', icon = null, action = null }) => {
  return (
    <div className="p-6 text-center text-gray-300">
      <div className="mx-auto w-20 h-20 rounded-full bg-[#2b2e33] flex items-center justify-center mb-4">
        {icon || <span className="text-3xl">💬</span>}
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{message}</p>
      {action ? (
        <div className="flex items-center justify-center">{action}</div>
      ) : null}
    </div>
  );
};

export default EmptyState;
