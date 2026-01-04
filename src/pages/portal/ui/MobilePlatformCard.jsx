import React, { memo, useCallback } from 'react';
import { MdCheckCircle } from 'react-icons/md';

const MobilePlatformCard = memo(({ 
  platform, 
  icon: Icon,
  username = "@username",
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
    <div className="relative p-4 rounded-2xl border-2 transition-all duration-300 transform active:scale-95 cursor-pointer touch-manipulation border-gray-700 bg-gray-900/50 hover:border-gray-600">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3 flex-1"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(e)}
        >
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-white/20' : 'bg-gray-800'}`}>
            <Icon className={`w-5 h-5 ${isConnected ? 'text-white' : 'text-gray-400'}`} />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white">{platform}</p>
            <p className="text-xs text-gray-400 truncate max-w-[120px]">{username}</p>
            {!url && (
              <p className="text-xs text-yellow-400 mt-1">Akan segera hadir</p>
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

MobilePlatformCard.displayName = 'MobilePlatformCard';

export default MobilePlatformCard;
