import React, { useState } from 'react';
import { Trophy, Award, Star } from 'lucide-react';

export const AchievementBadge = ({ achievement, locked = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center text-2xl
        ${locked ? 'bg-gray-300 opacity-50 cursor-not-allowed' : 'bg-yellow-100 cursor-pointer hover:scale-110 transition-transform'}
      `}>
        {achievement.icon}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap">
            <p className="font-bold">{achievement.name}</p>
            <p className="text-yellow-300">+{achievement.points} pts</p>
            <p className="text-gray-300 text-xs">{achievement.description}</p>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export const AchievementsSection = ({ achievements, totalPoints }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mt-6 border border-yellow-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
        </div>
        <div className="flex items-center gap-2 bg-yellow-200 px-4 py-2 rounded-full">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="font-bold text-yellow-900">{totalPoints} pts</span>
        </div>
      </div>

      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {achievements.map((ach) => (
            <AchievementBadge key={ach.achievement_id} achievement={ach} locked={false} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">
          Mulai buat aktivitas untuk membuka achievement! 🚀
        </p>
      )}
    </div>
  );
};
