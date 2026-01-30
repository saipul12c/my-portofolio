import React, { memo } from 'react';

const Avatar = memo(() => (
  <div className="relative group">
    {/* Outer glow */}
    <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
    
    {/* Inner ring */}
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30" />
    
    {/* Avatar image */}
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-gray-900 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
      <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        YW
      </span>
    </div>
    
    {/* Online indicator */}
    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
  </div>
));

Avatar.displayName = 'Muhammad Syaiful Mukmin';

export default Avatar;
