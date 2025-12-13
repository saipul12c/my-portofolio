import React from 'react';

const SidebarItem = ({ icon, label, active = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
        active ? 'bg-[#42464d] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2f3136]'
      }`}
    >
      {icon && <div className="w-5 h-5">{icon}</div>}
      <div className="text-sm truncate">{label}</div>
    </div>
  );
};

export default SidebarItem;
