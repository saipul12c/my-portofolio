import React, { memo, useCallback } from 'react';
import { MdCheckCircle } from 'react-icons/md';

const DesktopPlatformCard = memo(({ 
  platform, 
  icon: Icon, 
  color,
  description = "Connect your account",
  url = null
}) => {
  // Checkbox status berdasarkan ada tidaknya URL
  const isConnected = url !== null;

  const handleCardClick = useCallback((e) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Akan segera hadir! Link untuk platform ini sedang dalam pengembangan.');
    }
  }, [url]);

  return (
    <div className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent ${
      isConnected ? `${color.bg} ${color.border} border` : 'hover:bg-gray-800/50'
    }`}>
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3 flex-1"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(e)}
        >
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-white/20' : 'bg-gray-700 group-hover:bg-gray-600'}`}>
            <Icon className={`w-4 h-4 ${isConnected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{platform}</p>
            <p className="text-xs text-gray-400">{description}</p>
            {!url && (
              <p className="text-xs text-yellow-400 mt-1">Coming Soon</p>
            )}
          </div>
        </div>
        
        <div className={`flex items-center justify-center transition-all ${
          isConnected ? 'opacity-100' : 'opacity-40'
        }`}>
          {isConnected ? (
            <MdCheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
});

DesktopPlatformCard.displayName = 'DesktopPlatformCard';

export default DesktopPlatformCard;
