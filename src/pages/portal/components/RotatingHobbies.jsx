import React, { useState, useEffect, memo } from 'react';
import { MdOpenInNew } from 'react-icons/md';
import hobbiesData from '../../../data/hub/hobbiesData.json';
import { iconMap } from '../../owner/utils/iconMap';
import { generateSlug } from '../../hub/utils/hobbyUtils';

const processedHobbies = hobbiesData.map((h) => ({
  ...h,
  slug: generateSlug(h.title)
}));

const RotatingHobbies = memo(({ navigate, isMobile = false }) => {
  const [displayedHobbies, setDisplayedHobbies] = useState(() => processedHobbies.slice(0, 6));

  useEffect(() => {
    if (processedHobbies.length <= 6) return;

    const interval = setInterval(() => {
      setDisplayedHobbies((prev) => {
        const next = [...prev];
        const indexToReplace = Math.floor(Math.random() * next.length);
        const displayedIds = new Set(prev.map((h) => h.id));
        const available = processedHobbies.filter((h) => !displayedIds.has(h.id));

        if (available.length > 0) {
          next[indexToReplace] = available[Math.floor(Math.random() * available.length)];
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {displayedHobbies.map((hobby) => {
          const IconComponent = iconMap[hobby.icon];
          const completion = hobby.stats?.completion || 0;
          return (
            <div
              key={hobby.id}
              onClick={() => navigate(`/hobbies/${hobby.slug}`)}
              className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 active:scale-95 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-gray-800">
                    {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${hobby.iconColor || 'text-gray-400'}`} />}
                  </span>
                  <span className="text-white text-xs font-medium">{hobby.title}</span>
                </div>
                <span className="text-[9px] text-gray-500 font-mono">{completion}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-1 rounded-full bg-gradient-to-r ${hobby.color || 'from-blue-500 to-cyan-400'} transition-all duration-1000 ease-in-out`}
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedHobbies.map((hobby) => {
        const IconComponent = iconMap[hobby.icon];
        const completion = hobby.stats?.completion || 0;
        return (
          <div
            key={hobby.id}
            onClick={() => navigate(`/hobbies/${hobby.slug}`)}
            className="group text-xs hover:bg-gray-800/50 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-700 active:scale-95"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors">
                  {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${hobby.iconColor || 'text-gray-400'}`} />}
                </span>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{hobby.title}</span>
              </div>
              <MdOpenInNew className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${hobby.color || 'from-blue-500 to-cyan-400'} transition-all duration-1000 ease-in-out`}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-gray-500 text-[10px] w-8 text-right font-mono">{completion}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

RotatingHobbies.displayName = 'RotatingHobbies';
export default RotatingHobbies;
